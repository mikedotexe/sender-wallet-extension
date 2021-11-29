import axios from 'axios';
import _ from 'lodash';

import { currencyQuotesUrl } from '../config';
import apiKey from '../config/apiKey';

// const { helperUrl } = config;

export default class ApiHelper {
  constructor({ helperUrl }) {
    this.helperUrl = helperUrl;
  }

  /**
   * Get currency quote from CoinMarketCap
   * @param {*} tokens ['NEAR', 'REF', ...]
   * @returns currency quote
   */
  getCurrencyQuote = async (tokens) => {
    const symbols = _.join(tokens, ',');
    const url = `${currencyQuotesUrl}?symbol=${symbols}`;
    const res = await axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey.coinMarketCap,
      }
    })
    return res.data.data;
  }

  /**
   * Get account id by publickKey
   * @param {*} publicKey 
   * @returns account id
   */
  getAccountId = async (publicKey) => {
    const res = await axios.get(`${this.helperUrl}/publicKey/${publicKey}/accounts`)
    return res.data[0];
  }

  /**
   * Get account's owned token contracts
   * @param {*} accountId Account's id
   * @returns token contracts
   */
  getOwnedTokenContracts = async (accountId) => {
    const res = await axios.get(`${this.helperUrl}/account/${accountId}/likelyTokens`)
    return res.data;
  }

  /**
   * Get staking pools which this account id has deposited
   * @param {*} accountId Query account id
   * @returns deposited validators
   */
  getStakingDeposits = async (accountId) => {
    const res = await axios.get(`${this.helperUrl}/staking-deposits/${accountId}`);
    return res.data;
  }

  /**
   * Get all staking pools
   * @returns all staking pools
   */
  getStakingPools = async () => {
    const res = await axios.get(`${this.helperUrl}/stakingPools`);
    return res.data;
  }

  /**
   * Get latest 10 transaction records
   * @param {*} accountId query account id
   * @returns 10 transaction records
   */
  getTransactions = async (accountId) => {
    const res = await axios.get(`${this.helperUrl}/account/${accountId}/activity`);
    return res.data;
  }
}
