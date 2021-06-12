import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const authUsersAsync = createAsyncThunk(
    "auth/authUser",
    async () => (await axios("/api/auth")).data
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loginMenuOpen: false,
        networkStatus: {
            state: 'idle',
            statusCode: 200,
            message: ''
        }
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
        }
    },
    extraReducers: (builder) => { builder
        .addCase(authUsersAsync.pending, (state) => {
            state.networkStatus.state = 'pending'
        })
        .addCase(authUsersAsync.fulfilled, (state, action) => {
            state.networkStatus.state = 'idle'
            state.networkStatus.statusCode = 200
            state.networkStatus.message = 'Authentication successful'
            state.user = action.payload

        })
        .addCase(authUsersAsync.rejected, (state, action) => {
            state.networkStatus.state = 'idle'
            state.networkStatus.statusCode = parseInt(action.error.code)
            state.networkStatus.message = action.error.message
        })
    }
})

export const { setUser, openLoginMenu, closeLoginMenu } = authSlice.actions

export const selectAuthedUser = (state: any) => state.auth.user
export const selectLoginMenuOpen = (state: any) => state.auth.loginMenuOpen

export default authSlice.reducer