import axios from 'axios';
import _ from 'lodash';

const currencyQuotes = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const apiKey = '3e99843c-4ed8-4000-8b7b-7b8c3fdc94af';

const apiHelper = {
  /**
 * Get currency quote from CoinMarketCap
 * @param {*} tokens ['NEAR', 'REF', ...]
 * @returns currency quote
 */
  getCurrencyQuote: (tokens) => {
    const symbols = _.join(tokens, ',');
    console.log('symbols: ', symbols);
    const url = `${currencyQuotes}?symbol=${symbols}`;
    console.log('url: ', url);
    return axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      }
    })
  }
}

export default apiHelper;