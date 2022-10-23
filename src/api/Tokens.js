import React, { useState, useEffect }  from 'react';
import axios from 'axios';

const Tokens = () =>{
    const [token,setToken] = useState();

    const fetchTokens = () => {
        axios.get(`https://api.1inch.io/v4.0/1/tokens`)
        .then(res => {
          console.log(res.data.tokens);
        })
    }

    useEffect(() => {
        fetchTokens();
    }, []);

}

export default Tokens;