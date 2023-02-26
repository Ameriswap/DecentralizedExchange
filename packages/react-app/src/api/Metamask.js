import React, { useState,useEffect }  from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useDispatch } from 'react-redux'
import {
    fetchBalance,
  } from '../features/balance/metamaskBalanceReducer';
import Button from '@mui/material/Button';
import {ethers} from 'ethers';
import MetamaskLogo from '../images/metamask.png';
import Swal from 'sweetalert2'

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

const  Metamask = () =>{
    let userAddress = window.localStorage.getItem('userAccount');
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [connBUttonText,setConnButtonText] = useState('Connect Wallet');
    const [boolIcon,setBoolIcon] = useState(false);
    const options = ['Metamask Wallet','Trust wallet','Coinbase Wallet','Wallet Connect'];
    const optionsIMG = [MetamaskLogo,TrustWallet,CoinBaseWallet,WalletConnect];
    const [accountCheck,setAccountCheck] = React.useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        saveUserInfo()
    });

    const saveUserInfo = () => {
        
        if(userAddress){
            connectWalletHandler();
            accountChangedHandler(userAddress);   
        }
    }

    const connectWalletHandler = () => {
        if(window.ethereum){
            console.log(window.ethereum);
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result =>{
                setAccountCheck(true)
                accountChangedHandler(result[0]);
            })
        }
        else{
            setAccountCheck(false)
            Swal.fire(
                'Error',
                'Non-Ethereum browser detected. You should consider trying MetaMask!',
                'error'
            )
        }
    }

    const accountChangedHandler = (newAccount) => {
        setConnButtonText(newAccount);
        setBoolIcon(true);
        getUserBalance(newAccount.toString());
        account(newAccount);
    }

    const getFlooredFixed = (v, d) => {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    }

    const getUserBalance = (address) => {
        window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
        .then(balance => {
            console.log(ethers.utils.formatEther(balance));
            dispatch(fetchBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4)));
            userBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4));
        })
    }

    const account = (account) => {
        window.localStorage.setItem('userAccount', account); //user persisted data
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
        if(index === 0){
            connectWalletHandler()
        }
        setSelectedIndex(index);
        setOpen(false);
    };    

    return (
            <div>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {accountCheck === true
                ?
                <>
                    <Networks/>
                    <Button 
                    variant="outlined"
                    ref={anchorRef}
                    >
                        {boolIcon ? (
                            <img src={MetamaskLogo} alt={'Logo'} width={30} height={30} />
                        ) : (
                            <AccountBalanceWalletIcon/>
                        )}
                        &nbsp;
                        {connBUttonText}
                    </Button>
                </>
                :
                <>
                    <Button 
                    variant="outlined"
                    ref={anchorRef}
                    onClick={connectWalletList}
                    >
                        {boolIcon ? (
                            <img src={MetamaskLogo} alt={'Logo'} width={30} height={30} />
                        ) : (
                            <AccountBalanceWalletIcon/>
                        )}
                        &nbsp;
                        {connBUttonText}
                    </Button>
                </>
                }

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
            </Box>         
        </div>
    );
}

export default Metamask;