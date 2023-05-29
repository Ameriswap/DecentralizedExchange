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

function getLibrary(provider) {
  return new Web3Provider(provider);
}

ReactDOM.render(
    <Web3ReactProvider getLibrary={getLibrary}>
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
    </Web3ReactProvider>,
  document.getElementById("root"),
);
