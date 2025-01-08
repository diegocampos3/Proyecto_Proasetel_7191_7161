import { createSlice } from "@reduxjs/toolkit";

// project imports
import axios from 'utils/axios';
import { dispatch } from "../index";
import { func } from "prop-types";

const initialState = {
    error: null,
    departamentos: []
};

const slice = createSlice({
    name: 'departamento',
    initialState,
    reducers:{
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // GET DEPARTAMENTOS
        getDepartamentosSuccess(state, action){
            state.departamentos = action.payload;
        }
    }
});

export default slice.reducer;

// Definición de constante para API de proasetel
const apiUrl = import.meta.env.VITE_APP_API_URL2;

export function getDepartamentos() {
    return async () => {
        try {
            const response = await axios.get(`${apiUrl}/departamentos`);
            dispatch(slice.actions.getDepartamentosSuccess(response.data))
            
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}