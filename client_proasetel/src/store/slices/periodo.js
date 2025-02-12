import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "../index";

const initialState = {
    error: null,
    periodos: []
}


const slice = createSlice({
    name: 'periodo',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload
        },

        getPeriodoSuccess(state, action){
            state.periodos = action.payload
        },

        updatePeriodoSuccess(state, action) {
            const index = state.periodos.findIndex(
            (period) => period.idPeriodo === action.payload.idPeriodo
            );
            if (index !== -1) {
            state.periodos[index] = action.payload;
            }
        },

    }
})

// Reducer
export default slice.reducer;
const apiUrl = import.meta.env.VITE_APP_API_URL2;

// ----------------------
// Actions

export function getPeriodos() {
    return async () => {
        try {
            const response = await axios.get(`${apiUrl}/periodo`);
            dispatch(slice.actions.getPeriodoSuccess(response.data))
            console.log('slice PERIODOS', response)
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}

export function updatePeriodo(idPeriodo, periodoData) {
    return async () => {
      try {
        const response = await axios.patch(
          `${apiUrl}/periodo/${idPeriodo}`,
          periodoData
        );
        dispatch(slice.actions.updatePeriodoSuccess(response.data));
        return { success: true };
      } catch (error) {
        dispatch(slice.actions.hasError(error.message));
        return { success: false, error: error.message };
      }
    };
  }