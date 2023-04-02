import React from 'react'
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";


const CoinbaseWallet = new WalletLinkConnector({
    url: `https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf`,
    appName: "Ameriswap Exchange",
    supportedChainIds: [1, 3, 4, 5, 42],
   });
   
   const WalletConnect = new WalletConnectConnector({
    rpcUrl: `https://mainnet.infura.io/v3/c17d58aa246644759e20b6c0647121cf`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
   });
   
   const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
   });

const Wallet = {
    CoinbaseWallet,
    WalletConnect,
    Injected
}

export default Wallet