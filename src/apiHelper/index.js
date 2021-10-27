import axios from 'axios';
import _ from 'lodash';

const currencyQuotesUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const apiKey = '3e99843c-4ed8-4000-8b7b-7b8c3fdc94af';
const helperUrl = 'https://helper.mainnet.near.org';

const apiHelper = {
  /**
   * Get currency quote from CoinMarketCap
   * @param {*} tokens ['NEAR', 'REF', ...]
   * @returns currency quote
   */
  getCurrencyQuote: async (tokens) => {
    const symbols = _.join(tokens, ',');
    const url = `${currencyQuotesUrl}?symbol=${symbols}`;
    const res = await axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      }
    })
    return res.data.data;
  },

  /**
   * Get account id by publickKey
   * @param {*} publicKey 
   * @returns account id
   */
  getAccountId: async (publicKey) => {
    const res = await axios.get(`${helperUrl}/publicKey/${publicKey}/accounts`)
    return res.data[0];
  },

  /**
   * Get account's owned token contracts
   * @param {*} accountId Account's id
   * @returns token contracts
   */
  getOwnedTokenContracts: async (accountId) => {
    const res = await axios.get(`${helperUrl}/account/${accountId}/likelyTokens`)
    return res.data;
  },

  /**
   * Get staking pools which this account id has deposited
   * @param {*} accountId Query account id
   * @returns deposited validators
   */
  getStakingDeposits: async (accountId) => {
    const res = await axios.get(`${helperUrl}/staking-deposits/${accountId}`);
    return res.data;
  },

  /**
   * Get all staking pools
   * @returns all staking pools
   */
  getStakingPools: async () => {
    const res = await axios.get(`${helperUrl}/stakingPools`);
    return res.data;
  },

  /**
   * Get latest 10 transaction records
   * @param {*} accountId query account id
   * @returns 10 transaction records
   */
  getTransactions: async (accountId) => {
    const res = await axios.get(`${helperUrl}/account/${accountId}/activity`);
    return res.data;
  }
}

export default apiHelper;