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

function Terms() {
  return (
      <div>
        <div className="bg-amweriswap-pages">
          <div className="bg-amweriswap-section-pages">
            <div className='row section-pages-wrapper'>
                <h1>Terms and Conditions</h1>
                <div className="swap-box-page">   
                    <div className='row'>

                    </div>
                    <div className='row page-p'>
                        <div>
                            <p><strong>26<sup>th</sup> Dec 2023</strong></p>
                            <p><strong>Terms and Conditions for</strong><strong> Ameriswap </strong></p>
                            <p><strong>Acceptance of Terms</strong></p>
                            <p>By accessing or using Ameriswap.exchange, you acknowledge and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not access or use the Exchange.</p>
                            <p><strong>Use of the Exchange</strong></p>
                            <p>2.1 Eligibility</p>
                            <p>You must be of legal age and have the necessary legal capacity to use the Exchange. By accessing or using the Exchange, you represent and warrant that you meet these requirements.</p>
                            <p>2.2 User Responsibilities</p>
                            <p>You are solely responsible for maintaining the security and confidentiality of your account credentials and any actions taken using your account. You agree not to share your account information with others and to promptly notify us of any unauthorized use or security breach.</p>
                            <p>2.3 Compliance with Laws</p>
                            <p>You agree to comply with all applicable laws, regulations, and guidelines related to cryptocurrency trading and financial activities in your jurisdiction. It is your responsibility to ensure that your use of the Exchange is legal in your location.</p>
                            <p><strong>Trading and Transactions</strong></p>
                            <p>3.1 Decentralized Nature</p>
                            <p>The Exchange operates as a decentralized platform, allowing peer-to-peer transactions directly between users. We do not have control over user-generated transactions and cannot guarantee the accuracy, legality, or quality of the assets traded on the Exchange.</p>
                            <p>3.2 Smart Contracts</p>
                            <p>Transactions on the Exchange are facilitated through smart contracts deployed on the blockchain. You acknowledge that once a transaction is executed, it is irreversible and cannot be altered or canceled.</p>
                            <p>3.3 Risks</p>
                            <p>Cryptocurrency trading involves significant risks, including but not limited to market volatility, liquidity risks, and technological risks. You understand and accept these risks associated with trading on the Exchange and agree that we shall not be liable for any losses or damages incurred.</p>
                            <p><strong>User Conduct</strong></p>
                            <p>4.1 Prohibited Activities</p>
                            <p>You agree not to engage in any activities that violate these Terms and Conditions, including but not limited to:</p>
                            <p>Engaging in fraudulent or deceptive practices</p>
                            <p>Manipulating market conditions or engaging in insider trading</p>
                            <p>Uploading or transmitting any harmful code, malware, or malicious content</p>
                            <p>Engaging in illegal activities or promoting illegal content</p>
                            <p>4.2 Compliance with Policies</p>
                            <p>You agree to abide by any additional policies, guidelines, or rules provided by the Exchange, including those related to anti-money laundering (AML) and know-your-customer (KYC) procedures.</p>
                            <p><strong>Intellectual Property</strong></p>
                            <p>All intellectual property rights related to the Exchange, including but not limited to trademarks, logos, and software, are owned by us or our licensors. You may not use or reproduce any intellectual property without prior written permission from the respective owner.</p>
                            <p><strong>Disclaimer and Limitation of Liability</strong></p>
                            <p>6.1 No Warranty</p>
                            <p>The Exchange is provided on an "as is" and "as available" basis. We do not make any warranties, express or implied, regarding the functionality, accuracy, or reliability of the Exchange.</p>
                            <p>6.2 Limitation of Liability</p>
                            <p>To the extent permitted by applicable laws, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with your use of the Exchange, even if we have been advised of the possibility of such damages.</p>
                            <p><strong>Modification and Termination</strong></p>
                            <p>We reserve the right to modify or terminate the Exchange, or these Terms and Conditions, at any time without prior notice. Any changes will be effective immediately upon posting on the Exchange.</p>
                            <p><strong>Governing Law and Jurisdiction</strong></p>
                            <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction applicable to the user. Any disputes arising out of or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of the jurisdiction applicable to the user.</p>
                            <p><strong>Severability</strong></p>
                            <p>If any provision of these Terms and Conditions is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
                            <p><strong>Entire Agreement</strong></p>
                            <p>These Terms and Conditions constitute the entire agreement between you and us regarding the Exchange and supersede any prior agreements or understandings.</p>
                            <p>By accessing or using the Exchange, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
                        </div>
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
export default Terms;
