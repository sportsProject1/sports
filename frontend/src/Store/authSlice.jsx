import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
    },
    reducers:{
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.token = action.payload;
        },
        logout: state => {
            state.user = null;
            state.token = null;
        }
    }
})

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;