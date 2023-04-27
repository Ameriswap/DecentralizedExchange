import React, { useState, useEffect }  from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
// web.cjs is required for IE11 support
import { useSpring, animated } from '@react-spring/web';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import axios from "axios";
import SwapService from "../api/Swap";
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2'
import Web3 from "web3";
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
  const [buySelectedToken, setbuySelectedToken] = React.useState('Select Token');
  const [buySelectedTokenIMG, setbuySelectedTokenIMG] = React.useState("");
  const [buySelectedTokenADDR, setBuySelectedTokenADDR] = React.useState('');


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

  const balanceMax = async () => {
    if(sellValue > balance){
      setStatus('Insufficient Balance');
      setLoading(false);
    }
    else{
      if(buySelectedToken != 'Select Token'){
        getQuoteFuncOnKey(sellSelectedTokenADDR,buySelectedTokenADDR,balance)
        setSellValue(balance);
      }
      else{
        setSellValue(balance);
      }
    }

  }

  const sellInputFunc = (event) => {
    setLoading(true);
    if(typeof event.target.value !== 'number' && isNaN(event.target.value)){
      setSellValue('');
      setLoading(false);
    }
    else{
      if(event.target.value > balance){
        setStatus('Insufficient Balance');
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
              getQuoteFuncOnKey(sellSelectedTokenADDR,buySelectedTokenADDR,event.target.value)
            }, 2000);
          }
        }
        setSellValue(event.target.value);
      }
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
          const tokenInst = new web3.eth.Contract(tokenABI, address);
          
          dispatch(fetchBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9), 4)));
          const allowance = await SwapService.getAllowance(address,userAddress);
          setAllowanceApprove(allowance);

          //USDT USDC
          if(address == "0xdac17f958d2ee523a2206206994597c13d831ec7" || address == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"){
            console.log(parseFloat(await tokenInst.methods.balanceOf(userAddress).call()))
            let bals = parseFloat(await tokenInst.methods.balanceOf(userAddress).call())
            if(bals % 1 != 0){
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call()).toFixed(4)));
            }
            else{
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call())));
            }
            
          }
          else{
            console.log(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9))
            let bals = parseFloat(await tokenInst.methods.balanceOf(userAddress).call())
            if(bals % 1 != 0){
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9).toFixed(4)));
            }
            else{
              dispatch(fetchBalance(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9)));
            }
          }
        }catch(err){
          console.log(err);
        }
      }
      setSellSelectedToken(token);
      setSellSelectedTokenIMG(img);
      setSellSelectedTokenADDR(address);

      if(sellValue > 0){
      
        setTimeout(async function(){
          getQuoteFunc(address)
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
          const tokenInst = new web3.eth.Contract(tokenABI, address);
          let buyBal = await tokenInst.methods.balanceOf(userAddress).call();
          //USDT USDC
          if(address == "0xdac17f958d2ee523a2206206994597c13d831ec7" || address == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"){
            const formattedAmount = buyBal.toString();
            const amounttest = parseUnits(formattedAmount, 12).toString();
            setBuyBalance(amounttest / 1e9 / 1e9);
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

      setbuySelectedToken(token);
      setbuySelectedTokenIMG(img);
      setBuySelectedTokenADDR(address);
      
      if(sellValue > 0){
      
        setTimeout(async function(){
          getQuoteFunc(address)
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
        const tokenInst = new web3.eth.Contract(tokenABI, buySelectedTokenADDR);
        setBuyBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9), 4));
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

  const getQuoteFunc = async (address) => {
    const formattedAmount = sellValue.toString();
    const amount = parseUnits(formattedAmount, decimal).toString();
    if(methods == 'sell'){
      setBuyValue(getFlooredFixed(parseFloat(await SwapService.getQuote(address, buySelectedTokenADDR, amount)), 4));
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
    }
    else{
      let quoteVal = 0;
      //USDT USDC
      if(address == "0xdac17f958d2ee523a2206206994597c13d831ec7" || address == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"){
        quoteVal = await SwapService.getQuote(sellSelectedTokenADDR, address, amount);
        const formattedAmount = quoteVal.toString();
        const amounttest = parseUnits(formattedAmount, 12).toString();
        setBuyValue(amounttest / 1e9 / 1e9);
      }
      else{
        quoteVal = await SwapService.getQuote(sellSelectedTokenADDR, address, amount);
        setBuyValue(getFlooredFixed(quoteVal / 1e9 / 1e9,4));
      }
      setGasFee(parseFloat((await SwapService.getQuoteGasFee(sellSelectedTokenADDR, address, amount) / 1e9)));
      var totalValue = parseFloat(sellValue) + parseFloat((await SwapService.getQuoteGasFee(sellSelectedTokenADDR, address, amount) / 1e9));
      
      if(totalValue > parseFloat(balance)){
        setStatus('Insufficient Balance');
        setLoading(false);
      }
      else{
        setLoading(false);
        setStatus('SWAP');
        setAmountSwap(amount);
      }
    }
    
  }

  const getQuoteFuncOnKey = async (from,to,value) => {
    let quoteVal = 0;
    let amount1;
    let totalValue;
    //USDT USDC
    if(to == "0xdac17f958d2ee523a2206206994597c13d831ec7" || to == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"){
      const formattedAmount1 = value.toString();
      amount1 = parseUnits(formattedAmount1, decimal).toString();
      quoteVal = await SwapService.getQuote(from, to, amount1);
      setGasFee(parseFloat((await SwapService.getQuoteGasFee(from, to, amount1) / 1e9)));
      totalValue = parseFloat(value) + parseFloat((await SwapService.getQuoteGasFee(from, to, amount1) / 1e9));
      const formattedAmount = quoteVal.toString();
      const amounttest = parseUnits(formattedAmount, 12).toString();
      setBuyValue(amounttest / 1e9 / 1e9);
    }
    else{
      const formattedAmount1 = value.toString();
      amount1 = parseUnits(formattedAmount1, decimal).toString();
      setGasFee(parseFloat((await SwapService.getQuoteGasFee(from, to, amount1) / 1e9)))
      totalValue = parseFloat(value) + parseFloat((await SwapService.getQuoteGasFee(from, to, amount1) / 1e9));
      quoteVal = await SwapService.getQuote(from, to, amount1);
      setBuyValue(getFlooredFixed(quoteVal / 1e9 / 1e9,4));
    }
    if(totalValue > parseFloat(balance)){
      setLoading(false);
      setStatus('Insufficient Balance');
      setLoading(false);
      
    }
    else{
      setLoading(false);
      setStatus('SWAP');
      setAmountSwap(amount1);
    }
  }

  const getQuoteReverse = async (sellTokenAddr,buyTokenAddr,amountReverse) => {
    const formattedAmount = amountReverse.toString();
    const amount = parseUnits(formattedAmount, decimal).toString();
    const swapAmount = getFlooredFixed(parseFloat(await SwapService.getQuote(sellTokenAddr, buyTokenAddr, amount) / 1e9 / 1e9), 5);
    setBuyValue(swapAmount);
    setGasFee(parseFloat((await SwapService.getQuoteGasFee(sellTokenAddr, buyTokenAddr, amount) / 1e9)));
    var totalValue = parseFloat(amountReverse) + parseFloat((await SwapService.getQuoteGasFee(sellTokenAddr, buyTokenAddr, amount) / 1e9));

    if(totalValue < 0){
      setStatus('Insufficient Balance');
      setLoading(false);
    }
    else{
      setLoading(false);
      setStatus('SWAP');
      setAmountSwap(swapAmount * 1e9 * 1e9);
    }
    
  }

  const swapReverse = async () => {
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
            const tokenInst = new web3.eth.Contract(tokenABI, buySelectedTokenADDR);
            dispatch(fetchBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9), 4)));
            const allowance = await SwapService.getAllowance(buySelectedTokenADDR,userAddress);
            setAllowanceApprove(allowance);
          }catch(err){
            console.log(err);
          }
        }
  
        setLoading(true);
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
      token: "WETH",
      url: "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      decimals: 18
    },
    {
      token: "USDC",
      url: "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 18
    },
    {
      token: "DAI",
      url: "https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png",
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      decimals: 18
    },
    {
      token: "USDT",
      url: "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      decimals: 18
    },
    {
      token: "WBTC",
      url: "https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
      address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      decimals: 18
    },
    {
      token: "1INCH",
      url: "https://tokens.1inch.io/0x111111111117dc0aa78b770fa6a738034120c302.png",
      address: "0x111111111117dc0aa78b770fa6a738034120c302",
      decimals: 18
    }
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
          const tokenInst = new web3.eth.Contract(tokenABI, buySelectedTokenADDR);
          dispatch(fetchBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(userAddress).call() / 1e9 / 1e9), 4)));
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
      <div className="header-content2 row">
        <div className="col-md-2"></div>
        <div className="content2 col-md-5">
          <div className="swap-box1">
            <h1>Quick Swap</h1>
            <div className="row first-row">
              <div className="col-md-5">
                <div className="row">
                  <div className="col-md-2">
                    <label className="from">From</label>
                  </div>
                  <div className="col-md-2">
                  </div>
                  <div className="col-md-2">
                    <label className="balance">Balance:</label>
                  </div>
                  <div className="col-md-2">
                  </div>
                  <div className="col-md-2">
                    <label className="remaining">{balance}</label>
                  </div>
                </div>
                <input inputProps={{lengthinput}} value={sellValue} onChange={sellInputFunc} type="text" className="form-control" />
                <Button id="sell_btn" onClick={e => handleOpen('sell')}><img alt={'Logo'} src={sellSelectedTokenIMG} width={30} height={30} />&nbsp;{sellSelectedToken}<ArrowDropDownIcon /></Button>
              </div>
              <div className="col-md-2">
                <img onClick={e => swapReverse()} className="swap_icon" src="image/icons/swap.svg"/>
              </div>
              <div className="col-md-5">
                <div className="row">
                  <div className="col-md-2">
                    <label className="from">To</label>
                  </div>
                  <div className="col-md-2">
                  </div>
                  <div className="col-md-2">
                    <label className="balance">Balance:</label>
                  </div>
                  <div className="col-md-2">
                  </div>
                  <div className="col-md-2">
                    <label className="remaining">{buyBalance}</label>
                  </div>
                </div>
                {loading === false?
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
                  <Button id="buy_btn" onClick={e => handleOpen('buy')}>
                    {buySelectedTokenIMG?
                      <img alt={'Logo'} src={buySelectedTokenIMG} width={30} height={30} />
                    :
                      []
                    }
                    
                    &nbsp;{buySelectedToken}
                    <ArrowDropDownIcon />
                  </Button>
                  </>
                :
                <Skeleton variant="rectangular" width={240} height={30} />
              }
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
                <Box sx={style}>
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <Button onClick={handleClose}><ArrowBackIosIcon style={{fontSize: '15px'}}/></Button>
                    </Grid>
                    <Grid item xs={8}>
                      <h3>Select a Token</h3>
                    </Grid>
                  </Grid>
                  
                  <TextField
                    id="input-with-icon-textfield"
                    placeholder="Search a Token or Address"
                    style={{
                      width: '100%',
                      textAlign: 'center'
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                    onChange={e => filterToken(e.target.value)}
                  />
                  <Divider/>
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
              <div className="col-md-4">
                {status == 'SWAP'?
                <div>
                  {sellSelectedTokenADDR != "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" && sellAllowanceApprove == 0?
                    <div className='btn-wallet'>
                      <span>{status}</span>
                    </div>
                    :
                    <div onClick={e => swapToken()} className='swap_button_approved'>
                      {loading === false?
                          <span>{status}</span>
                      :
                        <Skeleton variant="rectangular" width={350} height={30} />
                      }
                    </div>
                  }
                </div>
                :                
                <button className="btn-wallet">
                  <span>{status}</span>
                </button>
                }
              </div>
              <div className="col-md-4">
              </div>
            </div>
          </div>
        </div>
        <div className="content2-2nd col-md-5">
          <div className="swap-box2">
          </div>
        </div>
      </div>      
    </div>
  );
}
