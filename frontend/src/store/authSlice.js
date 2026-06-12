import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true  // ← start as true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.loading = false  // ← set false after user loads
        },
        clearUser: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false  // ← set false after clearing
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer