import * as nearAPI from "near-api-js";
import BN from 'bn.js';

import config from '../config';
import { parseSeedPhrase } from '../utils';
import apiHelper from "../apiHelper";

const {
  transactions: {
    functionCall
  },
  utils: {
    format: {
      parseNearAmount,
    }
  },
} = nearAPI;

const { nodeUrl, network } = config;

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
// FT_MINIMUM_STORAGE_BALANCE: nUSDC, nUSDT require minimum 0.0125 NEAR. Came to this conclusion using trial and error.
const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

// set this to the same value as we use for creating an account and the remainder is refunded
const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');

// contract might require an attached depositof of at least 1 yoctoNear on transfer methods
// "This 1 yoctoNEAR is not enforced by this standard, but is encouraged to do. While ability to receive attached deposit is enforced by this token."
// from: https://github.com/near/NEPs/issues/141
const FT_TRANSFER_DEPOSIT = '1';

const STAKING_GAS_BASE = '25000000000000'; // 25 Tgas

/**
 * Generate an account just to query
 * @param {*} network Blcokchain's network: mainnet, testnet, betanet
 * @returns A view account
 */
export const getViewAccount = (network) => {
  const connection = nearAPI.Connection.fromConfig({
    networkId: network,
    provider: { type: 'JsonRpcProvider', args: { url: nodeUrl + '/' } },
    signer: {},
  })

  const account = new nearAPI.Account(connection, 'dontcare');
  return account;
}

/**
 * Generate connected near account
 * @param {*} param0
 * @param {*} param0.accountId Account id
 * @param {*} param0.network Blcokchain's network: mainnet, testnet, betanet
 * @param {*} param0.secretKey Account's secret key(optional)
 * @param {*} param0.mnemonic Account's mnemonic
 * @returns Near account
 */
export const getSigner = async ({ accountId, network, secretKey, mnemonic }) => {
  const { keyStores, KeyPair, connect } = nearAPI;
  if (!secretKey) {
    const phrase = await parseSeedPhrase(mnemonic);
    secretKey = phrase.secretKey;
  }
  const keyPair = KeyPair.fromString(secretKey);
  const keyStore = new keyStores.InMemoryKeyStore();
  await keyStore.setKey(network, accountId, keyPair);

  const near = await connect({
    ...config,
    keyStore,
  })
  const account = await near.account(accountId);
  return account;
}

export default class Near {
  constructor() {
    this.network = network;
    this.viewAccount = getViewAccount(network);
    this.signer = null;
  }

  /**
   * Set signer account
   * @param {*} mnemonic account's mnemonic
   * @param {*} accountId account id
   */
  async setSigner({ mnemonic, accountId }) {
    const signer = await getSigner({ network: this.network, mnemonic, accountId });
    this.signer = signer;
  }

  /**
   * Get account id by publickKey from the helper api
   * @param {*} publicKey 
   * @returns account id
   */
  async getAccountId(publicKey) {
    return apiHelper.getAccountId(publicKey);
  }

  /**
   * Get account's owned token contracts from the helper api
   * @param {*} accountId Account's id
   * @returns token contracts
   */
  async getOwnedTokens(accountId) {
    return apiHelper.getOwnedTokenContracts(accountId);
  }

  /**
 * Get account's near balance
 * @returns account's near balance
 */
  async getAccountBalance() {
    const accountBalance = await this.signer.getAccountBalance();
    return accountBalance;
  }

  /**
   * Contract view function call
   * @param {*} contractId contract account id
   * @param {*} method contract method
   * @param {*} params contract params
   * @returns 
   */
  async contractViewFunctionCall({ contractId, method, params = {} }) {
    return this.viewAccount.viewFunction(contractId, method, params);
  }

  /**
   * Get contract metadata
   * @param {*} contractId contract account id 
   * @returns contract metadata
   */
  async getContractMetadata({ contractId }) {
    return this.contractViewFunctionCall({ contractId, method: 'fe_metadata' });
  }

  /**
   * Get contract storage balance with account id
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns account id's storage balance
   */
  async getContractStorageBalance({ contractId, accountId }) {
    return this.contractViewFunctionCall({ contractId, method: 'storage_balance_of', params: { account_id: accountId } });
  }

  /**
   * Get nERC20 balance with account id
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns account id's token balance
   */
  async getContractBalance({ contractId, accountId }) {
    return this.contractViewFunctionCall({ contractId, method: 'ft_balance_of', params: { account_id: accountId } });
  }

  /**
   * Check storage balance is available
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns true if storage balance is available, otherwise false
   */
  async isStorageBalanceAvailable({ contractId, accountId }) {
    const storageBalance = await this.getContractStorageBalance({ contractId, accountId });
    return storageBalance?.total !== undefined;
  }

  /**
   * Estimate total fees need pay
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns estimated total fees
   */
  async getEstimatedTotalFees({ accountId, contractId = '' }) {
    if (contractId && accountId && !await this.isStorageBalanceAvailable({ contractId, accountId })) {
      return new BN(FT_TRANSFER_GAS)
        .add(new BN(FT_MINIMUM_STORAGE_BALANCE))
        .add(new BN(FT_STORAGE_DEPOSIT_GAS))
        .toString();
    } else {
      return FT_TRANSFER_GAS;
    }
  }

  /**
   * Estimate total near amount need pay
   * @param {*} amount transfer near amount
   * @returns estimated total near amount
   */
  async getEstimatedTotalNearAmount(amount) {
    return new BN(amount)
      .add(new BN(await this.getEstimatedTotalFees()))
      .toString();
  }

  /**
   * Deposit storage balance
   * @param {*} contractId contract account id
   * @param {*} receiverId receiver account id
   * @param {*} storageDepositAmount deposit amount
   * @returns the result of functionCall
   */
  async transferStorageDeposit({ contractId, receiverId, storageDepositAmount }) {
    return this.signer.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        functionCall('storage_deposit', {
          account_id: receiverId,
          registration_only: true,
        }, FT_STORAGE_DEPOSIT_GAS, storageDepositAmount)
      ]
    })
  }

  /**
   * transfer tokens to the receiver
   * @param {*} param0.accountId send account id
   * @param {*} param0.contractId token's contract account id
   * @param {*} param0.amount transfer token's amount
   * @param {*} param0.amount receiver account id
   * @param {*} param0.memo transfer's memo
   * @returns
   */
  async transfer({ accountId, memo, contractId, amount, receiverId }) {
    if (contractId) {
      const storageAvailable = await this.isStorageBalanceAvailable(contractId, accountId);
      if (!storageAvailable) {
        try {
          await this.transferStorageDeposit(contractId, receiverId, FT_MINIMUM_STORAGE_BALANCE);
        } catch (e) {
          if (e.message.includes('attached deposit is less than')) {
            await this.transferStorageDeposit(contractId, receiverId, FT_MINIMUM_STORAGE_BALANCE_LARGE);
          }
        }
      }

      return await this.signer.signAndSendTransaction({
        receiverId: contractId,
        actions: [
          functionCall('ft_transfer', {
            amount,
            memo: memo,
            receiver_id: receiverId,
          }, FT_TRANSFER_GAS, FT_TRANSFER_DEPOSIT)
        ]
      });
    } else {
      return await this.signer.sendMoney(receiverId, amount);
    }
  }
}

export const nearService = new Near();
