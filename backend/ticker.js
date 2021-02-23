const TrieSearch = require('trie-search');
const axios = require('axios');
const { IEX_TOKEN, IEX_URL } = require('./config');

const tickerTrie = new TrieSearch('symbol');

const token = IEX_TOKEN;
if (!token) {
  throw Error('Environment variable IEX token is not set');
}

async function populateTickers() {
  try {
    // fetch all available symbols from api
    const res = await axios.get(
      `${IEX_URL}/ref-data/symbols`, { params: { token } }
    );

    // populate stocks table
    tickerTrie.addAll(res.data);

    console.log(`Ticker Trie initialized with stock symbols.`);
  } catch (error) {
    console.error(error);
  }
};
populateTickers();

module.exports = tickerTrie;