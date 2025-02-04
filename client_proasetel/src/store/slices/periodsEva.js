import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "../index";

const initialState = {
    error: null,
    periodsEva: []
}


const slice = createSlice({
    name: 'periodsEva',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload
        },

        getPeriodsEvaSuccess(state, action){
            state.periodsEva = action.payload
        }

    }
})

// Reducer
export default slice.reducer

export function getPeriodsEva() {
    return async () => {
        try {
            const response = await axios.get('/periodoEva');
            dispatch(slice.actions.getPeriodsEvaSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}