import { createSlice } from '@reduxjs/toolkit'

export const rpcUrlReducer = createSlice({
  name: 'rpc',
  initialState: {
    value: '0x2AC03BF434db503f6f5F85C3954773731Fc3F056',
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