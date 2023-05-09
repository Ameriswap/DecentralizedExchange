import { createSlice } from '@reduxjs/toolkit'

export const rpcUrlReducer = createSlice({
  name: 'rpc',
  initialState: {
    value: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  reducers: {
    fetchNetwork: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { fetchNetwork } = rpcUrlReducer.actions

export default rpcUrlReducer.reducer