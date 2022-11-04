import React, { useState, useEffect }  from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TextField from '@mui/material/TextField';
import Web3 from "web3";
import axios from "axios";

import Eth from'../images/eth.png';
import OneInch from'../images/1inch.png';
import { useSelector } from 'react-redux'

import UIToken from './UIToken';

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

const RPC_URL = "https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf";
const web3Provider = new Web3.providers.HttpProvider(RPC_URL);
const web3 = new Web3(web3Provider);
const wallet = web3.eth.accounts.wallet.add("093b35ebf2bc40b228b7687beda61f6ed8a91607fb1b9849dc9ba2d08b751443");

const options_sell = ['ETH'];
const options_buy = ['1INCH'];

export default function Swap() {
  const userAccount = localStorage.getItem('userAccount');
  const userBalance = localStorage.getItem('userBalance');
  var toWeiAmountBal = 0;
  if(userBalance){
    toWeiAmountBal = web3.utils.toWei(userBalance.toString(), 'ether');
  }
  const [expanded, setExpanded] = React.useState(false);
  const [status,setStatus] = React.useState('Enter amount to swap');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [lengthinput,setLengthInput] = React.useState('');

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

  //Buy Feature
  const [openBuy, setOpenBuy] = React.useState(false);
  const anchorRefBuy = React.useRef(null);
  const [selectedIndexBuy, setSelectedIndexBuy] = React.useState(0);
  const [buyValue,setBuyValue] = React.useState(0);

  const handleMenuItemClickBuy = (event, index) => {
    setSelectedIndexBuy(index);
    setOpenBuy(false);
  };

  const handleToggleBuy = () => {
    setOpenBuy((prevOpen) => !prevOpen);
  };

  const handleCloseBuy = (event) => {
    if (anchorRefBuy.current && anchorRefBuy.current.contains(event.target)) {
      return;
    }

    setOpenBuy(false);
  };

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



  return (
    <Card style={{margin: '0 auto',marginTop:53,borderRadius:24}} sx={{ maxWidth: 418 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Button>
            Swap
          </Button>
        }
      />
      <CardContent>
        <Typography variant="body2" component={'div'} color="text.secondary">
          <UIToken/>
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
            <ButtonGroup variant="outlined" ref={anchorRefBuy} aria-label="split button">
                <Button onClick={handleToggleBuy}><img alt={'Logo'} src={OneInch} width={30} height={30} />&nbsp;{options_buy[selectedIndexBuy]}<ArrowDropDownIcon /></Button>
            </ButtonGroup>
            <Popper
                sx={{
                zIndex: 1,
                }}
                open={openBuy}
                anchorEl={anchorRefBuy.current}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                    transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                >
                    <Paper>
                    <ClickAwayListener onClickAway={handleCloseBuy}>
                        <MenuList id="split-button-menu" autoFocusItem>
                        {options_buy.map((option, index) => (
                            <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndexBuy}
                            onClick={(event) => handleMenuItemClickBuy(event, index)}
                            >
                            <img alt={'Logo'} src={OneInch} width={30} height={30} />&nbsp;{option}
                            </MenuItem>
                        ))}
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>
            </Grid>
            <Grid style={{float:'right'}} item xs={8}>
              <TextField inputProps={{lengthinput}} id="sell_input" value={buyValue} onChange={buyInputFunc}  variant="standard" />
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <div className='swap_button'>
        <span>{status}</span>
      </div>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Lorem:</Typography>
          <Typography paragraph>
            Lorem Epsum.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
