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
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SwapPage from './Swap';

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


function Homepage() {
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
        <div className="bg-amweriswap-content1">
            <div className="header-content1 animatable bounceIn">
                <div class="desktop">
                    <div class="content1 col-md-6">
                        
                        <h1>All-in-One Decentralized Finance</h1>
                        <h2>Ameriswap is a trustless decentralized cryptocurrency trading platform.</h2>
                    </div>
                </div>
                <div className="content1-2 col-md-6">
                    <SwapPage/>
                </div>
                <div class="mobile">
                    <div class="content1 col-md-6">
                        <h1>All-in-One Decentralized Finance</h1>
                        <h2>Ameriswap is a trustless decentralized cryptocurrency trading platform.</h2>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-amweriswap-content">
          <div id='swap-wrap' className="bg-amweriswap-section">
            <div className="swapbox-3-desktop">
              <div className="bg-amweriswap-section-left">           
                <div className="swap-box-3">
                  <div className="row">
                      <div className="col-md-12">
                        <img className="coin" src="image/Images/Bitcoin.svg.png"/>&nbsp;
                        <label>Bitcoin</label>
                        <h5>${btc}</h5>
                        {Math.sign(Number(btccp)) === -1?
                          <span className="red"><KeyboardDoubleArrowDownIcon/>{btccp}%</span>
                        :
                          <span className="green"><KeyboardDoubleArrowUpIcon/>{btccp}%</span>
                        }
                      </div>
                  </div>
                </div>
                <div className="swap-box-3">
                  <div className="row">
                    <div className="col-md-12">
                      <img className="coin" src="image/Images/eth.png"/>&nbsp;
                      <label>Eth</label>
                      <h5>${eth}</h5>
                      {Math.sign(Number(ethcp)) === -1?
                        <span className="red"><KeyboardDoubleArrowDownIcon/>{ethcp}%</span>
                      :
                        <span className="green"><KeyboardDoubleArrowUpIcon/>{ethcp}%</span>
                      }
                    </div>
                </div>
                </div>
                <div className="swap-box-3">
                  <div className="row">
                      <div className="col-md-12">
                        <img className="coin" src="image/Images/dogecoin.svg"/>&nbsp;
                        <label>Dogecoin</label>
                        <h5>${doge}</h5>
                        {Math.sign(Number(dogecp)) === -1?
                          <span className="red"><KeyboardDoubleArrowDownIcon/>{dogecp}%</span>
                        :
                          <span className="green"><KeyboardDoubleArrowUpIcon/>{dogecp}%</span>
                        }
                      </div>
                  </div>
                </div>
                <div className="swap-box-3">
                  <div className="row">
                      <div className="col-md-12">
                        <img className="coin" src="image/Images/monero.png"/>&nbsp;
                        <label>Monero </label>
                        <h5>${xmr}</h5>
                        {Math.sign(Number(xmrcp)) === -1?
                          <span className="red"><KeyboardDoubleArrowDownIcon/>{xmrcp}%</span>
                        :
                          <span className="green"><KeyboardDoubleArrowUpIcon/>{xmrcp}%</span>
                        }
                      </div>
                  </div>
                </div>
                <div className="swap-box-3">
                  <div className="row">
                      <div className="col-md-12">
                        <img className="coin" src="image/Images/litecoin.png"/>&nbsp;
                        <label>Litecoin</label>
                        <h5>${ltc}</h5>
                        {Math.sign(Number(ltccp)) === -1?
                          <span className="red"><KeyboardDoubleArrowDownIcon/>{ltccp}%</span>
                        :
                          <span className="green"><KeyboardDoubleArrowUpIcon/>{ltccp}%</span>
                        }
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile */}

            <div className="swapbox-3-mobile-wapper">
              <div className="col-sm-12 swapbox-3-mobile">
                <div className="crypto-coin">
                  <img className="coin" src="image/Images/Bitcoin.svg.png"/>&nbsp;
                  <label>Bitcoin</label>
                </div>
                <h5>${btc}</h5>
                {Math.sign(Number(btccp)) === -1?
                  <span className="red"><KeyboardDoubleArrowDownIcon/>{btccp}%</span>
                :
                  <span className="green"><KeyboardDoubleArrowUpIcon/>{btccp}%</span>
                }
              </div>

              <div className="col-sm-12 swapbox-3-mobile">
                <div className="crypto-coin">
                  <img className="coin" src="image/Images/eth.png"/>&nbsp;
                  <label>Eth</label>
                </div>
                <h5>${eth}</h5>
                {Math.sign(Number(ethcp)) === -1?
                  <span className="red"><KeyboardDoubleArrowDownIcon/>{ethcp}%</span>
                :
                  <span className="green"><KeyboardDoubleArrowUpIcon/>{ethcp}%</span>
                }
              </div>

              <div className="col-sm-12 swapbox-3-mobile">
                <div className="crypto-coin">
                  <img className="coin" src="image/Images/dogecoin.svg"/>&nbsp;
                  <label>Dogecoin</label>
                </div>
                <h5>${doge}</h5>
                {Math.sign(Number(dogecp)) === -1?
                  <span className="red"><KeyboardDoubleArrowDownIcon/>{dogecp}%</span>
                :
                  <span className="green"><KeyboardDoubleArrowUpIcon/>{dogecp}%</span>
                }
              </div>

              <div className="col-sm-12 swapbox-3-mobile">
                <div className="crypto-coin">
                  <img className="coin" src="image/Images/monero.png"/>&nbsp;
                  <label>Monero </label>
                </div>
                <h5>${xmr}</h5>
                {Math.sign(Number(xmrcp)) === -1?
                  <span className="red"><KeyboardDoubleArrowDownIcon/>{xmrcp}%</span>
                :
                  <span className="green"><KeyboardDoubleArrowUpIcon/>{xmrcp}%</span>
                }
              </div>

              <div className="col-sm-12 swapbox-3-mobile">
                <div className="crypto-coin">
                  <img className="coin" src="image/Images/litecoin.png"/>&nbsp;
                  <label>Litecoin</label>
                </div>
                <h5>${ltc}</h5>
                {Math.sign(Number(ltccp)) === -1?
                  <span className="red"><KeyboardDoubleArrowDownIcon/>{ltccp}%</span>
                :
                  <span className="green"><KeyboardDoubleArrowUpIcon/>{ltccp}%</span>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content-networks">
          <div className="networks">
            <div className="bg-amweriswap-section-left">           
              <div className='row'>
                <h1>Optimize your trades across hundreds of DEXes on multiple networks </h1>
              </div>
              <div className='row'>
                  <div className='network-box'>
                      <div className='container-img'>
                          <img src="image/Networks/eth.png"/>
                        </div>
                        <div class="caption">
                          <p>Ethereum</p>
                        </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/polygon.png"/>
                      </div>
                      <div class="caption">
                        <p>Polygon</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/gnosis.png"/>
                      </div>
                      <div class="caption">
                        <p>Gnosis</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/arbitrum.png"/>
                      </div>
                      <div class="caption">
                        <p>Arbitrum</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/klaytn.png"/>
                      </div>
                      <div class="caption">
                        <p>Klaytn</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/zksync.png"/>
                      </div>
                      <div class="caption">
                        <p>zkSync</p>
                      </div>
                    </div>
                  </div>
              </div>
              <div className='row'>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/bnbchain.png"/>
                      </div>
                      <div class="caption">
                        <p>BNB Chain</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/op.png"/>
                      </div>
                      <div class="caption">
                        <p>Optimism</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/avalanche.png"/>
                      </div>
                      <div class="caption">
                        <p>Avalanche</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/fantom.png"/>
                      </div>
                      <div class="caption">
                        <p>Fantom</p>
                      </div>
                    </div>
                  </div>
                  <div className='network-box'>
                    <div className='network-wrapper'>
                        <div className='overlay'>
                          
                        </div>
                        <span className='overlay-text'>COMING SOON</span>
                      <div className='container-img'>
                        <img src="image/Networks/aurora.png"/>
                      </div>
                      <div class="caption">
                        <p>Aurora</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content2">
          <div class="header-content2 row">
            <div className="bg-amweriswap-section-right">
              <div className='row'>
                <h1>Never-ending liquidity</h1>
                <p>Ameriswap platform instantly analyzes thousands of quotes and fees across multiple DEXes to provide users with the best rates.</p>
              </div>
              <div className='row'>
                <a href="#swap">
                  <button className="btn-learn-more">
                    Swap Now <EastIcon/>
                  </button>
                </a>
              </div>
              <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
                <Alert onClose={handleCloseS} severity="warning" sx={{ width: '100%' }}>
                  Coming soon...
                </Alert>
              </Snackbar>              
            </div>
            <div className="swap-box2">
              <div id="overlay">
                  {/* <div className='row'>
                  <div className='col-md-6'>
                    <h1>PORTFOLIO</h1>
                    <Doughnut data={data} />   
                  </div>
                  <div className='col-md-6'>
                    <ul>
                      <li>
                        <div style={{float:'left',marginLeft:'5px'}}>
                          Bitcoin
                        </div>
                        <div style={{float:'right'}}>
                          {((btc/btc)*100)}%
                        </div>
                      </li>
                      <li>
                        <div style={{float:'left',marginLeft:'5px'}}>
                          Ethereum
                        </div>
                        <div style={{float:'right'}}>
                          {((eth/btc)*100).toFixed(1)}%
                        </div>
                      </li>
                      <li>
                        <div style={{float:'left',marginLeft:'5px'}}>
                          Dogecoin
                        </div>
                        <div style={{float:'right'}}>
                          {((doge/btc)*100).toFixed(1)}%
                        </div>
                      </li>
                      <li>
                        <div style={{float:'left',marginLeft:'5px'}}>
                          Monero
                        </div>
                        <div style={{float:'right'}}>
                          {((xmr/btc)*100).toFixed(1)}%
                        </div>
                      </li>
                      <li>
                        <div style={{float:'left',marginLeft:'5px'}}>
                          Litecoin
                        </div>
                        <div style={{float:'right'}}>
                          {((ltc/btc)*100).toFixed(1)}%
                        </div>
                      </li>
                    </ul>
                  </div>
                  </div>
                  */}
                <div id="text">COMING SOON</div>          
              </div>
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content">
          <div className="bg-amweriswap-section-defi">
            <div className="bg-amweriswap-section-left">           
              <Box sx={{ width: '100%' }}>
                  <div className='row'>
                    <div className='col-lg-6 col-md-12'>
                      <TabPanel value={value} index={0}>
                        <img src="image/Images/img-wallet.png"/>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <img src="image/Images/img-security.png"/>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <img src="image/Images/img-transfer.png"/>
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        <img src="image/Images/img-swap.png"/>
                      </TabPanel>
                      <TabPanel value={value} index={4}>
                        <img src="image/Images/img-stake.png"/>
                      </TabPanel>
                    </div>
                    <div className='col-lg-6 col-md-12'>
                      <h1>Ameriswap DeFi Wallet</h1>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Buy" {...a11yProps(0)} />
                          <Tab label="Store" {...a11yProps(1)} />
                          <Tab label="Transfer" {...a11yProps(2)} />
                          <Tab label="Swap" {...a11yProps(3)} />
                          <Tab label="Stake" {...a11yProps(4)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0}>
                        <span>Buy crypto with your bank card using our partner fiat gateway providers.</span>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <span>Your crypto is protected with the most sophisticated security measures.</span>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <span>Transfer crypto in multiple blockchain networks.</span>
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        <span>Swap any amount of tokens at the best rates.</span>
                      </TabPanel>
                      <TabPanel value={value} index={4}>
                        <span>Stake AmeriSwap to participate in network governance and be eligible for gas costs refunds.</span>
                      </TabPanel>
                      <button className="btn-learn-more-defi" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
              </Box>
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content-fusion">
          <div className="bg-amweriswap-section-defi">
            <div className='row'>
              <div className="swap-box-fusion">   
                  <div className='row'>
                    <h1>AmeriSwap Fusion</h1>
                  </div>
                  <div className='fusion-p'>
                    <p>The Fusion upgrade makes swaps on AmeriSwap yet more efficient and secure, combining liquidity from the entire crypto market in one place.</p>
                  </div>
                  <div className='btn-fusion'>
                    <button className="btn-learn-more-fusion" onClick={() => setOpenS(true)}>
                      Learn More<EastIcon/>
                    </button>
                  </div>
              </div>     
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content-products">
          <div className="bg-amweriswap-section-defi">
              <h1>AmeriSwap Products</h1>
              <div className='row'>
                  <div className='products'>
                    <div className='row'>
                      <h3>Aggregation Protocol</h3>
                      <p>Liquidity aggregation from multiple DEXes to ensure the best swap rates.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/aggregation-protocol.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
                  <div className='products'>
                    <div className='row'>
                      <h3>Limit Order Protocol</h3>
                      <p>The most innovative and flexible limit order functionality in DeFi.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/limit-order-protocol.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
                  <div className='products'>
                    <div className='row'>
                      <h3>Liquidity Protocol</h3>
                      <p>A next-generation AMM that offers capital efficiency to liquidity providers.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/liquidity-protocol.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
                  <div className='products'>
                    <div className='row'>
                      <h3>AmeriSwap RabbitHole</h3>
                      <p>A feature that protects MetaMask users from sandwich attacks.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/rabbithole.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="bg-amweriswap-content-products">
          <div className="bg-amweriswap-section-defi">
              <h1>Grow with our ecosystem</h1>
              <span>Build solutions alongside decentralized finance leaders</span>
              <div className='row'>
                  <div className='products'>
                    <div className='row'>
                      <h3>Ameriswap API</h3>
                      <p>A cutting-edge discovery and routing algorithm that offers non-custodial asset swaps at the most attractive rates in major DeFi ecosystems.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/api.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
                  <div className='products'>
                    <div className='row'>
                      <h3>Ameriswap grant program</h3>
                      <p>An initiative that fosters the Ameriswap Network's growth and incentivizes contributions through grants and other resources.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/grant-program.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="bg-amweriswap-content-sheild">
          <div className="bg-amweriswap-section-defi-sheild">
              <h1>Your decentralized finance shield </h1>
              <p>Ameriswap uses sophisticated security measures to protect users' funds in swaps on other DeFi protocols</p>
              <div className='row'>
                  <div className='sheild'>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/shield.png" />
                    </div>
                    <div className='row'>
                      <p>Ameriswap is the most audited project in DeFi. See a list of the most important smart contract audits here.</p>
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more-sheild" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="bg-amweriswap-content-products">
          <div className="bg-amweriswap-section-defi">
              <h1>Empowered by the community</h1>
              <div className='row'>
                  <div className='products'>
                    <div className='row'>
                      <h3>Ameriswap DAO</h3>
                      <p>A governance tool that enables AmeriSwap stakers to vote for key protocol parameters.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/dao.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
                  <div className='products'>
                    <div className='row'>
                      <h3>Ameriswap token</h3>
                      <p>A token that facilitates Ameriswap protocol governance and participation in the network's evolution.</p>
                    </div>
                    <div className='row'>
                      <img src="https://1inch.io/img/main/token.png" />
                    </div>
                    <div className='row'>
                      <button className="btn-learn-more" onClick={() => setOpenS(true)}>
                        Learn More<EastIcon/>
                      </button>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="bg-amweriswap-content4">
          <div className="bg-amweriswap-section4">
            <div className='row'>
              <h1>Swap any amount of tokens at the best rates.</h1>
              <div className="swap-box-4">
                <div className="row">
                  <div className="col-md-6">
                      <h5>Transfer</h5>
                      <br></br>
                      <span>Transfer crypto in multiple blockchain networks.</span>
                  </div>
                  <div className="col-md-6 container-img">
                    <img src="image/Images/img-transfer.png"/>
                  </div>
                </div>
              </div>
              <div className="swap-box-4">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Store</h5>
                    <br></br>
                    <span>Your crypto is protected with the most sophisticated security measures.</span>
                  </div>
                  <div className="col-md-6 container-img">
                    <img src="image/Images/img-security.png"/>
                  </div>
                </div>
              </div>
              <div className="swap-box-4">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Coming Soon! Buy</h5>
                    <br></br>
                    <span>Buy crypto with your bank card using our partner fiat gateway providers.</span>
                  </div>
                  <div className="col-md-6 container-img">
                    <img className="last_img" src="image/Images/img-wallet.png"/>
                  </div>
                </div>
              </div>
              </div>
          </div>
        </div>
        <div className="bg-amweriswap-content5">
          <div className="bg-amweriswap-section5">
            <div className='row'>
              <span>Your decentralized finance shield Ameriswap uses sophisticated security measures to protect users’ funds in swaps on other DeFi protocols</span>
              <br/>
              <div className="swap-box-5">
                <div id="overlay">
                  <div id="text">COMING SOON</div>          
                </div>              
              </div>  
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content6">
          <div className="bg-amweriswap-section6">
            <div className="row">
              <div className="col-md-6">
                <div className="left-section">
                  <h1 style={{color: '#929292'}}>COMING SOON</h1>
                  <h1>Ameriswap Earn</h1>
                  <h6>A derivative-based product offering liquidity providers attractive APYs.</h6>
                  <p></p>
                  <img className="appstore" src="image/dummy_appstore.png"/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="right-section">
                  <img className="phone" src="image/Images/img-1.png"/>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
export default Homepage;
