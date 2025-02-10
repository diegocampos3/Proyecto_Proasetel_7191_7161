import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "store";

const initialState ={
    error: null,
    feedback: [],
    verificarUser: null,
    satisfaction: {},
    satisfactionDepart: {}
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
            state.feedback = actions .payload
        },

        // VERIFICAR USER

        verificarUserSuccess(state, action){
            state.verificarUser = action.payload
        },

        // GET SATISFACTION
        getSatisfactionSuccess(state, action){
            state.satisfaction = action.payload
        },

        getSatisfactionDepartSucces(state, action){
            state.satisfactionDepart = action.payload
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


export function getSatisfaction(){
    return async () => {
        try {
            const response = await axios.get('analisis-sentimientos/satisfaction-data');
            console.log('Analisis sentimientos data_axios:', response.data)
            dispatch(slice.actions.getSatisfactionSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}

export function getSatisfactionDepart(idDepart) {
    return async () => {
        try {
            const response = await axios.get(`analisis-sentimientos/satisfaction-data-depart/${idDepart}`);
            console.log('Imprimiendo satisfaccion desde Context:', response.data)
            dispatch(slice.actions.getSatisfactionDepartSucces(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }

}