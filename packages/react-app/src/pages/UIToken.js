import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// web.cjs is required for IE11 support
import { useSpring, animated } from '@react-spring/web';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CardContent from '@mui/material/CardContent';
import axios from "axios";
import SwapService from "../api/Swap";

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


const fetch = require('isomorphic-fetch')
const { providers, BigNumber, Wallet } = require('ethers')
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

export default function UIToken() {
  const [open, setOpen] = React.useState(false);
  const [methods,setMethods] = React.useState();
  const [decimal,setDecimal]= React.useState();
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

  //Sell feature
  const [sellValue,setSellValue] = React.useState(0);
  const [lengthinput,setLengthInput] = React.useState('');

  const balanceMax = () => {
    setSellValue(balance);
  }

  const sellInputFunc = (event) => {
    if(typeof event.target.value !== 'number' && isNaN(event.target.value)){
      setSellValue('');
    }
    else{
      if(event.target.value > balance){
        setStatus('Insufficient Balance');
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
            getQuoteFunc();
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
    setDecimal(decimals);
    if(methods == 'sell'){
      setSellSelectedToken(token);
      setSellSelectedTokenIMG(img);
      setSellSelectedTokenADDR(address);

      if(sellValue > 0){
        getQuoteFunc()
      }
    }
    else{
      setbuySelectedToken(token);
      setbuySelectedTokenIMG(img);
      setBuySelectedTokenADDR(address);

      const userAddress = window.localStorage.getItem('userAccount');
      if(sellValue > 0){
        getQuoteFunc()
      }
    }
  }

  const swapToken = async () => {
    // const txData = await SwapService.getSwapTx(chainId, fromTokenAddress, toTokenAddress, fromAddress, amount, slippage)
    // console.log('swap data:', txData)
    // const tx = await wallet.sendTransaction(txData)
    // console.log('swap tx:', tx.hash)
    // await tx.wait()
  
    // console.log('done')
  }

  const getQuoteFunc = async () => {
    const formattedAmount = sellValue.toString();
    const amount = parseUnits(formattedAmount, decimal).toString();
    const userAddress = window.localStorage.getItem('userAccount');
    setTimeout(async function(){
      setBuyValue(await SwapService.getQuote(sellSelectedTokenADDR, buySelectedTokenADDR, amount));
    }, 4000);
    
  }


  return (
    <div>
      <CardContent>
        <Typography variant="body2" component={'div'} color="text.secondary">
          <Grid container spacing={0}>
            <Grid item xs={3}>
              You Sell
            </Grid>
            <Grid item xs={9}>
              <span style={{float:'right'}}>Balance: {balance} <span style={{cursor: 'pointer'}} onClick={balanceMax}>MAX</span></span> 
            </Grid>
          </Grid>
          <Grid style={{position: 'relative',top: '3px'}} container spacing={0}>
            <Grid item xs={4}>
              <Button onClick={e => handleOpen('sell')}><img alt={'Logo'} src={sellSelectedTokenIMG} width={30} height={30} />&nbsp;{sellSelectedToken}<ArrowDropDownIcon /></Button>
            </Grid>
            <Grid style={{float:'right'}} item xs={8}>
              <TextField inputProps={{lengthinput}} id="sell_input" value={sellValue} onChange={sellInputFunc}  variant="standard" />
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <div className='swap_icon'>
        <Button><ArrowDownwardIcon/></Button>
      </div>
      <CardContent style={{marginTop: '-31px'}}>
        <Typography variant="body2" component={'div'} color="text.secondary">
          <Grid container spacing={0}>
            <Grid item xs={3}>
              You Buy
            </Grid>
            <Grid item xs={9}>
              <span style={{float:'right'}}>Balance: 0</span> 
            </Grid>
          </Grid>
          <Grid style={{position: 'relative',top: '3px'}} container spacing={0}>
            <Grid item xs={4}>
              <Button onClick={e => handleOpen('buy')}>
                {buySelectedTokenIMG?
                  <img alt={'Logo'} src={buySelectedTokenIMG} width={30} height={30} />
                :
                  []
                }
                
                &nbsp;{buySelectedToken}
                <ArrowDropDownIcon /></Button>
            </Grid>
            <Grid style={{float:'right'}} item xs={8}>
              <TextField 
              id="sell_input" 
              value={buyValue} 
              onChange={buyInputFunc}  
              InputProps={{
                readOnly: true,
              }}
              variant="standard" />
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <div className='swap_button'>
        <span>{status}</span>
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
            <div style={{overflowY: 'auto',height:'274px'}}>
              {getData}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
