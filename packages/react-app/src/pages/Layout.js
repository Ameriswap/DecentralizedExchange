import React, { useState,useEffect }  from 'react';
import { Outlet } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Stack from '@mui/material/Stack';
import CoinMarket from "../api/CoinMarket";

import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Eth from'../images/eth.png';
import BnbChain from'../images/bnbchain.png';
import Arbitrum from'../images/arbitrum.png';
import Wallet from '../api/Metamask';
import Network from '../api/Networks';

ChartJS.register(ArcElement, Tooltip, Legend);

const pages = ['Swap'];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Layout() {
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

  useEffect(() => {
    getPriceMarket()
    // setInterval(function(){
    //   getPriceMarket()
    // }, 2000);
  }, []);

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
        <div className="container-fluid bg-amweriswap-content1">
          <div className="header-menu">
            <Wallet/>
          </div>
          <div className="row header-content1">
                <div className="content1 col-md-6">
                    <img className="logo" src="image/Logo/Ameriswaplogo.png"/>
                    <h1>All-in-One Decentralized Finance Platform</h1>
                    <h6>Ameriswap is a trustless decentralized cryptocurrency trading platform.</h6>
                </div>
                <div className="content1-2 col-md-6">
                  <Outlet/>
                </div>
          </div>
        </div>
        <div className="bg-amweriswap-content">
          <div className="bg-amweriswap-section">
            <div className="bg-amweriswap-section-left">           
              <div className="swap-box-3">
                <div className="row">
                    <div className="col-md-12">
                      <img className="coin" src="image/Images/Bitcoin.svg.png"/>&nbsp;
                      <label>Bitcoin</label>
                      <h5>${btc}</h5>
                      {Math.sign(Number(btccp)) === -1?
                        <span className="red">{btccp}%</span>
                      :
                        <span className="green">{btccp}%</span>
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
                      <span className="red">{ethcp}%</span>
                    :
                      <span className="green">{ethcp}%</span>
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
                        <span className="red">{dogecp}%</span>
                      :
                        <span className="green">{dogecp}%</span>
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
                        <span className="red">{xmrcp}%</span>
                      :
                        <span className="green">{xmrcp}%</span>
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
                        <span className="red">{ltccp}%</span>
                      :
                        <span className="green">{ltccp}%</span>
                      }
                    </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-amweriswap-section-right">
              <h1>Never-ending liquidity</h1>
              <p>Ameriswap platform instantly analyzes thousands of quotes and fees across multiple DEXes to provide users with the best rates.</p>
              <button className="btn-learn-more" onClick={handleClick}>
                Learn More <img className="lear" src="image/icons/arrow.svg"/>
              </button>
              <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
                <Alert onClose={handleCloseS} severity="warning" sx={{ width: '100%' }}>
                  Coming soon...
                </Alert>
              </Snackbar>              
            </div> */}
          </div>
        </div>
        <div className="bg-amweriswap-content2">
          <div class="header-content2 row">
            <div className="bg-amweriswap-section-right">
              <h1>Never-ending liquidity</h1>
              <p>Ameriswap platform instantly analyzes thousands of quotes and fees across multiple DEXes to provide users with the best rates.</p>
              <button className="btn-learn-more" onClick={handleClick}>
                Learn More <img className="lear" src="image/icons/arrow.svg"/>
              </button>
              <Snackbar open={openS} autoHideDuration={6000} onClose={handleCloseS}>
                <Alert onClose={handleCloseS} severity="warning" sx={{ width: '100%' }}>
                  Coming soon...
                </Alert>
              </Snackbar>              
            </div>
            <div className="swap-box2">
              <div className='row'>
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
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content4">
          <div className="bg-amweriswap-section4">
            <h1>Swap any amount of tokens at the best rates.</h1>
            <div className="swap-box-4">
              <div className="row">
                <div className="col-md-6">
                    <h5>Transfer</h5>
                    <span>Transfer crypto in multiple blockchain networks.</span>
                </div>
                <div className="col-md-6">
                  <img src="image/Images/buy1.png"/>
                </div>
              </div>
            </div>
            <div className="swap-box-4">
              <div className="row">
                <div className="col-md-6">
                  <h5>Store</h5>
                  <span>Your crypto is protected with the most sophisticated security measures.</span>
                </div>
                <div className="col-md-6">
                  <img src="image/Images/image2.png"/>
                </div>
              </div>
            </div>
            <div className="swap-box-4">
              <div className="row">
                <div className="col-md-6">
                  <h5>Coming Soon! Buy</h5>
                  <span>Buy crypto with your bank card using our partner fiat gateway providers.</span>
                </div>
                <div className="col-md-6">
                  <img className="last_img" src="image/Images/image3.png"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content5">
          <div className="bg-amweriswap-section5">
            <span>Your decentralized finance shield Ameriswap uses sophisticated security measures to protect users’ funds in swaps on other DeFi protocols</span>
            <br/>
            <div className="swap-box-5">
              <div id="overlay">
                <div id="text">COMING SOON</div>          
              </div>              
            </div>                
          </div>
        </div>
        <div className="bg-amweriswap-content6">
          <div className="bg-amweriswap-section6">
            <div className="row">
              <div className="col-md-6">
                <div className="left-section">
                  <h1>COMING SOON</h1>
                  <h1>Ameriswap Earn</h1>
                  <h2>A derivative-based product offering liquidity providers attractive APYs.</h2>
                  <p></p>
                  <img className="appstore" src="image/dummy_appstore.png"/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="right-section">
                  <img className="phone" src="image/Images/phone.png"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <div className="footer-section">
            <div className="footer-content-left">
              <img src="image/Logo/Ameriswaplogo.png"/>
              <p>We Are Ameriswap - a new social crypto community <br/> offering fun and simple investing for everyone</p>
            </div>
            <div className="footer-content-right">
              <h6>Subscribe Now</h6>
              <p>Get the latest news and updates</p>
              <input type="text" placeholder="Email Address" className="form-control" />
              <img className="socmed" src="image/dummy_socmed.png"/>
            </div>
            <div className="copyright">
              <p>Ameriswap -  © 2023 All Rights Reserved</p>
            </div>
          </div>
        </footer>
      
    </div>

  );
}
export default Layout;
