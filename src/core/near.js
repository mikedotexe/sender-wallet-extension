import { useDispatch } from 'react-redux';

import * as nearAPI from "near-api-js";
import BN from 'bn.js';
import _ from 'lodash';

import { parseSeedPhrase } from '../utils';
import ApiHelper from "../apiHelper";
import Validator from '../data/Validator';
import { transactions } from "near-api-js";
import { setTwoFaDrawer } from "../reducers/temp";
import { store } from '../Store';
import { APP_ADD_PENDING_REQUEST, APP_REMOVE_PENDING_REQUEST, APP_UPDATE_PENDING_REQUEST } from '../actions/app';
import { setTransferResultDrawer, setSwapResultDrawer, setStakingResultDrawer, setUnstakingResultDrawer } from '../reducers/temp';
import { DEFAULT_MAINNET_RPC } from '../config/rpc';

const {
  transactions: {
    functionCall
  },
  utils: {
    format: {
      parseNearAmount,
    },
  },
  providers,
  Contract,
  multisig: { Account2FA },
  keyStores,
  KeyPair,
  connect,
} = nearAPI;

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
// FT_MINIMUM_STORAGE_BALANCE: nUSDC, nUSDT require minimum 0.0125 NEAR. Came to this conclusion using trial and error.
const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

// set this to the same value as we use for creating an account and the remainder is refunded
export const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');

// contract might require an attached depositof of at least 1 yoctoNear on transfer methods
// "This 1 yoctoNEAR is not enforced by this standard, but is encouraged to do. While ability to receive attached deposit is enforced by this token."
// from: https://github.com/near/NEPs/issues/141
export const FT_TRANSFER_DEPOSIT = '1';

export const MULTISIG_CONTRACT_HASHES = [
  // https://github.com/near/core-contracts/blob/fa3e2c6819ef790fdb1ec9eed6b4104cd13eb4b7/multisig/src/lib.rs
  '7GQStUCd8bmCK43bzD8PRh7sD2uyyeMJU5h8Rj3kXXJk',
  // https://github.com/near/core-contracts/blob/fb595e6ec09014d392e9874c2c5d6bbc910362c7/multisig/src/lib.rs
  'AEE3vt6S3pS2s7K6HXnZc46VyMyJcjygSMsaafFh67DF',
  // https://github.com/near/core-contracts/blob/636e7e43f1205f4d81431fad0be39c5cb65455f1/multisig/src/lib.rs
  '8DKTSceSbxVgh4ANXwqmRqGyPWCuZAR1fCqGPXUjD5nZ',
  // https://github.com/near/core-contracts/blob/f93c146d87a779a2063a30d2c1567701306fcae4/multisig/res/multisig.wasm
  '55E7imniT2uuYrECn17qJAk9fLcwQW4ftNSwmCJL5Di',
];

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
 * @param {*} config node config
 * @returns A view account
 */
