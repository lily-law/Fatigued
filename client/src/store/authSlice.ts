import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const authUserAsync = createAsyncThunk('auth/authUser', async () => (await axios('/api/auth')).data)
export const logoutUserAsync = createAsyncThunk('auth/logoutUser', async () => {
  await axios('/api/auth/logout')
})

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loginMenuOpen: false,
    networkStatus: {
      state: 'idle',
      error: null,
      operation: '',
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    openLoginMenu: (state) => {
      state.loginMenuOpen = true
    },
    closeLoginMenu: (state) => {
      state.loginMenuOpen = false
      state.networkStatus.state = 'idle'
      state.networkStatus.error = null
      state.networkStatus.operation = ''
    },
    setAuthPending: (state) => {
      state.networkStatus.state = 'pending'
      state.networkStatus.error = null
      state.networkStatus.operation = 'authenticating'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUserAsync.fulfilled, (state, action) => {
        if (state.networkStatus.operation === 'authenticating') {
          state.networkStatus.state = 'idle'
          state.user = action.payload
          state.loginMenuOpen = false
          state.networkStatus.operation = ''
        }
      })
      .addCase(authUserAsync.rejected, (state, action) => {
        if (state.networkStatus.operation === 'authenticating') {
          state.networkStatus.state = 'idle'
          state.networkStatus.error = action.error
          state.networkStatus.operation = ''
        }
      })

      .addCase(logoutUserAsync.pending, (state) => {
        state.networkStatus.state = 'pending'
        state.networkStatus.error = null
        state.networkStatus.operation = 'logging out'
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.networkStatus.state = 'idle'
        state.user = null
        state.networkStatus.operation = ''
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.networkStatus.state = 'idle'
        state.networkStatus.error = action.error
        state.networkStatus.operation = ''
      })
  },
})

export const { setUser, openLoginMenu, closeLoginMenu, setAuthPending } = authSlice.actions

export const selectAuthedUser = (state: any) => state.auth.user
export const selectLoginMenuOpen = (state: any) => state.auth.loginMenuOpen
export const selectAuthNetworkStatus = (state: any) => state.auth.networkStatus

export default authSlice.reducer
