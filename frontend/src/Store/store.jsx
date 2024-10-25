import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        // 여기에 리듀서 추가
    },
});

export default store;