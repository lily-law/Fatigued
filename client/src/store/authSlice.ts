import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loginMenuOpen: false
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
    }
})

export const { setUser, openLoginMenu, closeLoginMenu } = authSlice.actions

export const selectAuthedUser = (state: any) => state.auth.user
export const selectLoginMenuOpen = (state: any) => state.auth.loginMenuOpen

export default authSlice.reducer