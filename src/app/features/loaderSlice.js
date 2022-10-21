import { createSlice } from '@reduxjs/toolkit'

export const loaderSlice = createSlice({
    name: 'loader',
    initialState: {
        value: true,
    },
    reducers: {
        display: (state) => {
            state.value = true ;
        },
        hide: (state) => {
            state.value = false
        },
        toggle: (state, action) => {
            state.value = !state.value
        },
        set: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { display, hide, toggle  ,set } = loaderSlice.actions
export default loaderSlice.reducer