import React, { useState,useEffect }  from 'react';
import { Outlet } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Stack from '@mui/material/Stack';
import CoinMarket from "../api/CoinMarket";
import EastIcon from '@mui/icons-material/East';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Eth from'../images/eth.png';
import BnbChain from'../images/bnbchain.png';
import Arbitrum from'../images/arbitrum.png';
import Wallet from '../api/ConnectWallet';
import Network from '../api/Networks';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

ChartJS.register(ArcElement, Tooltip, Legend);

const pages = ['Swap'];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function Layout2() {
  const [openS, setOpenS] = React.useState(false);
  const [btc, setBTC] = useState('');
  const [eth, setETH] = useState('');
  const [doge, setDOGE] = useState('');
  const [xmr, setXMR] = useState('');
  const [ltc, setLTC] = useState('');
  const [btccp,setBTCCP] = React.useState('')
  const [ethcp,setETHCP] = React.useState('')
  const [dogecp,setDOGECP] = React.useState('')
  const [xmrcp,setXMRCP] = React.useState('')
  const [ltccp,setLTCCP] = React.useState('')
  const [value, setValue] = React.useState(0);
  const userAddress = window.localStorage.getItem('userAccount');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    getPriceMarket()
    // setInterval(function(){
    //   getPriceMarket()
    // }, 2000);
    stickyHeaderScroll()
  }, []);

  const stickyHeaderScroll = () => {
    window.onscroll = () => {myStickyHeader()};

    var header = document.getElementById("myHeader");
    var sticky = header.offsetTop;
    
    const myStickyHeader = () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        header.classList.add("header-wrap")
      } else {
        header.classList.remove("sticky");
        header.classList.remove("header-wrap")
      }
    }
  }

  const btcPrice = (tokens) => {
      return tokens.symbol === 'BTCUSDT';
  }
  
  const ethPrice = (tokens) => {
      return tokens.symbol === 'ETHUSDT';
  }
  
  const dogePrice = (tokens) => {
      return tokens.symbol === 'DOGEUSDT';
  }
  
  const moneroPrice = (tokens) => {
      return tokens.symbol === 'XMRUSDT';
  }
  
  const litecoinPrice = (tokens) => {
      return tokens.symbol === 'LTCUSDT';
  }

  const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const getPriceMarket = async () => {
      try{
          CoinMarket.getCoinPrice().then((response) => {
              const json = response.data;
              const priceDataArr = {
                  BTC: json.find(btcPrice),
                  ETH: json.find(ethPrice),
                  DOGE: json.find(dogePrice),
                  XMR: json.find(moneroPrice),
                  LTC: json.find(litecoinPrice)
              }
              console.log(priceDataArr.ETH)
              setBTC(Number(priceDataArr.BTC.lastPrice))
              setETH(Number(priceDataArr.ETH.lastPrice))
              setDOGE(Number(priceDataArr.DOGE.lastPrice))
              setXMR(Number(priceDataArr.XMR.lastPrice))
              setLTC(Number(priceDataArr.LTC.lastPrice))
              setBTCCP(Number(priceDataArr.BTC.priceChangePercent))
              setETHCP(Number(priceDataArr.ETH.priceChangePercent))
              setDOGECP(Number(priceDataArr.DOGE.priceChangePercent))
              setXMRCP(Number(priceDataArr.XMR.priceChangePercent))
              setLTCCP(Number(priceDataArr.LTC.priceChangePercent))
          });
      }catch(err){
          console.log(err)
      }
  }
  

  const handleClick = () => {
    setOpenS(true);
  };

  const handleCloseS = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenS(false);
  };

  const data = {
    // labels: ['Eth', 'Bitcoin', 'Litecoin', 'Monero', 'Dogecoin'],
    datasets: [
      {
        label: 'PRICE',
        data: [eth, btc, ltc, xmr, doge],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
      <div>
        <div className='container-header' id="swap">
            <header id="myHeader">
              <div className="header-menu" >
                <div class="mobile">
                    <div style={{float: 'left'}}>
                        <img class="logo" onClick={() => window.location.href="/"} width="50" src="image/Logo/Ameriswap_logo.png"/>
                    </div>
                    <div style={{float: 'right'}}>
                        <button 
                        className="btn-wallet portal" 
                        onClick={() => window.open('https://dashboard.ameriswap.exchange','_blank')}
                        >
                          Investor Portal
                        </button>    
                    </div>
                    <Network/>
                </div>
                
                <div class="desktop">
                  <div className='header-logo col-md-3'>
                    <img class="logo" onClick={() => window.location.href="/"} src="image/Logo/AS Logo.png"/>
                  </div>

                  <div className='menu-buttons'>
                    <div style={{float: 'right',marginLeft: '10px'}}>
                        <button 
                        className="btn-wallet portal" 
                        onClick={() => window.open('https://dashboard.ameriswap.exchange','_blank')}
                        >
                          Investor Portal
                        </button>    
                    </div>
                    {userAddress?
                      <Wallet/>
                    :
                     [] 
                    }
                    <Network/>
                  </div>
                </div>
              </div>
            </header>
        </div>
        <Outlet/>
        <footer>
          <div className="container footer-section">
            <div className='row'>
                  <div className='col-md-3'>
                    <h1>Protocols</h1>
                    <ul>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Liquidity Protocol</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Aggregration Protocol</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Limit Order Protocol</a></li>
                    </ul>
                  </div>
                  <div className='col-md-3'>
                    <h1>Governance</h1>
                    <ul>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Ameriswap DAO</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Ameriswap token</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Ameriswap Forum</a></li>
                      {/* <li><a href="https://ameriswap.gitbook.io/whitepaper/" target="_blank">Ameriswap White Paper</a></li> */}
                    </ul>
                  </div>
                  <div className='col-md-3'>
                    <h1>Support</h1>
                    <ul>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Help center</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Press room</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Bug report</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Contacts</a></li>
                    </ul>
                  </div>
                  <div className='col-md-3'>
                    <h1>Developers</h1>
                    <ul>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Documentations</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Github</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Audit</a></li>
                      <li><a href="javascript:;" onClick={() => setOpenS(true)}>Bug bounty</a></li>
                    </ul>
                  </div>                                                      
            </div>
            <div className='row'>
                <div className='col-md-6'>
                  <div className="footer-content-left">
                    <div className='mobile'>
                      <img src="image/Logo/Ameriswap_logo.png"/>
                    </div>
                    <div className='desktop'>
                      <img src="image/Logo/Ameriswaplogo.png"/>
                    </div>
                    <p>We Are Ameriswap - a new social crypto community <br/> offering fun and simple investing for everyone</p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='newsletter'>
                    <h1>Sign up for Early Access & News</h1>
                    <p>Get the latest news and updates</p>
                    <label>Your Email</label><br/>
                    
                    <div class="input-group">
                    <input type="email" className='form-control' />
                      <div class="input-group-append">
                        <TelegramIcon/>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
              <Alert onClose={handleCloseS} severity="warning" sx={{ width: '100%' }}>
                Coming soon...
              </Alert>
            </Snackbar>    
            <div className='row'>
              <div className='col-md-3'>
                <div className="copyright">
                  <span>Ameriswap -  © 2023 All Rights Reserved</span>
                </div>
              </div>
              <div className='col-md-6'>
                  <div className='copyright terms'>
                    <table>
                      <tr>
                        <td><a href="Terms-and-Conditions">Terms and Conditions</a></td>
                        <td><a href="Privacy-Policy">Privacy Policy</a></td>
                        <td><a href="Governance-Rights">Governance Rights</a></td>
                      </tr>
                    </table>
                  </div>
              </div>
              <div className='col-md-3'>
                <div className="footer-content-right">
                  <span onClick={() => window.open('https://www.facebook.com/profile.php?id=100093536700426','_blank')}><FacebookIcon/></span>
                  <span><WhatsAppIcon/></span>
                  <span><TelegramIcon/></span>
                  <span onClick={() => window.open('https://twitter.com/Ameriswap','_blank')}><TwitterIcon/></span>
                  <span><InstagramIcon/></span>
                </div>
              </div>
            </div>
          </div>

        </footer>
      
    </div>

  );
}
export default Layout2;
