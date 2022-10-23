import React, { useState }  from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useSelector, useDispatch } from 'react-redux'
import {
    decrement,
    increment,
    fetchBalance,
  } from '../features/balance/metamaskBalanceReducer';
import Button from '@mui/material/Button';
import {ethers} from 'ethers';
import MetamaskLogo from '../images/metamask.png';

const  Metamask = () =>{
    const [errorMessage,setErrorMessage] = useState(null);
    const [defaultAccount,setDefaultAccount] = useState(null);
    const [connBUttonText,setConnButtonText] = useState('Connect Wallet');
    const [boolIcon,setBoolIcon] = useState(false);
    const dispatch = useDispatch()

    const balance = useSelector((state) => state.counter.value)

    const connectWalletHandler = () => {
        if(window.ethereum){
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result =>{
                accountChangedHandler(result[0]);
            })
        }
        else{
            setErrorMessage('Install Metamask');
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        setConnButtonText(newAccount);
        setBoolIcon(true);
        getUserBalance(newAccount.toString());

    }

    const getFlooredFixed = (v, d) => {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    }

    const getUserBalance = (address) => {
        window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
        .then(balance => {
            dispatch(fetchBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4)));
        })
    }

    const chainChangedHandler = () => {
        window.location.reload();
    }

    window.ethereum.on('accountsChanged', accountChangedHandler);

    window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <div>
        <Button 
        variant="outlined"
        onClick={connectWalletHandler}
        >
            {boolIcon ? (
                <img src={MetamaskLogo} width={30} height={30} />
            ) : (
                <AccountBalanceWalletIcon/>
            )}
            &nbsp;
            {connBUttonText}
        </Button>
        </div>
    );
}

export default Metamask;