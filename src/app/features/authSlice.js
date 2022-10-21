import {createSlice} from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        value: {
            user: {token: localStorage.getItem("token")},
            isAuthenticated: false,
        },
    },
    reducers: {
        afterAuth: (state, action) => {
            localStorage.setItem('token', action.payload.token);
            state.value = {
                user: {
                    ...action.payload
                },
                isAuthenticated: true,
            };
        },

        update: (state, action) => {
            state.value = {
                user: {
                    ...state.value.user,
                    ...action.payload
                },
                isAuthenticated: true,
            };
        },
        invoke: (state) => {
            localStorage.setItem('token', null);
            state.value = {
                user: {token: null},
                isAuthenticated: false,
            }
        }


    },
})

export const {afterAuth, update, invoke} = authSlice.actions
export default authSlice.reducer