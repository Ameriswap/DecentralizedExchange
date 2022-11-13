import React, { useState }  from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useDispatch } from 'react-redux'
import {
    fetchBalance,
  } from '../features/balance/metamaskBalanceReducer';
import Button from '@mui/material/Button';
import {ethers} from 'ethers';
import MetamaskLogo from '../images/metamask.png';

const  Metamask = () =>{
    const [connBUttonText,setConnButtonText] = useState('Connect Wallet');
    const [boolIcon,setBoolIcon] = useState(false);
    const dispatch = useDispatch()

    const connectWalletHandler = () => {
        if(window.ethereum){
            console.log(window.ethereum);
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result =>{
                accountChangedHandler(result[0]);
            })
        }
        else{
            alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
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

    return (
        <div>
        <Button 
        variant="outlined"
        onClick={connectWalletHandler}
        >
            {boolIcon ? (
                <img src={MetamaskLogo} alt={'Logo'} width={30} height={30} />
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