import React from 'react';
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
import { useSelector, useDispatch } from 'react-redux'

function Networks(){
    
    const rpcUrls = {
        Ethereum: 'https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf',
        BNB: 'https://polygon.infura.io',
        Arbitrum: 'https://xdai.infura.io'
    }

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
  
    const options = [
        ['Ethereum','0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
        ['BNB','0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
        ['Arbitrum','0x912CE59144191C1204E64559FE8253a0e49E6548']];
    const optionsIMG = [Eth,BnbChain,Arbitrum];
    const dispatch = useDispatch()
  
    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      dispatch(fetchNetwork(options[index][1]));
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

    const arbitrumFunc = () => {

    }

    const bnbChainFunc = () => {
        
    }

    return (
        <>
        <ButtonGroup variant="outlined" ref={anchorRef} aria-label="split button">
            <Button onClick={handleToggle}><img alt={'Logo'} src={optionsIMG[selectedIndex]} width={30} height={30} />&nbsp;{options[selectedIndex][0]}<ArrowDropDownIcon /></Button>
        </ButtonGroup>
        <Popper
            sx={{
            zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
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
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                        <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        >
                        <img alt={'Logo'} src={optionsIMG[index]} width={30} height={30} />&nbsp;{option[0]}
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