import * as nearAPI from "near-api-js";
import BN from 'bn.js';
import _ from 'lodash';

import config from '../config';
import { parseSeedPhrase } from '../utils';
import apiHelper from "../apiHelper";
import Validator from '../data/Validator';

const WRAP_NEAR_CONTRSCT = 'wrap.near';
// const WRAP_NEAR_CONTRSCT = 'wrap.testnet';

const {
  transactions: {
    functionCall
  },
  utils: {
    format: {
      parseNearAmount,
    }
  },
  providers,
  Contract,
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
const STAKING_AMOUNT_DEVIATION = parseNearAmount('0.00001');
const ZERO = new BN('0');
const MIN_DISPLAY_YOCTO = new BN('100');
const EXPLORER_DELAY = 2000;
const MIN_LOCKUP_AMOUNT = new BN(parseNearAmount('35.00001'));

export const stakingMethods = {
  viewMethods: [
    'get_account_staked_balance',
    'get_account_unstaked_balance',
    'get_account_total_balance',
    'is_account_unstaked_balance_available',
    'get_total_staked_balance',
    'get_owner_id',
    'get_reward_fee_fraction',
  ],
  changeMethods: [
    'ping',
    'deposit',
    'deposit_and_stake',
    'deposit_to_staking_pool',
    'stake',
    'stake_all',
    'unstake',
    'withdraw',
  ],
}

export const lockupMethods = {
  viewMethods: [
    'get_balance',
    'get_locked_amount',
    'get_owners_balance',
    'get_staking_pool_account_id',
    'get_known_deposited_balance',
  ]
};

/**
 * Generate an account just to query
 * @param {*} network Blcokchain's network: mainnet, testnet, betanet
 * @returns A view account
 */
export const getViewAccount = () => {
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
 * @param {*} param0.secretKey Account's secret key(optional)
 * @param {*} param0.mnemonic Account's mnemonic
 * @returns Near account
 */
export const getSigner = async ({ accountId, secretKey, mnemonic }) => {
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

/**
 * Get rpc provider's validators
 * @returns rpc validators
 */
export const getRpcValidators = async () => {
  const { nodeUrl } = config;
  const provider = new providers.JsonRpcProvider(nodeUrl);
  const validators = await provider.validators();
  return validators;
}

export default class Near {
  constructor() {
    this.viewAccount = getViewAccount();
    this.signer = null;
  }

  /**
   * Set signer account
   * @param {*} mnemonic account's mnemonic
   * @param {*} accountId account id
   */
  setSigner = async ({ mnemonic, accountId }) => {
    const signer = await getSigner({ mnemonic, accountId });
    this.signer = signer;
  }

  /**
   * Get account id by publickKey from the helper api
   * @param {*} publicKey 
   * @returns account id
   */
  getAccountId = async (publicKey) => {
    return apiHelper.getAccountId(publicKey);
  }

  /**
   * Get account's owned token contracts from the helper api
   * @param {*} accountId Account's id
   * @returns token contracts
   */
  getOwnedTokens = async ({ accountId }) => {
    return apiHelper.getOwnedTokenContracts(accountId);
  }

  /**
   * Get account's near balance
   * @returns account's near balance
   */
  getAccountBalance = async () => {
    const accountBalance = await this.signer.getAccountBalance();
    return accountBalance;
  }

  /**
   * Get validators' deposit map
   * @param {*} accountId query account id
   * @returns validators' deposit map
   */
  getValidatorDepositMap = async ({ accountId }) => {
    const stakingDeposits = await apiHelper.getStakingDeposits(accountId);

    const validatorDepositMap = {};
    _.forEach(stakingDeposits, ({ validator_id, deposit }) => {
      validatorDepositMap[validator_id] = deposit;
    });

    return validatorDepositMap;
  }

  /**
   * Contract view function call
   * @param {*} contractId contract account id
   * @param {*} method contract method
   * @param {*} params contract params
   * @returns 
   */
  contractViewFunctionCall = async ({ contractId, method, params = {} }) => {
    return this.viewAccount.viewFunction(contractId, method, params);
  }

  /**
   * Get contract metadata
   * @param {*} contractId contract account id 
   * @returns contract metadata
   */
  getContractMetadata = async ({ contractId }) => {
    return this.contractViewFunctionCall({ contractId, method: 'ft_metadata' });
  }

  /**
   * Get contract storage balance with account id
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns account id's storage balance
   */
  getContractStorageBalance = async ({ contractId, accountId }) => {
    return this.contractViewFunctionCall({ contractId, method: 'storage_balance_of', params: { account_id: accountId } });
  }

  /**
   * Get nERC20 balance with account id
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns account id's token balance
   */
  getContractBalance = async ({ contractId, accountId }) => {
    return this.contractViewFunctionCall({ contractId, method: 'ft_balance_of', params: { account_id: accountId } });
  }

  /**
   * Check storage balance is available
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns true if storage balance is available, otherwise false
   */
  isStorageBalanceAvailable = async ({ contractId, accountId }) => {
    const storageBalance = await this.getContractStorageBalance({ contractId, accountId });
    return storageBalance?.total !== undefined;
  }

  /**
   * Estimate total fees need pay
   * @param {*} contractId contract account id
   * @param {*} accountId query account id
   * @returns estimated total fees
   */
  getEstimatedTotalFees = async ({ accountId, contractId }) => {
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
   * @param {*} accountId transfer account id
   * @returns estimated total near amount
   */
  getEstimatedTotalNearAmount = async ({ amount }) => {
    return new BN(amount)
      .add(new BN(await this.getEstimatedTotalFees({})))
      .toString();
  }

  /**
   * Deposit storage balance
   * @param {*} contractId contract account id
   * @param {*} receiverId receiver account id
   * @param {*} storageDepositAmount deposit amount
   * @returns the result of functionCall
   */
  transferStorageDeposit = async ({ contractId, receiverId, storageDepositAmount }) => {
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
   * Check storage balance is enough or not
   * @param {*} contractId contract account id
   * @param {*} receiverId receiver account id
   */
  checkStorageBalance = async ({ contractId, receiverId }) => {
    const storageAvailable = await this.isStorageBalanceAvailable({ contractId, accountId: this.signer.accountId });
    if (!storageAvailable) {
      try {
        await this.transferStorageDeposit({ contractId, receiverId, storageDepositAmount: FT_MINIMUM_STORAGE_BALANCE });
      } catch (e) {
        if (e.message.includes('attached deposit is less than')) {
          await this.transferStorageDeposit({ contractId, receiverId, storageDepositAmount: FT_MINIMUM_STORAGE_BALANCE_LARGE });
        }
      }
    }
  }

  /**
   * Deposit near to wrapNear
   * @param {*} amount deposit near amount
   * @returns 
   */
  wrapNearDeposit = async ({ amount }) => {
    const contractId = WRAP_NEAR_CONTRSCT;
    const receiverId = this.signer.accountId;
    await this.checkStorageBalance({ contractId, receiverId });

    return await this.signer.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        functionCall('near_deposit', {}, FT_TRANSFER_GAS, amount),
      ]
    })
  }

  /**
   * Withdraw wrap near to near
   * @param {*} amount withdraw wrap near amount
   * @returns 
   */
  wrapNearWithdraw = async ({ amount }) => {
    const contractId = WRAP_NEAR_CONTRSCT;
    const receiverId = this.signer.accountId;
    await this.checkStorageBalance({ contractId, receiverId });

    return await this.signer.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        functionCall('near_withdraw', { amount }, FT_TRANSFER_GAS, FT_TRANSFER_DEPOSIT),
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
  transfer = async ({ memo, contractId, amount, receiverId }) => {
    if (contractId) {
      await this.checkStorageBalance({ contractId, receiverId });

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

  /**
   * Stake near amount to the validator
   * @param {*} param0 
   * @param {*} param0.validatorId validator's account id 
   * @param {*} param0.amount stake near amount
   * @returns stake result
   */
  stake = async ({ validatorId, amount }) => {
    const res = await this.signer.signAndSendTransaction({
      receiverId: validatorId,
      actions: [
        functionCall('deposit_and_stake', {}, STAKING_GAS_BASE * 5, amount),
      ]
    })

    // wait for explorer to index results
    await new Promise((r) => setTimeout(r, EXPLORER_DELAY));

    return res;
  }

  /**
   * Unstake near amount
   * @param {*} param0 
   * @param {*} param0.validatorId validator's account id 
   * @param {*} param0.amount unstake near amount
   * @returns unstake result
   */
  unstake = async ({ validatorId, amount }) => {
    let action;
    if (amount) {
      action = functionCall('unstake', { amount }, STAKING_GAS_BASE * 5, '0');
    } else {
      action = functionCall('unstake_all', {}, STAKING_GAS_BASE * 7, '0');
    }

    const res = await this.signer.signAndSendTransaction({
      receiverId: validatorId, actions: [action],
    })

    // wait for explorer to index results
    await new Promise((r) => setTimeout(r, EXPLORER_DELAY));

    return res;
  }

  /**
   * Withdraw near amount from the validator
   * @param {*} param0 
   * @param {*} param0.validatorId validator's account id 
   * @param {*} param0.amount withdraw near amount
   * @returns withdraw result
   */
  withdraw = async ({ validatorId, amount }) => {
    let action;
    if (amount) {
      action = functionCall('withdraw', { amount }, STAKING_GAS_BASE * 5, '0');
    } else {
      action = functionCall('withdraw_all', {}, STAKING_GAS_BASE * 7, '0');
    }

    const res = await this.signer.signAndSendTransaction({
      receiverId: validatorId, actions: [action],
    })

    // wait for explorer to index results
    await new Promise((r) => setTimeout(r, EXPLORER_DELAY));

    return res;
  }

  /**
   * Get owner tokens' information and account's balance
   * @returns tokens' information
   */
  getTokensAndBalance = async () => {
    const { accountId } = this.signer;
    const ownedTokens = await this.getOwnedTokens({ accountId });

    const tokens = (await Promise.all(
      _.map(ownedTokens, async (contractId) => {
        try {
          const token = await this.getContractMetadata({ contractId });
          const balance = await this.getContractBalance({ contractId, accountId })
          return { ...token, balance, accountId: contractId };
        } catch (error) {
          return null
        }
      })
    )).filter((v) => !!v)
    return tokens;
  }

  /**
   * Get all validators and balance with account
   * @param {*} balance Near account's balance
   * @param {*} validatorDepositMap Near account's deposit validators information
   * @returns { validators, totalUnstaked, totalStaked, totalUnclaimed, totalAvailable, totalPending}
   * validators: Validator object
   * totalUnstaked: Near account's available balance
   * totalStaked: Total staked near amount with all validators
   * totalUnclaimed: Total unclaimed near amount with all validators
   * totalAvailable: Total available near amount with all validators (can withdraw)
   * totalPending: Total pending near amount with all validators
   * 
   */
  getValidatorsAndBalance = async ({ balance, validatorDepositMap }) => {
    const rpcValidators = await getRpcValidators();
    const stakingPools = await apiHelper.getStakingPools();

    const { current_validators, next_validators, current_proposals } = rpcValidators;
    const currentValidators = _.map(current_validators, ({ account_id }) => account_id);
    const rpcAccountIds = _.map([...current_validators, ...next_validators, ...current_proposals], ({ account_id }) => account_id);
    const accountIds = _.union([...rpcAccountIds, ...stakingPools]);

    let totalUnstaked = new BN(balance.available);
    if (totalUnstaked.lt(new BN(STAKING_AMOUNT_DEVIATION))) {
      totalUnstaked = ZERO.clone();
    }
    let totalStaked = ZERO.clone();
    let totalUnclaimed = ZERO.clone();
    let totalAvailable = ZERO.clone();
    let totalPending = ZERO.clone();

    const { accountId } = this.signer;

    const validators = (await Promise.all(
      accountIds.map(async (account_id) => {
        try {
          const contract = new Contract(this.signer, account_id, stakingMethods);
          const fee = await contract.get_reward_fee_fraction();
          fee.percentage = +(fee.numerator / fee.denominator * 100).toFixed(2);

          const total = new BN(await contract.get_account_total_balance({ account_id: accountId }));

          // try to get deposits from explorer
          const deposit = new BN(validatorDepositMap[account_id] || '0');
          const staked = await contract.get_account_staked_balance({ account_id: accountId });

          // rewards (lifetime) = total - deposits
          let unclaimed = total.sub(deposit).toString();
          if (!deposit.gt(ZERO) || new BN(unclaimed).lt(MIN_DISPLAY_YOCTO)) {
            unclaimed = ZERO.clone().toString();
          }

          let available = '0';
          let pending = '0';
          let unstaked = new BN(await contract.get_account_unstaked_balance({ account_id: accountId }));
          if (unstaked.gt(MIN_DISPLAY_YOCTO)) {
            const isAvailable = await contract.is_account_unstaked_balance_available({ account_id: accountId });
            if (isAvailable) {
              available = unstaked.toString();
              totalAvailable = totalAvailable.add(unstaked);
            } else {
              pending = unstaked.toString();
              totalPending = totalPending.add(unstaked);
            }
          }

          totalStaked = totalStaked.add(new BN(staked));
          totalUnclaimed = totalUnclaimed.add(new BN(unclaimed));

          const validator = new Validator({
            accountId: account_id,
            active: currentValidators.includes(account_id),
            contract,
            fee,
            staked,
            unclaimed,
            unstaked,
            available,
            pending,
          });

          return validator;
        } catch (e) {
          console.warn('Error getting fee for validator %s: %s', account_id, e);
        }
      })
    )).filter((v) => !!v)

    return {
      validators,
      totalUnstaked: totalUnstaked.toString(),
      totalStaked: totalStaked.toString(),
      totalUnclaimed: (totalUnclaimed.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalUnclaimed).toString(),
      totalAvailable: totalPending.toString(),
      totalPending: (totalAvailable.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalAvailable).toString(),
    };
  }
}

export const nearService = new Near();
