const RPC_URL = "https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf";
const web3Provider = new Web3.providers.HttpProvider(RPC_URL);
const web3 = new Web3(web3Provider);
const wallet = web3.eth.accounts.wallet.add("093b35ebf2bc40b228b7687beda61f6ed8a91607fb1b9849dc9ba2d08b751443");


export default function Swap() {
  const userBalance = localStorage.getItem('userBalance');
  var toWeiAmountBal = 0;
  if(userBalance){
    toWeiAmountBal = web3.utils.toWei(userBalance.toString(), 'ether');
  }
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const approveTransaction = async (sellInput) => {
    let sellToWei = web3.utils.toWei(sellInput.toString(), 'ether');
    console.log(sellToWei);
    if(sellToWei > 0){
      try {
        const response = await axios.get(`https://api.1inch.exchange/v4.0/1/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=${sellToWei}&fromAddress=${wallet.address}&slippage=0.1&disableEstimate=true`)
        if(response.data){
            let data = response.data
            data.tx.gas = 1000000
            let tx = await web3.eth.sendTransaction(data.tx)
            if(tx.status){
                console.log("Swap Successfull! :)")
            }
        }
      }catch(err){
        console.log(err);
      }
    }
  }


  try{
    axios.get(`https://api.1inch.io/v4.0/1/quote?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=${toWeiAmountBal}&fromAddress=${userAccount}`)
    .then(response => {
      let gasfee = response.data.estimatedGas*1e9;
      console.log(toWeiAmountBal - gasfee);
      console.log(response.data);
    })
}catch(err){
    console.log("swapper encountered an error below")
    console.log(err)
}