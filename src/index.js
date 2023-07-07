import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout2 from "./pages/Layout2";
import Swap from "./pages/Swap";
import NoPage from "./pages/NoPage";
import Homepage from "./pages/Homepage";
import Terms from "./pages/Terms";
import Governance from "./pages/Governance";
import Privacy from "./pages/Privacy";
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
            <Route path="/" element={<Layout2 />}>
              <Route index element={<Homepage />} />
              <Route path="Terms-and-Conditions" element={<Terms />} />
              <Route path="Privacy-Policy" element={<Privacy />} />
              <Route path="Governance-Rights" element={<Governance />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </Web3ReactProvider>,
  document.getElementById("root"),
);
