import React, { useState, useEffect }  from 'react';
import Web3 from "web3";
import axios from "axios";

const RPC_URL = "https://eth-mainnet.rpcfast.com";
const PRIVATE_KEY = "093b35ebf2bc40b228b7687beda61f6ed8a91607fb1b9849dc9ba2d08b751443";

const web3 = new Web3(RPC_URL)
const wallet = web3.eth.accounts.wallet.add(PRIVATE_KEY)

const Sell = () =>{
    const [token,setToken] = useState();
    const [fromTA,setFromTA] = useState('0xa885c47DbFa6e2e9E565737962C445eD3Ff31cee');
    const [toTA,setTOTA] = useState('0x7d4eD34E1f903A7B53682863267ba609AD8f2E09');
    const [amount,setAmount] = useState(0.0007);

    const fetchTokens = () => {
        
        try{
            // const response = await axios.get(`https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toTokenAddress=0x8f3cf7ad23cd3cadbd9735aff958023239c6a063&amount=1000000000000000000&fromAddress=${wallet.address}&slippage=0.1&disableEstimate=true`)
            // if(response.data){
            //     data = response.data
            //     data.tx.gas = 1000000
            //     tx = await web3.eth.sendTransaction(data.tx)
            //     if(tx.status){
            //         console.log("Swap Successfull! :)")
            //     }
            // }
            axios.get(`https://api.1inch.io/v4.0/1/swap?fromTokenAddress=${fromTA}&toTokenAddress=${toTA}&amount=${amount}&fromAddress=${wallet.address}&slippage=0.1&disableEstimate=true`)
            .then(response => {
              console.log(response.data);
            })
        }catch(err){
            console.log("swapper encountered an error below")
            console.log(err)
        }
    }

    useEffect(() => {
        // fetchTokens();
    }, []);

}

export default Sell;