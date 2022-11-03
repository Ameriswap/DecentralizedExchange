import React, { useState, useEffect }  from 'react';
import Web3 from "web3";
import axios from "axios";

const getTokens = () => {
  return axios.get("https://api.1inch.io/v4.0/1/tokens");
};

const Tokens = {
    getTokens,
};

export default Tokens