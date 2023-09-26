import { createSlice } from "@reduxjs/toolkit";

export const counterSlise = createSlice({
    name:'counter',
    initialState: {
        value : 1,
    },
    reducer:{
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        }
    }
});

export const { increment, decrement } = counterSlise.actions
export default counterSlise.reducer;