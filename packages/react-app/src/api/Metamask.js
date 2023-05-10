import React, { useState,useEffect }  from 'react';
import $ from "jquery"
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchBalance,
} from '../features/balance/metamaskBalanceReducer';
import {
    fetchNetwork,
} from '../features/network/rpcUrlReducer';

import Button from '@mui/material/Button';
import {ethers} from 'ethers';
import MetamaskLogo from '../images/metamask.png';
import Swal from 'sweetalert2'
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import { useSpring, animated } from '@react-spring/web';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import Balance from "../api/Balance";

import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TrustWallet from'../images/trustwallet.png';
import CoinBaseWallet from'../images/coinbase.png';
import WalletConnect from'../images/walletconnect.png';
import Box from '@mui/material/Box';
import Networks from './Networks'
import Wallet from './Wallet'
import Web3 from "web3";
import { useWeb3React } from '@web3-react/core'
import { AlignVerticalBottomSharp } from '@mui/icons-material';

const  Metamask = () =>{
    let userAddress = window.localStorage.getItem('userAccount');
    const [open, setOpen] = React.useState(false);
    const [openWallet, setOpenWallet] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [connBUttonText,setConnButtonText] = useState('Connect Wallet');
    const [boolIcon,setBoolIcon] = useState(false);
    const options = ['Metamask Wallet','Trust wallet','Coinbase Wallet','Wallet Connect'];
    const optionsIMG = [MetamaskLogo,TrustWallet,CoinBaseWallet,WalletConnect];
    const [accountCheck,setAccountCheck] = React.useState(false);
    const dispatch = useDispatch()
    const { activate, deactivate } = useWeb3React();
    const { active, chainId, account } = useWeb3React();
    const [address,setAddress] = React.useState(null);
    const rpc = useSelector((state) => state.rpc.value);

    useEffect(() => {
    });

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


    const saveUserInfo = () => {
        accountChangedHandler();   
    }

    const disconnectWallet = async () => {
        try{
            if(deactivate){
                setAccountCheck(false)
                setOpenWallet(false)
                setBoolIcon(false)
            }
        }
        catch(error){
            Swal.fire(
                'Error',
                error,
                'error'
            )
        }
    }

    const connectWalletHandler = async (index) => {
        setOpen(false)

        if(index === 0){
            try{
                await activate(Wallet.Injected)
            }
            catch(error){
                Swal.fire(
                    'Error',
                    error,
                    'error'
                  )
            }
        }
        if(index === 1){
            try{
                await activate(Wallet.WalletConnect)
            }
            catch(error){
                Swal.fire(
                    'Error',
                    error,
                    'error'
                  )
            }
        }
        if(index === 2){
            try{
                await activate(Wallet.CoinbaseWallet)
            }
            catch(error){
                Swal.fire(
                    'Error',
                    error,
                    'error'
                  )
            }
        }
        if(index === 3){
            try{
                await activate(Wallet.WalletConnect)
            }
            catch(error){
                Swal.fire(
                    'Error',
                    error,
                    'error'
                  )
            }
        }
        setAccountCheck(true)
        setBoolIcon(true);
        if(active){
            setTimeout(function(){
                setAddress($('#address').val())
            },1000)
        }

        setTimeout(function(){
            setConnButtonText(address);
            getUserBalance(address);
            accounts(address);
        },2000)
    }

    const accountChangedHandler = async () => {
        // setConnButtonText(address);
        // setBoolIcon(true);
        // getUserBalance(address);
        // accounts(address);
    }

    const getFlooredFixed = (v, d) => {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    }

    const getUserBalance = async (address) => {
        const rpcUrls = {
            ethereum: 'https://mainnet.infura.io/v3/529670718fd74cd2a041466303daecd7',
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

        const tokenInst = new web3.eth.Contract(tokenABI, rpc);
        if(window.ethereum){
            setTimeout(function(){
                if(window.ethereum){
                    window.ethereum.request({ method: 'eth_getBalance', params: [$('#address').val(), 'latest']})
                    .then(balance => {
                        dispatch(fetchBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4)));
                        userBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4));
                    })
                }
            },2000)
        }
        else{
            try{
                dispatch(fetchBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf($('#address').val()).call() / 1e9 / 1e9), 4)));
                userBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf($('#address').val()).call() / 1e9 / 1e9), 4))
            }catch(error){
                console.log(error)
            }
        }

    }

    const accounts = () => {
        window.localStorage.setItem('userAccount', $('#address').val()); //user persisted data
    };

    const userBalance = (balance) => {
        window.localStorage.setItem('userBalance', balance); //user persisted data
    };

    const chainChangedHandler = () => {
        window.location.reload();
    }


    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', accountChangedHandler);

        window.ethereum.on('chainChanged', chainChangedHandler);
    }

    const connectWalletList = () => {
        setOpen(true)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };    

    const handleMenuItemClick = (event, index) => {
        connectWalletHandler(index)
        setSelectedIndex(index);
        setOpen(false);
    };    

    const handleOpenWallet = () => {
        setOpenWallet(true);
    }

    const handleCloseWallet = () => setOpenWallet(false);

    return (
        <div>
            {accountCheck === true
            ?
            <>
                <div style={{float: 'right'}}>
                    <Networks/>
                </div>
                <button 
                className="btn-wallet"
                onClick={handleOpenWallet}
                >
                    {boolIcon ? (
                        <img src={MetamaskLogo} alt={'Logo'} width={30} height={30} />
                    ) : (
                        <div className="conn-wallet"></div>
                    )}
                    &nbsp;
                    <span>{account.toString().substring(0, 14)}...</span>
                    <input type="hidden" id="address" value={account} />
                </button>
            </>
            :
            <>
                <button 
                className="btn-wallet" 
                onClick={connectWalletList}
                ref={anchorRef}
                >
                    
                    {boolIcon ? (
                        <img src={MetamaskLogo} alt={'Logo'} width={30} height={30} />
                    ) : (
                        <div className="conn-wallet"></div>
                    )}
                    &nbsp;
                    Connect Wallet
                </button>
            </>
            }

            <Modal
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              open={openWallet}
              onClose={handleCloseWallet}
            >
              <Fade in={openWallet}>
                <Box sx={style} id="token-modal">
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <Button onClick={handleCloseWallet}><ArrowBackIosIcon style={{fontSize: '15px'}}/></Button>
                    </Grid>
                    <Grid item xs={8}>
                      <h3>Account</h3>
                    </Grid>
                  </Grid>
                  <Grid container spacing={0}>
                    <Grid item xs={6}>
                        {accountCheck === true?
                            <>
                            <Chip style={{color: '#fff'}} label={account.substring(0, 14)+'...'}/>
                            </>
                        :
                            <>
                            
                            </>
                        }
                        
                    </Grid>
                    <Grid item xs={6}>
                        <Tooltip title="Disconnect">
                            <Button style={{float: 'right'}} onClick={disconnectWallet}>
                                <LogoutIcon/>
                            </Button>
                        </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Modal>

            <Popper
                sx={{
                zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
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
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                        {options.map((option, index) => (
                            <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                            >
                            <img alt={'Logo'} src={optionsIMG[index]} width={30} height={30} />&nbsp;{option}
                            </MenuItem>
                        ))}
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>       
        </div>
    );
}

export default Metamask;