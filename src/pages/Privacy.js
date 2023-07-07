import React, { useState,useEffect }  from 'react';
import { Outlet } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Stack from '@mui/material/Stack';
import CoinMarket from "../api/CoinMarket";
import WestIcon from '@mui/icons-material/West';
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
import SwapPage from './Swap';

function Privacy() {
  return (
      <div>
        <div className="bg-amweriswap-pages">
          <div className="bg-amweriswap-section-pages">
            <div className='row section-pages-wrapper'>
            <h1>Privacy Policy</h1>
              <div className="swap-box-page">   
                  <div className='row page-p'>
                  <p>Privacy Policy - Ameriswap</p>
                  <p>Effective Date: 26<sup>th</sup> Dec 2022</p>
                  <p>Thank you for choosing our decentralized crypto exchange Ameriswap. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services. By using the Exchange, you consent to the practices described in this Privacy Policy.</p>
                  <p>Information Collection and Use:</p>
                  <p>1.1 We may collect personal information from you, including but not limited to your name, email address, wallet address, and transaction data.</p>
                  <p>1.2 We use this information to provide, maintain, and improve our services, as well as to communicate with you regarding your transactions and account.</p>
                  <p>Data Security:</p>
                  <p>2.1 We implement reasonable security measures to protect your personal information from unauthorized access, loss, or theft.</p>
                  <p>2.2 However, please note that no data transmission over the internet or electronic storage method can be guaranteed as 100% secure.</p>
                  <p>Information Sharing:</p>
                  <p>3.1 We do not sell, trade, or rent your personal information to third parties for marketing purposes.</p>
                  <p>3.2 We may share your information with trusted service providers who assist us in operating our Exchange and providing services to you.</p>
                  <p>3.3 We may disclose your personal information if required by law or to protect our rights, property, or safety, or the rights, property, or safety of others.</p>
                  <p>Third-Party Links:</p>
                  <p>4.1 Our Exchange may contain links to third-party websites or services that are not owned or controlled by us.</p>
                  <p>4.2 We are not responsible for the privacy practices or content of these third-party websites or services. We encourage you to review their privacy policies.</p>
                  <p>Cookies and Similar Technologies:</p>
                  <p>5.1 We may use cookies and similar technologies to enhance your user experience and collect information about how you interact with our Exchange.</p>
                  <p>5.2 You have the option to disable cookies through your browser settings, but please note that this may affect your ability to use certain features of our Exchange.</p>
                  <p>Data Retention:</p>
                  <p>6.1 We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
                  <p>Children's Privacy:</p>
                  <p>7.1 Our Exchange is not intended for use by individuals under the age of 18.</p>
                  <p>7.2 We do not knowingly collect personal information from individuals under the age of 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete it.</p>
                  <p>Changes to this Privacy Policy:</p>
                  <p>8.1 We reserve the right to modify or update this Privacy Policy at any time. We will notify you of any material changes by posting the updated Privacy Policy on our website or through other communication channels.</p>
                  <p>8.2 It is your responsibility to review the Privacy Policy periodically.</p>
                  <p>Contact Us:</p>
                  <p>9.1 If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us using the contact details provided on our website.</p>
                  <p>Please note that this Privacy Policy is subject to change, and it is your responsibility to review it periodically. By continuing to use our Exchange, you agree to be bound by the updated Privacy Policy.</p>
                  </div>
              </div>   
              <div className='row'>
                  <button className="btn-other-page" onClick={() => window.location.href="/"}>
                      <WestIcon/> Homepage
                  </button>
              </div>  
            </div>
          </div>
        </div>
    </div>
  );
}
export default Privacy;
