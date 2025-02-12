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

        addPeriodoEvaSuccess(state, action) {
            state.periodsEva.push(action.payload);
            state.loading = false;
        },

        getPeriodsEvaSuccess(state, action){
            state.periodsEva = action.payload
        },

        updatePeriodoEvaSuccess(state, action) {
            const index = state.periodsEva.findIndex(
            (periodEva) => periodEva.idPeriodoEva === action.payload.idPeriodoEva
            );
            if (index !== -1) {
            state.periodsEva[index] = action.payload;
            }
        },
        // LOADING
        setLoading(state) {
            state.loading = true;
        }

    }
})

// Reducer
export default slice.reducer
const apiUrl = import.meta.env.VITE_APP_API_URL2;


export function createPeriodoEva(periodoEvaData) {
    return async () => {
      try {
        dispatch(slice.actions.setLoading());
        const response = await axios.post(`${apiUrl}/periodoEva`, periodoEvaData);
        dispatch(slice.actions.addPeriodoEvaSuccess(response.data));
        return { success: true, data: response.data };
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        return { success: false, error: error.message };
      }
    };
  }

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

export function updatePeriodoEva(idPeriodoEva, periodoEvaData) {
    return async () => {
      try {
        const response = await axios.patch(
          `${apiUrl}/periodoEva/${idPeriodoEva}`,
          periodoEvaData
        );
        dispatch(slice.actions.updatePeriodoEvaSuccess(response.data));
        return { success: true };
      } catch (error) {
        dispatch(slice.actions.hasError(error.message));
        return { success: false, error: error.message };
      }
    };
  }