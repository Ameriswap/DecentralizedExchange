import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// web.cjs is required for IE11 support
import { useSpring, animated } from '@react-spring/web';
import Eth from'../images/eth.png';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';

import Web3 from "web3";
import axios from "axios";
import Tokens from './tokens.json';

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
  var getTokens = [];
  var renderToken = [];
  useEffect(() => {
    var tokenList = Object.keys(Tokens)
    for(var x=0;x<=tokenList.length;x++){
      getTokens.push(Tokens[tokenList[x]]);
    }
    console.log(JSON.parse(getTokens));
  }, []);

  const todoItems = (
    <h1>aw</h1>
  );

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const RPC_URL = "https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf";
  const web3Provider = new Web3.providers.HttpProvider(RPC_URL);
  const web3 = new Web3(web3Provider);
  const wallet = web3.eth.accounts.wallet.add("093b35ebf2bc40b228b7687beda61f6ed8a91607fb1b9849dc9ba2d08b751443");

  //metamask eth balance
  const balance = useSelector((state) => state.counter.value);
  const [status,setStatus] = React.useState('Enter amount to swap');
  const userAccount = localStorage.getItem('userAccount');
  const userBalance = localStorage.getItem('userBalance');
  var toWeiAmountBal = 0;
  if(userBalance){
    toWeiAmountBal = web3.utils.toWei(userBalance.toString(), 'ether');
  }

  //Sell feature
  const [sellValue,setSellValue] = React.useState(0);
  const [lengthinput,setLengthInput] = React.useState('');

  const balanceMax = () => {
    setSellValue(balance);
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
        setSellValue(event.target.value);
      }
    }
  }


  return (
    <div>
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
          <Button onClick={handleOpen}><img alt={'Logo'} src={Eth} width={30} height={30} />&nbsp;ETH<ArrowDropDownIcon /></Button>
        </Grid>
        <Grid style={{float:'right'}} item xs={8}>
          <TextField inputProps={{lengthinput}} id="sell_input" value={sellValue} onChange={sellInputFunc}  variant="standard" />
        </Grid>
      </Grid>

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
            />
            <Divider/>
            <h1>{todoItems}</h1>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
