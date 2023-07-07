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
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import TrustWallet from'../images/trustwallet.png';
import CoinBaseWallet from'../images/coinbase.png';
import WalletConnect from'../images/walletconnect.png';
import Box from '@mui/material/Box';
import Web3 from "web3";
import { networkParams } from "../networks";
import { toHex, truncateAddress } from "../utils";
import Web3Modal from "web3modal";
import { providerOptions } from "../providerOptions";
import Eth from'../images/eth.png';
import BnbChain from'../images/bnbchain.png';
import Arbitrum from'../images/arbitrum.png';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

const ConnectWalletSwap = () =>{
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
    const rpc = useSelector((state) => state.rpc.value);
    const [rpcUrl,setRpcUrl] = React.useState('');

    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [network, setNetwork] = useState();
    const [chainId, setChainId] = useState();
    const [error, setError] = useState();

    const [openNet, setOpenNet] = React.useState(false);
    const anchorRefNet = React.useRef(null);
    const [selectedIndexNet, setSelectedIndexNet] = React.useState(0);
  
    const optionsNet = [
        ['Ethereum','0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',1,'ethereum'],
        ['BNB','0xB8c77482e45F1F44dE1745F52C74426C631bDD52',56,'bnb'],
        ['Arbitrum','0x912CE59144191C1204E64559FE8253a0e49E6548',42161,'arbitrum']];

    const optionsIMGNet = [Eth,BnbChain,Arbitrum];

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
  
    const handleMenuItemClickNet = (event, index) => {
      setSelectedIndexNet(index);
      dispatch(fetchNetwork(optionsNet[index][1]));
      switchNetwork(optionsNet[index][2])
      setRpcUrl(optionsNet[index][3])
      setOpenNet(false);
    };
    
    const switchNetwork = async (chainID) => {
        try {
            await library.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: toHex(chainID) }]
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                await library.provider.request({
                    method: "wallet_addEthereumChain",
                    params: [networkParams[toHex(chainID)]]
                });
                } catch (error) {
                    setError(error);
                }
            }
        }
    };
  
    const handleToggleNet = () => {
      setOpenNet((prevOpen) => !prevOpen);
    };
  
    const handleCloseNet = (event) => {
      if (anchorRefNet.current && anchorRefNet.current.contains(event.target)) {
        return;
      }
  
      setOpenNet(false);
    };


    const refreshState = () => {
        setAccount();
        setChainId();
        setNetwork("");
        setAccountCheck(false)
        setBoolIcon(false);
        setOpenWallet(false);
    };

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        window.localStorage.clear();
        setTimeout(() => {
            window.location.reload()
        },1300)
        refreshState();
    };


    const connectWalletHandler = async (index) => {
        try {
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            console.log(provider)
            setProvider(provider);
            setLibrary(library);
            if (accounts) setAccount(accounts[0]);
            setNetwork(network);
            setAccountCheck(true)
            setBoolIcon(true);
            getUserBalance(accounts[0]);
            window.localStorage.setItem('userAccount', accounts[0]);
            setTimeout(() => {
                window.location.reload()
            },1300)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWalletHandler();
        }
    }, []);
    

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts) => {
                console.log("accountsChanged", accounts);
                if (accounts) setAccount(accounts[0]);
                
            };

            const handleChainChanged = (_hexChainId) => {
                setChainId(_hexChainId);
            };

            const handleDisconnect = () => {
                console.log("disconnect", error);
                disconnect();
            };

            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
            provider.on("disconnect", handleDisconnect);

            return () => {
                if (provider.removeListener) {
                provider.removeListener("accountsChanged", handleAccountsChanged);
                provider.removeListener("chainChanged", handleChainChanged);
                provider.removeListener("disconnect", handleDisconnect);
                }
            };
        }
    }, [provider]);

    const getFlooredFixed = (v, d) => {
        return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    }

    const getUserBalance = async (address) => {
        const rpcUrls = {
            ethereum: 'https://mainnet.infura.io/v3/529670718fd74cd2a041466303daecd7',
            bnb: 'https://bsc-dataseed.binance.org/',
            Arbitrum: 'https://arb1.arbitrum.io/rpc'
        }
        const web3Provider = new Web3.providers.HttpProvider(rpcUrls[rpcUrl]);
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
            window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest']})
            .then(balance => {
                dispatch(fetchBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4)));
                userBalance(getFlooredFixed(parseFloat(ethers.utils.formatEther(balance)), 4));
            })
        }
        else{
            try{
                dispatch(fetchBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(address).call() / 1e9 / 1e9), 4)));
                userBalance(getFlooredFixed(parseFloat(await tokenInst.methods.balanceOf(address).call() / 1e9 / 1e9), 4))
            }catch(error){
                console.log(error)
            }
        }

    }

    const userBalance = (balance) => {
        window.localStorage.setItem('userBalance', balance); //user persisted data
    };

    const chainChangedHandler = () => {
        window.location.reload();
    }

    const connectWalletList = () => {
        // setOpen(true)
        connectWalletHandler(0)
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
                <button 
                className="wallet-btn"
                onClick={handleOpenWallet}
                >
                    {boolIcon ? (
                        []
                    ) : (
                        <AccountBalanceWalletIcon/>
                    )}
                    <span>{`${truncateAddress(account)}`}</span>
                </button>
            </>
            :
            <>
                <button 
                className="wallet-btn" 
                onClick={connectWalletList}
                // ref={anchorRef}
                >
                    
                    {boolIcon ? (
                        []
                    ) : (
                        <AccountBalanceWalletIcon/>
                    )}
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
                            <Chip style={{color: '#fff'}} label={`${truncateAddress(account)}`}/>
                            </>
                        :
                            <>
                            
                            </>
                        }
                        
                    </Grid>
                    <Grid item xs={6}>
                        <Tooltip title="Disconnect">
                            <Button style={{float: 'right'}} onClick={disconnect}>
                                <LogoutIcon/>
                            </Button>
                        </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Modal>
        </div>
    );
}

export default ConnectWalletSwap;