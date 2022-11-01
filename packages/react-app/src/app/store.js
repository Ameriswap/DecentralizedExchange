import { configureStore } from '@reduxjs/toolkit';
import metamaskBalanceReducer from '../features/balance/metamaskBalanceReducer';

export const store = configureStore({
  reducer: {
    counter: metamaskBalanceReducer,
  },
});