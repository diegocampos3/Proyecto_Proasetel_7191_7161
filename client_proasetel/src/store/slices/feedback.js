import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "store";

const initialState ={
    error: null,
    feedback: [],
    verificarUser: null
}

const slice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // ADD FEEDBACK
        addFeedbackSuccess(state, actions) {
            state.feedback = actions.payload
        },

        // VERIFICAR USER

        verificarUserSuccess(state, action){
            state.verificarUser = action.payload
        }


    }
})


export default slice.reducer;


export function addFeedback(feedback){
    return async () => {
        try {
            const response = await axios.post('/feedback', feedback);
            console.log('Imprimiendo desde axios Feedback', response.data)
            dispatch(slice.actions.addFeedbackSuccess(response.data));
            return {success: true}

        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { sucess: false, error: error.message}

        }
    }
}

export function verificarUser(data) {
    return async () => {
        try {
            const response = await axios.post('feedback/verificarUser', data);
            return response.data
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}