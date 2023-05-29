import { createSlice } from '@reduxjs/toolkit'

export const metamaskBalanceReducer = createSlice({
  name: 'balance',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    fetchBalance: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, fetchBalance } = metamaskBalanceReducer.actions

export default metamaskBalanceReducer.reducer