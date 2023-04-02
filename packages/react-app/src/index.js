import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, Mainnet } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Swap from "./pages/Swap";
import NoPage from "./pages/NoPage";
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import './Style.css';


// IMPORTANT, PLEASE READ
// To avoid disruptions in your app, change this to your own Infura project id.
// https://infura.io/register
const INFURA_PROJECT_ID = "529670718fd74cd2a041466303daecd7";
const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
  },
}

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
});
function getLibrary(provider) {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <DAppProvider config={config}>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Swap />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>
      </DAppProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
