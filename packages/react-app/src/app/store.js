import { configureStore } from '@reduxjs/toolkit';
import metamaskBalanceReducer from '../features/balance/metamaskBalanceReducer';
import rpcUrlReducer from '../features/network/rpcUrlReducer';

export const store = configureStore({
  reducer: {
    counter: metamaskBalanceReducer,
    rpc: rpcUrlReducer
  },
});