import axios from 'axios';
import CoinMarketCap from 'coinmarketcap-api';


const getCoinPrice = async () => {
    return axios.get("https://data.binance.com/api/v3/ticker/24hr");
}

const CoinMarket = {
    getCoinPrice
}

export default CoinMarket;