export const getViewAccount = ({ config }) => {
  const { network, nodeUrl } = config;
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
 * @param {*} param0.config Account's node config
 * @returns Near account
 */
export const getSigner = async ({ accountId, secretKey, mnemonic, config }) => {
  if (!secretKey) {
    const phrase = await parseSeedPhrase(mnemonic);
    secretKey = phrase.secretKey;
  }
  const keyPair = KeyPair.fromString(secretKey);
  const keyStore = new keyStores.InMemoryKeyStore();
  await keyStore.setKey(config.network, accountId, keyPair);

  const near = await connect({
    ...config,
    keyStore,
  })
  const account = await near.account(accountId);
  return account;
}

/**
 * Get rpc provider's validators
 * @param {*} config node config
 * @returns rpc validators
 */
export const getRpcValidators = async ({ config }) => {
  const { nodeUrl } = config;
  const provider = new providers.JsonRpcProvider(nodeUrl);
  const validators = await provider.validators();
  return validators;
}

/**
 * Check account has 2fa enabled
 * @param {*} account 
 * @returns true if account's 2fa is enabled
 */
export const has2faEnabled = async (account) => {
  const state = await account.state();
  if (!state) {
    return false;
  }
  return MULTISIG_CONTRACT_HASHES.includes(state.code_hash);
}

export default class NearService {
  constructor({ config = DEFAULT_MAINNET_RPC }) {
    this.viewAccount = getViewAccount({ config });
    this.signer = null;
    this.config = config;
    this.apiHelper = new ApiHelper({ helperUrl: config.helperUrl });
  }

  /**
   * Set signer account
   * @param {*} secretKey account's secretKey
   * @param {*} mnemonic account's mnemonic
   * @param {*} accountId account id
   */
  setSigner = async ({ secretKey, mnemonic, accountId }) => {
    const signer = await getSigner({ secretKey, mnemonic, accountId, config: this.config });
    this.signer = signer;
  }

  /**
   * Get provider's status
   */
  getStatus = async () => {
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect({
      ...this.config,
      keyStore,
    })
    const response = await near.connection.provider.status();
    return response;
  }

  /**
   * Get account object.
   * @returns If has enabled 2fa, return an Account2FA instance.
   */
  getAccount = async () => {
    if (await has2faEnabled(this.signer)) {
      const account = new Account2FA(this.signer.connection, this.signer.accountId, {
        helperUrl: this.config.helperUrl,
        sendCode: async () => {
          const requestId = await account.sendCodeDefault();
          store.dispatch({ type: APP_UPDATE_PENDING_REQUEST, requestId });
        },
        getCode: (method) => {
          return new Promise((resolve, reject) => {
            store.dispatch(setTwoFaDrawer({ display: true, error: null, resolver: resolve, rejecter: reject, method }));
          })
        },
        verifyCode: async (securityCode) => {
          try {
            const res = await account.verifyCodeDefault(securityCode);
            store.dispatch(setTwoFaDrawer({ display: false, loading: false }));
            store.dispatch({ type: APP_REMOVE_PENDING_REQUEST });
          } catch (error) {
            store.dispatch(setTwoFaDrawer({ display: true, error: error.message, loading: false }));
            throw error;
          }
        }
      });

      account.verifyCodeWithRequest = async (securityCode, pendingRequest) => {
        let err;
        const { accountId } = account;
        const { requestId, type } = pendingRequest;
        try {
          await account.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
          });
          store.dispatch(setTwoFaDrawer({ display: false, loading: false }));
          store.dispatch({ type: APP_REMOVE_PENDING_REQUEST, requestId });
        } catch (error) {
          store.dispatch(setTwoFaDrawer({ error: 'Code is not correct', loading: false }));
          err = error.message;
        }

        switch (type) {
          case 'transfer': {
            const { sendAmount, selectToken, receiver } = pendingRequest;
            store.dispatch(setTransferResultDrawer({ display: true, error: err, sendAmount, selectToken, receiver }));
            break;
          }
          case 'staking': {
            const { stakeAmount, selectValidator } = pendingRequest;
            store.dispatch(setStakingResultDrawer({ display: true, error: err, stakeAmount, selectValidator }))
            break;
          }
          case 'unstake': {
            const { unstakeAmount, selectUnstakeValidator } = pendingRequest;
            store.dispatch(setUnstakingResultDrawer({ display: true, error: err, unstakeAmount, selectUnstakeValidator }))
            break;
          }
          case 'swap': {
            const { swapFrom, swapTo, swapAmount } = pendingRequest;
            store.dispatch(setSwapResultDrawer({ display: true, error: err, swapFrom, swapTo, swapAmount }));
            break;
          }
          default: {
            break;
          }
        }
      };

      return account;
    } else {
      return this.signer;
    }
  }

  /**
   * Call two factor method
   * @param {*} method method name
   * @param {*} args method arguments
   * @returns request id
   */
  twoFactorMethod = async (method, args) => {
    const account = await this.getAccount();
    if (account[method]) {
      return await account[method](...args);
    }
    return false;
  };

  get2faMethod = async () => {
    const account = await this.getAccount();
    if (account.get2faMethod) {
      return await account.get2faMethod();
    }
    return null;
  }

  verifyCodeWithRequest = async (securityCode, pendingRequest) => {
    const account = await this.getAccount();
    if (account.verifyCodeWithRequest) {
      await account.verifyCodeWithRequest(securityCode, pendingRequest);
    }
  }

  /**
   * Get account id by publickKey from the helper api
   * @param {*} publicKey
   * @returns account id
   */
  getAccountId = async (publicKey) => {
    return this.apiHelper.getAccountId(publicKey);
  }

  /**
   * Get account's owned token contracts from the helper api
   * @param {*} accountId Account's id
   * @returns token contracts
   */
  getOwnedTokens = async ({ accountId }) => {
    return this.apiHelper.getOwnedTokenContracts(accountId);
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
    const stakingDeposits = await this.apiHelper.getStakingDeposits(accountId);

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
    const account = await this.getAccount();
    return account.signAndSendTransaction({
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
    const contractId = this.config.wrapNearContract;
    const receiverId = this.signer.accountId;
    await this.checkStorageBalance({ contractId, receiverId });

    const account = await this.getAccount();

    return await account.signAndSendTransaction({
      type: 'wNearDeposit',
      amount,
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
    const contractId = this.config.wrapNearContract;
    const receiverId = this.signer.accountId;
    await this.checkStorageBalance({ contractId, receiverId });

    const account = await this.getAccount();

    return await account.signAndSendTransaction({
      type: 'wNearWithdraw',
      amount,
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
    const account = await this.getAccount();
    if (contractId) {
      await this.checkStorageBalance({ contractId, receiverId });

      return await account.signAndSendTransaction({
        type: 'transfer',
        receiverId: contractId,
        amount,
        actions: [
          functionCall('ft_transfer', {
            amount,
            memo: memo,
            receiver_id: receiverId,
          }, FT_TRANSFER_GAS, FT_TRANSFER_DEPOSIT)
        ]
      });
    } else {
      const res = await account.signAndSendTransaction({
        type: 'transfer',
        amount,
        receiverId,
        actions: [transactions.transfer(amount)],
      })
      return res;
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
    const account = await this.getAccount();
    const res = await account.signAndSendTransaction({
      type: 'stake',
      receiverId: validatorId,
      amount,
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

    const account = await this.getAccount();

    const res = await account.signAndSendTransaction({
      receiverId: validatorId, actions: [action], type: 'unstake', amount,
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

    const account = await this.getAccount();

    const res = await account.signAndSendTransaction({
      receiverId: validatorId, actions: [action], type: 'withdraw', amount,
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
    const rpcValidators = await getRpcValidators({ config: this.config });
    const stakingPools = await this.apiHelper.getStakingPools();

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
          // console.warn('Error getting fee for validator %s: %s', account_id, e);
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
