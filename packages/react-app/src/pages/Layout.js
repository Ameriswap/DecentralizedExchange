import React from 'react';
import { Outlet } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';

import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Eth from'../images/eth.png';
import BnbChain from'../images/bnbchain.png';
import Arbitrum from'../images/arbitrum.png';
import Wallet from '../api/Metamask';
import Network from '../api/Networks';

const pages = ['Swap'];

function Layout() {

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const options = ['Ethereum','BNB Chain','Arbitrum'];
  const optionsIMG = [Eth,BnbChain,Arbitrum];

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
      <div>
        <div className="bg-amweriswap-content1">
          <div className="header-menu">
            <Wallet/>
          </div>
          <div className="header-content1">
                <div className="content1">
                    <img className="logo" src="image/Logo/Ameriswaplogo.png"/>
                    <h1>LOREM IPSUM DOLOR SIT AMET,CONSETETUR</h1>
                    <h6>LOREM IPSUM DOLOR SIT AMET, CONSETETUR SAIDPSCING ELITR, SED DIAM NONUMY EIRMOD</h6>
                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing eiltr, set diam nonumy eirmod tempor invidunt ut labore et</p>
                </div>
                <div className="content1">
                    <img className="future" src="image/Image/3D/future.png"/>
                </div>
          </div>
        </div>
        <div className="bg-amweriswap-content">
          <div className="bg-amweriswap-section">
            <div className="bg-amweriswap-section-left">
              <div className="swap-box-3">
                <div className="row">
                    <div className="col-md-6">
                      <img className="coin" src="image/Images/Bitcoin.svg.png"/>
                      <label>Bitcoin</label>
                      <h5>$55,544.95</h5>
                      <span className="green">2.5%</span>
                    </div>
                    <div className="col-md-6">
                      <img className="linegraph" src="image/dummy_linegraph_green.png"/>
                    </div>
                </div>
              </div>
              <div className="swap-box-3">
                <div className="row">
                  <div className="col-md-6">
                    <img className="coin" src="image/Images/eth.png"/>
                    <label>Eth</label>
                    <h5>$55,544.95</h5>
                    <span className="red">2.5%</span>
                  </div>
                  <div className="col-md-6">
                    <img className="linegraph" src="image/dummy_linegraph_red.png"/>
                  </div>
              </div>
              </div>
              <div className="swap-box-3">
                <div className="row">
                    <div className="col-md-6">
                      <img className="coin" src="image/Images/dogecoin.svg"/>
                      <label>Bitcoin</label>
                      <h5>$55,544.95</h5>
                      <span className="green">2.5%</span>
                    </div>
                    <div className="col-md-6">
                      <img className="linegraph" src="image/dummy_linegraph_green.png"/>
                    </div>
                </div>
              </div>
              <div className="swap-box-3">
                <div className="row">
                    <div className="col-md-6">
                      <img className="coin" src="image/Images/monero.png"/>
                      <label>Bitcoin</label>
                      <h5>$55,544.95</h5>
                      <span className="green">2.5%</span>
                    </div>
                    <div className="col-md-6">
                      <img className="linegraph" src="image/dummy_linegraph_green.png"/>
                    </div>
                </div>
              </div>
              <div className="swap-box-3">
                <div className="row">
                    <div className="col-md-6">
                      <img className="coin" src="image/Images/litecoin.png"/>
                      <label>Bitcoin</label>
                      <h5>$55,544.95</h5>
                      <span className="red">2.5%</span>
                    </div>
                    <div className="col-md-6">
                      <img className="linegraph" src="image/dummy_linegraph_red.png"/>
                    </div>
                </div>
              </div>
            </div>
            <div className="bg-amweriswap-section-right">
              <h1>Lorem ipsum dolor sit amet ,consetetur</h1>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sad diam voluptua. At vero eos at accusam at justo duo dolores</p>
              <button className="btn-learn-more">
                Learn More <img className="lear" src="image/icons/arrow.svg"/>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content2">
          <Outlet/>
        </div>
        <div className="bg-amweriswap-content4">
          <div className="bg-amweriswap-section4">
            <h1>Lorem Ipsum</h1>
            <div className="swap-box-4">
              <div className="row">
                <div className="col-md-6">
                    <h5>Lorem Ipsum Dolor Sit Amet</h5>
                    <span>$ 10 000 000</span>
                    <p>Lorem ipsum</p>
                </div>
                <div className="col-md-6">
                  <img src="image/Images/buy1.png"/>
                </div>
              </div>
            </div>
            <div className="swap-box-4">
              <div className="row">
                <div className="col-md-6">
                  <h5>Lorem Ipsum Dolor Sit Amet</h5>
                  <span>$ 10 000 000</span>
                  <p>Lorem ipsum</p>
                </div>
                <div className="col-md-6">
                  <img src="image/Images/image2.png"/>
                </div>
              </div>
            </div>
            <div className="swap-box-4">
              <div className="row">
                <div className="col-md-6">
                  <h5>Lorem Ipsum Dolor Sit Amet</h5>
                  <span>$ 10 000 000</span>
                  <p>Lorem ipsum</p>
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
            <span>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam</span>
            <br/>
            <div className="swap-box-5">

            </div>
          </div>
        </div>
        <div className="bg-amweriswap-content6">
          <div className="bg-amweriswap-section6">
            <div className="row">
              <div className="col-md-6">
                <div className="left-section">
                  <h1>COMING SOON</h1>
                  <h2>LOREM IPSUM DOLOR SIT AMET, CONSETETUR</h2>
                  <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet</p>
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
              <p>Ameriswap -  &#169 2023 All Rights Reserved</p>
            </div>
          </div>
        </footer>
      
    </div>

  );
}
export default Layout;
