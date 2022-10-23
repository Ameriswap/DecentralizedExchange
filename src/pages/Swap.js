import React, { Component }  from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
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
import Divider from '@mui/material/Divider';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TextField from '@mui/material/TextField';

import Eth from'../images/eth.png';
import OneInch from'../images/1inch.png';
import { useSelector, useDispatch } from 'react-redux'

//fetchTokens
import Tokens from '../api/Tokens';

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

const options_sell = ['ETH'];
const options_buy = ['1INCH'];

export default function Swap() {
  const [expanded, setExpanded] = React.useState(false);
  const [status,setStatus] = React.useState('Enter amount to swap');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //Sell feature
  const [openSell, setOpenSell] = React.useState(false);
  const anchorRefSell = React.useRef(null);
  const [selectedIndexSell, setSelectedIndexSell] = React.useState(0);
  const [sellValue,setSellValue] = React.useState(0);
  const [lengthInput,setLengthInput] = React.useState('');
  
  //metamask eth balance
  const balance = useSelector((state) => state.counter.value)

  const handleMenuItemClickSell = (event, index) => {
    setSelectedIndexSell(index);
    setOpenSell(false);
  };

  const handleToggleSell = () => {
    setOpenSell((prevOpen) => !prevOpen);
  };

  const handleCloseSell = (event) => {
    if (anchorRefSell.current && anchorRefSell.current.contains(event.target)) {
      return;
    }

    setOpenSell(false);
  };

  const sellInputFunc = (event) => {
    if(typeof event.target.value != 'number' && isNaN(event.target.value)){
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
        setStatus('Enter amount to swap');
      }
    }
  }

  const balanceMax = () => {
    setSellValue(balance);
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
    if(typeof event.target.value != 'number' && isNaN(event.target.value)){
      setSellValue('');
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
        <Typography variant="body2" color="text.secondary">
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
            <ButtonGroup variant="outlined" ref={anchorRefSell} aria-label="split button">
                <Button onClick={handleToggleSell}><img src={Eth} width={30} height={30} />&nbsp;{options_sell[selectedIndexSell]}<ArrowDropDownIcon /></Button>
            </ButtonGroup>
            <Popper
                sx={{
                zIndex: 1,
                }}
                open={openSell}
                anchorEl={anchorRefSell.current}
                role={undefined}
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
                    <ClickAwayListener onClickAway={handleCloseSell}>
                        <MenuList id="split-button-menu" autoFocusItem>
                        {options_sell.map((option, index) => (
                            <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndexSell}
                            onClick={(event) => handleMenuItemClickSell(event, index)}
                            >
                            <img src={Eth} width={30} height={30} />&nbsp;{option}
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
            <TextField id="sell_input" inputProps={lengthInput} value={sellValue} onChange={sellInputFunc}  variant="standard" />
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      {/* <div className='swap_icon'>
        <Button><ArrowDownwardIcon/></Button>
      </div> */}
      <CardContent style={{marginTop: '5px'}}>
        <Typography variant="body2" color="text.secondary">
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
                <Button onClick={handleToggleBuy}><img src={OneInch} width={30} height={30} />&nbsp;{options_buy[selectedIndexBuy]}<ArrowDropDownIcon /></Button>
            </ButtonGroup>
            <Popper
                sx={{
                zIndex: 1,
                }}
                open={openBuy}
                anchorEl={anchorRefBuy.current}
                role={undefined}
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
                            <img src={OneInch} width={30} height={30} />&nbsp;{option}
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
              <TextField id="sell_input" inputProps={lengthInput} value={buyValue} onChange={buyInputFunc}  variant="standard" />
            </Grid>
            <Tokens/>
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
