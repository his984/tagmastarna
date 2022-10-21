import {configureStore} from '@reduxjs/toolkit'
import loaderReducer from './features/loaderSlice'
import authReducer from "./features/authSlice";

export default configureStore({
    reducer: {
        loader: loaderReducer,
        auth: authReducer
    },
})