import React, { useState, useEffect }  from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
// web.cjs is required for IE11 support
import { useSpring, animated } from '@react-spring/web';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Wallet from '../api/ConnectWallet';
import ConnectWalletButton from '../api/ConnectWalletSwap';
import axios from "axios";
import SwapService from "../api/Swap";
import Balance from "../api/Balance";
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2'
import Web3 from "web3";
import CoinMarket from "../api/CoinMarket";
import {
  fetchBalance,
} from '../features/balance/metamaskBalanceReducer';
import {ethers} from 'ethers';

const rpcUrls = {
  ethereum: 'https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf',
  polygon: 'https://polygon.infura.io',
  xdai: 'https://xdai.infura.io'
}

const slugToChainId = 1;

const tokenDecimals = {
  USDC: 6,
  ETH: 18
}

const addresses = {
  ethereum: {
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    ETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  polygon: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
  },
  xdai: {
    USDC: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    ETH: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'
  }
}

const { formatUnits, parseUnits } = require('ethers/lib/utils')

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

const style = {
  position: 'absolute',
  height:'380px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#171616 !important',
  color:'#fff',
  borderRadius: '24px',
  boxShadow: 24,
  p: 1,
};

export default function Swap() {
  const [open, setOpen] = React.useState(false);
  const [methods,setMethods] = React.useState();
  const [decimal,setDecimal] = React.useState();
  const [loading,setLoading] = React.useState(false);
  const [amountSwap,setAmountSwap] = React.useState();
  const [buyBalance,setBuyBalance] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [gasFee,setGasFee] = React.useState(0);
  const dispatch = useDispatch();
  const handleOpen = (method) => {
    setMethods(method);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const [getTokens,setGetToken] = React.useState([]);
  const [searchToken,setSearchToken] = React.useState();
  const [sellSelectedToken, setSellSelectedToken] = React.useState('ETH');
  const [sellSelectedTokenIMG, setSellSelectedTokenIMG] = React.useState("https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png");
  const [sellSelectedTokenADDR, setSellSelectedTokenADDR] = React.useState('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  const userAddress = window.localStorage.getItem('userAccount');
  const [buySelectedToken, setbuySelectedToken] = React.useState('Select');
  const [buySelectedTokenIMG, setbuySelectedTokenIMG] = React.useState("");
  const [buySelectedTokenADDR, setBuySelectedTokenADDR] = React.useState('');
  const [transactionSummary, setTransactionSummary] = React.useState(false);
  const [rate, setRate] = React.useState('');

  const filterToken = (value) => {
    console.log(value);
    if(value.length > 10){
      setSearchToken(value);
    }
    else{
      setSearchToken(value.toUpperCase());
    }
    
  }

  const dec2He = (dec) => {
      return Math.abs(dec).toString(16);
  }

  const getFlooredFixed = (v, d) => {
      return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  }

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

  const web3Provider = new Web3.providers.HttpProvider(rpcUrls["ethereum"]);
  const web3 = new Web3(web3Provider);

  const getData = getTokens.filter(data => data.symbol == searchToken || data.address == searchToken).map((option, index) => (
    <List>
      <ListItem disablePadding>
        <ListItemButton key={index} onClick={e => clickToken(option.logoURI,option.symbol,option.address,option.decimals)}>
          <img key={index} alt={'Logo'} src={option.logoURI} width={30} height={30} />&nbsp;{option.symbol}
        </ListItemButton>
      </ListItem>
    </List>
  ));
  

  useEffect( async() => {
    try{
        await axios.get('token.json')
        .then(response => {
          setGetToken(response.data);
        })
    }catch(err){
        console.log(err)
    }
  }, []);



  //metamask eth balance
  const balance = useSelector((state) => state.counter.value);
  const [status,setStatus] = React.useState('Enter amount to swap')
  const [statusAppr,setStatusAppr] = React.useState("Give Permission to swap "+sellSelectedToken);

  //Sell feature
  const [sellValue,setSellValue] = React.useState(0);
  const [lengthinput,setLengthInput] = React.useState('');
  const [sellAllowanceApprove,setAllowanceApprove] = React.useState("");

  const [btc, setBTC] = useState('');
  const [eth, setETH] = useState('');
  const [doge, setDOGE] = useState('');
  const [xmr, setXMR] = useState('');
  const [ltc, setLTC] = useState('');
  const [btccp,setBTCCP] = React.useState('')
  const [ethcp,setETHCP] = React.useState('')
  const [dogecp,setDOGECP] = React.useState('')
  const [xmrcp,setXMRCP] = React.useState('')
  const [ltccp,setLTCCP] = React.useState('')

  const connectWallet = () => {
    document.getElementById('connect-wallet').click();
  }

  const balanceMax = async () => {
    if(sellValue > balance){
      setStatus('Insufficient Balance');
      setLoading(false);
    }
    else{
      if(buySelectedToken != 'Select Token'){
        getQuoteFuncOnKey(sellSelectedTokenADDR,buySelectedTokenADDR,balance,sellSelectedToken,buySelectedToken)
        setSellValue(balance);
      }
      else{
        setSellValue(balance);
      }
    }

  }

  const btcPrice = (tokens) => {
      return tokens.symbol === 'BTCUSDT';
  }
  
  const ethPrice = (tokens) => {
      return tokens.symbol === 'ETHUSDT';
  }
  
  const dogePrice = (tokens) => {
      return tokens.symbol === 'DOGEUSDT';
  }
  
  const moneroPrice = (tokens) => {
      return tokens.symbol === 'XMRUSDT';
  }
  
  const litecoinPrice = (tokens) => {
      return tokens.symbol === 'LTCUSDT';
  }

  const getPriceMarket = async () => {
    try{
        CoinMarket.getCoinPrice().then((response) => {
            const json = response.data;
            const priceDataArr = {
                BTC: json.find(btcPrice),
                ETH: json.find(ethPrice),
                DOGE: json.find(dogePrice),
                XMR: json.find(moneroPrice),
                LTC: json.find(litecoinPrice)
            }
            console.log(priceDataArr.ETH)
            setBTC(Number(priceDataArr.BTC.lastPrice))
            setETH(Number(priceDataArr.ETH.lastPrice))
            setDOGE(Number(priceDataArr.DOGE.lastPrice))
            setXMR(Number(priceDataArr.XMR.lastPrice))
            setLTC(Number(priceDataArr.LTC.lastPrice))
            setBTCCP(Number(priceDataArr.BTC.priceChangePercent))
            setETHCP(Number(priceDataArr.ETH.priceChangePercent))
            setDOGECP(Number(priceDataArr.DOGE.priceChangePercent))
            setXMRCP(Number(priceDataArr.XMR.priceChangePercent))
            setLTCCP(Number(priceDataArr.LTC.priceChangePercent))
        });
    }catch(err){
        console.log(err)
    }
}

  const sellInputFunc = (event) => {
    setLoading(true);
    setTransactionSummary(false)
    if(typeof event.target.value !== 'number' && isNaN(event.target.value)){
      setSellValue('');
      setLoading(false);
    }
    else{
      if(event.target.value % 1){
        setLengthInput({
          maxLength: 8
        });
      }
      else{
        setLengthInput({
          maxLength: 16
        });
      }
      if(event.target.value > 0){
        if(buySelectedTokenADDR != ""){
          setTimeout(async function(){
            setLoading(false);
            
            getQuoteFuncOnKey(sellSelectedTokenADDR,buySelectedTokenADDR,event.target.value,sellSelectedToken,buySelectedToken)
          }, 2000);
        }
      }
      setSellValue(event.target.value);
    }
  }

  //Buy Feature
  const [buyValue,setBuyValue] = React.useState(0);

  const buyInputFunc = (event) => {
    if(typeof event.target.value !== 'number' && isNaN(event.target.value)){
      // setSellValue('');
    }else{
      if(event.target.value % 1){
        setLengthInput({
          maxLength: 8
        });
      }
      else{
        setLengthInput({
          maxLength: 16
        });
      }
      setBuyValue(event.target.value);
    }
  }  

  const clickToken = async (img,token,address,decimals) => {
    setOpen(false);
    setLoading(true);
    setDecimal(decimals);
    const tokenInst = new web3.eth.Contract(tokenABI, address);
    if(methods == 'sell'){
      if(token == buySelectedToken){
        setLoading(false);
        return Swal.fire(
          'Error',
          'The same token is prohibited.',
          'error'
        )
      }

      if(address != '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
        try{
          setStatusAppr("Give Permission to swap "+token);

          dispatch(fetchBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9), 4)));
          const allowance = await SwapService.getAllowance(address,userAddress);
          setAllowanceApprove(allowance);

          //USDT USDC
          if(decimal <= 8){
            console.log(parseFloat(await tokenInst.methods.balanceOf(userAddress).call()))
            let bals = parseFloat(await tokenInst.methods.balanceOf(userAddress).call())

            if(bals % 1 != 0){
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call()).toFixed(2)));
            }
            else{
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call())));
            }
          }
          else{
            console.log(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9))
            let bals = parseFloat(await tokenInst.methods.balanceOf(userAddress).call())
            if(bals % 1 != 0){
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9).toFixed(2)));
            }
            else{
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9)));
            }
          }
          
          getPriceMarket()
        }catch(err){
          setLoading(false);
          
          console.log(err);
        }
      }
      setSellSelectedToken(token);
      setSellSelectedTokenIMG(img);
      setSellSelectedTokenADDR(address);

      if(sellValue > 0){
      
        setTimeout(async function(){
          getQuoteFunc(address,decimals,token,buySelectedToken)
        }, 2000);
      }
    }
    else{

      if(sellSelectedToken == token){
        setLoading(false);
        return Swal.fire(
          'Error',
          'The same token is prohibited.',
          'error'
        )
      }

      if(address != '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
        try{
          let buyBal = await tokenInst.methods.balanceOf(userAddress).call();
          //USDT USDC
          if(decimals <= 8){
            const formattedAmount = buyBal.toString();
            const amounttest = parseUnits(formattedAmount, 12).toString();
            const amounttest2 = parseUnits(formattedAmount, 10).toString();
    
            if(decimals === 8){
              setBuyBalance(getFlooredFixed(amounttest2 / 1e9 / 1e9,4));
            }
            else{
              setBuyBalance(getFlooredFixed(amounttest / 1e9 / 1e9,2));
            }

          }
          else{
            setBuyBalance(getFlooredFixed(buyBal / 1e9 / 1e9,4));
          }
          
        }catch(err){
          
          console.log(err);
        }
      }else{
        window.ethereum.request({method: 'eth_getBalance', params: [userAddress, 'latest']})
        .then(balance => {
          setBuyBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4));
        })
        
      }
      getPriceMarket()
      setbuySelectedToken(token);
      setbuySelectedTokenIMG(img);
      setBuySelectedTokenADDR(address);

      if(sellValue > 0){
        
        setTimeout(async function(){
          getQuoteFunc(address,decimals,sellSelectedToken,token)
        }, 2000);
      }
    }
  }


  const swapToken = async () => {
    setStatus(<CircularProgress/>);
    
    const slippage = "0.1";
    const txData = await SwapService.getSwapTx(sellSelectedTokenADDR, buySelectedTokenADDR, userAddress, amountSwap, slippage)
    console.log('swap data:', txData)
    const ethVal = '0x'+dec2He(txData.value);
    console.log(ethVal.toString());
    const transactionParameters = {
      to: txData.to, // Required except during contract publications.
      from: userAddress, // must match user's active address.
      value: ethVal.toString(), // Only required to send ether to the recipient from the initiating external account.
      data :txData.data, // Optional, but used for defining smart contract creation and interaction.
    };
    
    try{
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log(txHash);
      setStatus("Enter amount to swap");
      setSellValue(0);
      setBuyValue(0);
      Swal.fire({
        title: '<strong>Successfully Swap</strong>',
        icon: 'success',
        html:
          'View transaction on ' +
          '<a target="_blank" href="https://etherscan.io/tx/'+txHash+'">ETHERSCAN</a> ',
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
      })
      window.ethereum.request({method: 'eth_getBalance', params: [userAddress, 'latest']})
      .then(balance => {
          dispatch(fetchBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4)));
      })

      try{
        setBuyBalance(getFlooredFixed(parseFloat(await Balance.getTokenBal(buySelectedTokenADDR).balanceOf(userAddress).call() / 1e9 / 1e9), 4));
      }catch(err){
        console.log(err);
        Swal.fire(
          'Warning',
          'Not enough allowance',
          'warning'
        )
        setStatus('SWAP');
      }
      
    }catch(err){
      console.log(err);
      setStatus('SWAP');
    }
  }

  const getQuoteFunc = async (address,decimals,fromToken,toToken) => {
    const formattedAmount = sellValue.toString();
    const amount = parseUnits(formattedAmount).toString();
    setTransactionSummary(false)
    let getRate = await SwapService.getQuoteOne(fromToken, toToken);

    if(methods == 'sell'){
      setBuyValue(getFlooredFixed(parseFloat(await SwapService.getQuote(address, buySelectedTokenADDR, amount)), 4));
      setRate(getRate.toFixed(5))
      setGasFee(parseFloat((await SwapService.getQuoteGasFee(address, buySelectedTokenADDR, amount) / 1e9)))
      var totalValue = parseFloat(sellValue) + parseFloat((await SwapService.getQuoteGasFee(address, buySelectedTokenADDR, amount) / 1e9));
      if(totalValue > parseFloat(balance) ){
        setStatus('Insufficient Balance');
        setLoading(false);
      }
      else{
        setLoading(false);
        
        setStatus('SWAP');
        setAmountSwap(amount);
      }
      setTransactionSummary(true)
    }
    else{
      let quoteVal = 0;
      //USDT USDC
      quoteVal = await SwapService.getQuote(sellSelectedTokenADDR, address, amount);

      setRate(getRate.toFixed(5))
      if(decimals <=8){
        const formattedAmount = quoteVal.toString();
        const amounttest = parseUnits(formattedAmount, 12).toString();
        const amounttest2 = parseUnits(formattedAmount, 10).toString();

        if(decimals === 8){
          setBuyValue(getFlooredFixed(amounttest2 / 1e9 / 1e9,4));
        }
        else{
          setBuyValue(getFlooredFixed(amounttest / 1e9 / 1e9,2));
        }
        
      }
      else{
        
        setBuyValue(getFlooredFixed(quoteVal / 1e9 / 1e9,4));
      }
      setGasFee(parseFloat((await SwapService.getQuoteGasFee(sellSelectedTokenADDR, address, amount) / 1e9)))
      var totalValue = parseFloat(sellValue) + parseFloat((quoteVal / 1e9));
      
      if(totalValue > parseFloat(balance)){
        setStatus('Insufficient Balance');
        setLoading(false);
        
      }
      else{
        setLoading(false);
        
        setStatus('SWAP');
        setAmountSwap(amount);
      }
      setTransactionSummary(true)
    }
    
  }

  const getQuoteFuncOnKey = async (from,to,value,fromToken,toToken) => {
    let quoteVal = 0;
    let totalValue;
    let getRate = await SwapService.getQuoteOne(fromToken, toToken);
    setTransactionSummary(false)
    const formattedAmount1 = value.toString();
    const amount1 = parseUnits(formattedAmount1).toString();
    quoteVal = await SwapService.getQuote(from, to, amount1);
    totalValue = parseFloat(value) + parseFloat((await SwapService.getQuoteGasFee(from, to, amount1) / 1e9));
    setRate(getRate.toFixed(5))
    //USDT USDC
    if(decimal <=8){
      
      const formattedAmount = quoteVal.toString();
      const amounttest = parseUnits(formattedAmount, 12).toString();
      const amounttest2 = parseUnits(formattedAmount, 10).toString();

      if(decimal === 8){
        setBuyValue(getFlooredFixed(amounttest2 / 1e9 / 1e9,4));
      }
      else{
        setBuyValue(getFlooredFixed(amounttest / 1e9 / 1e9,2));
      }
      setTransactionSummary(true)
    }
    else{
      setBuyValue(getFlooredFixed(quoteVal / 1e9 / 1e9,4));
      setTransactionSummary(true)
    }
    setGasFee(parseFloat((await SwapService.getQuoteGasFee(from, to, amount1) / 1e9)))
    if(totalValue > parseFloat(balance)){
      setLoading(false);
      setStatus('Insufficient Balance');
    }
    else{
      setLoading(false);
      setStatus('SWAP');
      setAmountSwap(amount1);
      
    }
  }

  const getQuoteReverse = async (sellTokenAddr,buyTokenAddr,amountReverse) => {
    const formattedAmount = amountReverse.toString();
    const amount = parseUnits(formattedAmount).toString();
    const swapAmount = getFlooredFixed(parseFloat(await SwapService.getQuote(sellTokenAddr, buyTokenAddr, amount) / 1e9 / 1e9), 5);
    setBuyValue(swapAmount);
    setTransactionSummary(false)
    setGasFee(parseFloat((await SwapService.getQuoteGasFee(sellTokenAddr, buyTokenAddr, amount) / 1e9)));
    var totalValue = parseFloat(amountReverse) + parseFloat((await SwapService.getQuoteGasFee(sellTokenAddr, buyTokenAddr, amount) / 1e9));

    if(totalValue < 0){
      setStatus('Insufficient Balance');
      setLoading(false);
      setTransactionSummary(true)
    }
    else{
      setLoading(false);
      setTransactionSummary(true)
      setStatus('SWAP');
      setAmountSwap(swapAmount * 1e9 * 1e9);
    }
    
  }

  const swapReverse = async () => {
    setLoading(true);
    setTransactionSummary(false)
    if(buySelectedToken == 'Select Token'){
      Swal.fire(
        'Warning',
        'Please select a token to buy.',
        'warning'
      )
    }
    else{
        if(sellValue > balance){
          setStatus('Insufficient Balance');
          
        }
        else{
          setStatus('SWAP');
          
        }

        if(buySelectedTokenADDR != '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
          try{
            setStatusAppr("Give Permission to swap "+buySelectedToken);
            dispatch(fetchBalance(getFlooredFixed(parseFloat(await Balance.getTokenBal(buySelectedTokenADDR).balanceOf(userAddress).call() / 1e9 / 1e9), 4)));
            const allowance = await SwapService.getAllowance(buySelectedTokenADDR,userAddress);
            setLoading(false);
            
            setAllowanceApprove(allowance);
          }catch(err){
            console.log(err);
          }
        }
  
       
        dispatch(fetchBalance(buyBalance));
        setBuyBalance(balance);
  
        setSellValue(buyValue);
  
        if(buyValue > 0){
          setTimeout(async function(){
            getQuoteReverse(buySelectedTokenADDR,sellSelectedTokenADDR,buyValue)
          }, 2000);
          
        }
        
        setbuySelectedToken(sellSelectedToken);
        setbuySelectedTokenIMG(sellSelectedTokenIMG);
        setBuySelectedTokenADDR(sellSelectedTokenADDR);
    
        setSellSelectedToken(buySelectedToken);
        setSellSelectedTokenIMG(buySelectedTokenIMG);
        setSellSelectedTokenADDR(buySelectedTokenADDR);
      
    }
  }

  const tokenPreselected = [
    {
      token: "ETH",
      url: "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: 18
    },
    {
      token: "USDC",
      url: "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 6
    },
    {
      token: "USDT",
      url: "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      decimals: 6
    },
    {
      token: "WBTC",
      url: "https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
      address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      decimals: 8
    },
    {
      token: "BUSD",
      url: "https://tokens.1inch.io/0x4fabb145d64652a948d72533023f6e7a623c7c53.png",
      address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
      decimals: 18
    },
  ];

  const swapPermit = async () => {
    setStatusAppr(<CircularProgress/>);
    const tx = await SwapService.getApproveTx(sellSelectedTokenADDR, amountSwap)
    const ethVal = '0x'+dec2He(tx.value);
    const transactionParametersApp = {
      to: tx.to, // Required except during contract publications.
      from: userAddress, // must match user's active address.
      value: ethVal.toString(), // Only required to send ether to the recipient from the initiating external account.
      data :tx.data, // Optional, but used for defining smart contract creation and interaction.
    };

    try{
      const txHashApp = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParametersApp],
      });

      try{
        if(txHashApp){
          setStatusAppr("Give Permission to swap "+buySelectedToken);
          dispatch(fetchBalance(getFlooredFixed(parseFloat(await Balance.getTokenBal(buySelectedTokenADDR).balanceOf(userAddress).call() / 1e9 / 1e9), 4)));
          const allowance = await SwapService.getAllowance(buySelectedTokenADDR,userAddress);
          setAllowanceApprove(allowance);
        }
      }catch(err){
        setStatusAppr("Give Permission to swap "+sellSelectedToken);
      }

      console.log(txHashApp);
    }catch(err){
      console.log(err);
      setStatus('SWAP');
      setStatusAppr("Give Permission to swap "+sellSelectedToken);
    }
  }

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
        <div className="content2">
          <div className="swap-box1">
            <h1>Quick Swap</h1>
            <div className="row first-row">
              <div className="col-md-12 input-1">
                <div className='desktop'>
                  <div className="row-input-1">
                    <div className="col-md-3">
                      <label className="from">You Send</label>
                    </div>
                    <div className="col-md-4">
                    </div>
                    <div className="col-md-2">
                      <label className="balance">Balance:</label>
                    </div>
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-2">
                      <label className="remaining">{balance}</label>
                    </div>
                  </div>
                </div>
                <div className='mobile'>
                  <div className="row-input-1">
                    <div className="col-md-2">
                      <label className="from">You Send</label>
                    </div>
                    <div className="col-md-2">
                      <label className="balance">Balance: <span className='remaining'>{balance}</span></label>
                    </div>
                  </div>
                </div>
                <input inputProps={{lengthinput}} value={sellValue} onChange={sellInputFunc} type="text" className="form-control" />
                <div className='btn-sell-buy'>
                  <Button id="sell_btn" onClick={e => handleOpen('sell')}>
                      {sellSelectedTokenIMG?
                        <img alt={'Logo'} src={sellSelectedTokenIMG} width={30} height={30} />
                      :
                        []
                      }
                    &nbsp;{sellSelectedToken}<ArrowDropDownIcon /></Button>
                </div>
              </div>
              <div className="col-md-12 swap-container">
               <SwapVertIcon onClick={e => swapReverse()} className="swap"/>
                {/* <img onClick={e => swapReverse()} className="swap" src="image/icons/swap.svg"/> */}
              </div>
              <div className="col-md-12 input-2">
                <div className='desktop'>
                  <div className="row-input-2">
                    <div className="col-md-2">
                      <label className="from">You Get</label>
                    </div>
                    <div className="col-md-5">
                    </div>
                    <div className="col-md-2">
                      <label className="balance">Balance:</label>
                    </div>
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-2">
                      <label className="remaining">{buyBalance}</label>
                    </div>
                  </div>
                </div>
                <div className='mobile'>
                  <div className="row-input-2">
                    <div className="col-md-2">
                      <label className="from">You Get</label>
                    </div>
                    <div className="col-md-2">
                      <label className="balance">Balance: <span className="remaining">{buyBalance}</span> </label>
                    </div>
                  </div>
                </div>
                <>
                  <input 
                  type="text" 
                  disabled
                  className="form-control" 
                  value={buyValue} 
                  onChange={buyInputFunc}  
                  InputProps={{
                    readOnly: true,
                  }}
                  />
                  <div className='btn-sell-buy'>
                    <Button id="buy_btn" onClick={e => handleOpen('buy')}>
                      {buySelectedTokenIMG?
                        <img alt={'Logo'} src={buySelectedTokenIMG} width={30} height={30} />
                      :
                        []
                      }
                      
                      &nbsp;{buySelectedToken}
                      <ArrowDropDownIcon />
                    </Button>
                  </div>
                </>
              </div>
            </div>
            <Modal
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box sx={style} id="token-modal">
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <Button onClick={handleClose}><ArrowBackIosIcon style={{fontSize: '15px'}}/></Button>
                    </Grid>
                    <Grid item xs={8}>
                      <h3>Select a Token</h3>
                    </Grid>
                  </Grid>
                  
                  {tokenPreselected.map((option, index) => (
                      <Button
                        onClick={e => clickToken(option.url,option.token,option.address,option.decimals)}
                      >
                        <img src={option.url} alt={'Logo'} width={30} height={30} />&nbsp;
                        {option.token}
                      </Button>
                  ))}
                  <Divider/>
                  <div style={{overflowY: 'auto',height:'274px'}}>
                    {getData}
                  </div>
                </Box>
              </Fade>
            </Modal>
            <div className="row">
              <div className="col-md-4">
              </div>
              {transactionSummary === true?
              <>
                <div className='col-md-12 transaction'>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>1 {buySelectedToken} = {rate} {sellSelectedToken}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <table id="summary_transaction" className='table table-hover'>
                        <tbody>
                          <tr>
                            <td className='left'>Estimated Gas Fee:</td>
                            <td className='right'>{gasFee}&nbsp;(${parseFloat(gasFee*eth).toFixed(2)})</td>
                          </tr>
                          <tr>
                            <td className='left'>Network Fee:</td>
                            <td className='right'>FREE</td>
                          </tr>
                        </tbody>
                      </table>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
              :
                []
              }
              <div className="col-md-12 wallet-btn-wrapper">
              {!userAddress?
              <>
                {loading === false?
                  <div className='wallet-btn'>
                    <ConnectWalletButton/>
                  </div>
                  :
                  <Skeleton variant="rectangular" />
                }
              </>
              :
              <>
                {status == 'SWAP'?
                <div>
                  {loading === false?
                    <>
                      {sellSelectedTokenADDR != "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" && sellAllowanceApprove == 0?
                        <div className='wallet-btn'>
                          <button>
                            {status}
                          </button>
                        </div>
                        :
                        <>
                        
                          <div onClick={e => swapToken()} className='btn-wallet-approve'>
                            <button>
                              {status}
                            </button>
                          </div>
                        </>
                      }
                    </>
                    :
                    <Skeleton variant="rectangular" />
                  }
                </div>
                :            
                  <>
                  {loading === false?
                    <div className='wallet-btn'>
                      <button>{status}</button>
                    </div>
                    :
                    <Skeleton variant="rectangular" />
                  }
                  </>
                }
              </>
              }
              </div>
              <div className="col-md-4">
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
