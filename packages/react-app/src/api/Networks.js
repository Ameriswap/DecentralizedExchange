import React, { useState,useEffect }  from 'react';
import {
    fetchNetwork,
} from '../features/network/rpcUrlReducer';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import Eth from'../images/eth.png';
import BnbChain from'../images/bnbchain.png';
import Arbitrum from'../images/arbitrum.png';
import { networkParams } from "../networks";
import { toHex, truncateAddress } from "../utils";
import { useSelector, useDispatch } from 'react-redux'

function Networks(props){
    
    const rpcUrls = {
        Ethereum: 'https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf',
        BNB: 'https://polygon.infura.io',
        Arbitrum: 'https://xdai.infura.io'
    }

    const [openNet, setOpenNet] = React.useState(false);
    const anchorRefNet = React.useRef(null);
    const [selectedIndexNet, setSelectedIndexNet] = React.useState(0);
    const [error, setError] = useState();
  
    const optionsNet = [
        ['Ethereum','0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',1],
        ['BNB','0xB8c77482e45F1F44dE1745F52C74426C631bDD52',56],
        ['Arbitrum','0x912CE59144191C1204E64559FE8253a0e49E6548',42161]];

    const optionsIMGNet = [Eth,BnbChain,Arbitrum];

    const dispatch = useDispatch()
  
    const handleMenuItemClickNet = (event, index) => {
      setSelectedIndexNet(index);
      dispatch(fetchNetwork(optionsNet[index][1]));
      switchNetwork(optionsNet[index][2])
      setOpenNet(false);
    };

    
    const switchNetwork = async (chainID) => {
        let library = props.library;

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

    return (
        <>
        <ButtonGroup variant="outlined" ref={anchorRefNet} aria-label="split button">
            <Button onClick={handleToggleNet}><img alt={'Logo'} src={optionsIMGNet[selectedIndexNet]} width={30} height={30} />&nbsp;{optionsNet[selectedIndexNet][0]}<ArrowDropDownIcon /></Button>
        </ButtonGroup>
        <Popper
            sx={{
            zIndex: 1,
            }}
            open={openNet}
            anchorEl={anchorRefNet.current}
            role={undefined}
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
            <Grow
                {...TransitionProps}
                style={{
                transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
            >
                <Paper>
                <ClickAwayListener onClickAway={handleCloseNet}>
                    <MenuList id="split-button-menu" autoFocusItem>
                    {optionsNet.map((option, index) => (
                        <MenuItem
                        key={option}
                        selected={index === selectedIndexNet}
                        onClick={(event) => handleMenuItemClickNet(event, index)}
                        >
                        <img alt={'Logo'} src={optionsIMGNet[index]} width={30} height={30} />&nbsp;{option[0]}
                        </MenuItem>
                    ))}
                    </MenuList>
                </ClickAwayListener>
                </Paper>
            </Grow>
            )}
        </Popper>

        &nbsp;
        </>
    );

}

export default Networks;