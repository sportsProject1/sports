import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemTypeReducer from './ItemTypeSlice'
const store = configureStore({
    reducer: {
        auth: authReducer,
        itemType: itemTypeReducer,
        // 여기에 리듀서 추가
    },
});

export default store;