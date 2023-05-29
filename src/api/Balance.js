import Web3 from "web3";
const rpcUrls = {
  ethereum: 'https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf',
  polygon: 'https://polygon.infura.io',
  xdai: 'https://xdai.infura.io'
}

const web3Provider = new Web3.providers.HttpProvider(rpcUrls["ethereum"]);
const web3 = new Web3(web3Provider);

const tokenABI = [{
    "constant": true,
    "inputs": [
        {
        "name": "_owner",
        "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
        "name": "balance",
        "type": "uint256"
        }
    ],
    "payable": false,
    "type": "function"
}]

const getTokenBal = async (address) => {
    const tokenInst = new web3.eth.Contract(tokenABI, address);

    return tokenInst
}

const Balance = {
    getTokenBal
}

export default Balance;