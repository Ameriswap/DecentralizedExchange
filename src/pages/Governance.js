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

function Governance() {
  return (
      <div>
        <div className="bg-amweriswap-pages">
          <div className="bg-amweriswap-section-pages">
            <div className='row section-pages-wrapper'>
                <h1>Governance Rights</h1>
               
                <div className="swap-box-page">   
                    <div className='row'>

                    </div>
                    <div className='row page-p'>
                        <div>
                        <p><strong>Governance and Decision-Making Process</strong></p>
                        <p>&nbsp;</p>
                        <p>At Ameriswap, we believe in the power of community participation and decentralized decision-making. Upon the listing of the Ameriswap exchange, token holders will be granted governance rights, enabling them to actively contribute to the platform's development and shape its future.</p>
                        <p>&nbsp;</p>
                        <p><strong>Governance Rights Overview:</strong></p>
                        <p>&nbsp;</p>
                        <p><strong>Voting:</strong></p>
                        <p>Token holders will have the opportunity to participate in voting processes on various platform matters, including protocol upgrades, parameter adjustments, and policy changes. Each token holder's voting power will be proportional to their token holdings, ensuring a fair and democratic decision-making process.</p>
                        <p><strong>&nbsp;</strong></p>
                        <p><strong>Proposals:</strong></p>
                        <p>Our governance model encourages active participation by allowing token holders to submit proposals for consideration by the community. Whether it's suggesting new features, proposing improvements to existing protocols, or proposing changes to platform rules, token holders will have a voice in shaping the evolution of Ameriswap.</p>
                        <p>&nbsp;</p>
                        <p><strong>Staking and Delegated Voting:</strong></p>
                        <p>To enhance participation and encourage long-term commitment, token holders may have the option to stake their tokens or delegate their voting power to representatives who can vote on their behalf. This ensures that even holders who are unable to actively participate in voting can still have their interests represented.</p>
                        <p>&nbsp;</p>
                        <p><strong>Community Fund Allocation:</strong></p>
                        <p>As part of our commitment to the sustainable growth of the Ameriswap ecosystem, token holders will have the opportunity to propose and vote on the allocation of funds from the community treasury. This enables the community to collectively decide on initiatives such as ecosystem development, grants, marketing efforts, and research projects.</p>
                        <p><strong>&nbsp;</strong></p>
                        <p><strong>Protocol Amendments:</strong></p>
                        <p>We believe in the importance of adaptability and continuous improvement. Token holders will have the ability to propose and vote on amendments to the Ameriswap protocol, ensuring that it remains flexible and responsive to the evolving needs of the community.</p>
                        <p>&nbsp;</p>
                        <p>Through these governance rights, we aim to foster a vibrant and engaged community where every token holder has a say in the future of Ameriswap. We recognize that decentralized decision-making leads to more robust, inclusive, and innovative outcomes, and we invite our token holders to actively participate and contribute to the growth and success of the platform.</p>
                        <p>&nbsp;</p>
                        <p>Please note that the granting of governance rights will occur upon the listing of the Ameriswap exchange. We are committed to transparency and ensuring that our governance processes align with the interests of our community. Further details regarding the specific governance mechanisms and voting procedures will be outlined in our governance documentation and communicated to our token holders in a timely manner.</p>
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
export default Governance;
