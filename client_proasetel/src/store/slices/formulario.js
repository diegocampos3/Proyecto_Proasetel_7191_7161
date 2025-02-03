// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

import {  useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  formularios: []
};

const slice = createSlice({
  name: "formulario",
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    getFormulariosSuccess(state, action) {
      state.formularios = action.payload;
    },

    // ADD ADDRESS
    addFormularioSuccess(state, action) {
      state.formularios.push(action.payload);
    },

    // EDIT ADDRESS
    updateFormularioSuccess(state, action) {
      const index = state.formularios.findIndex(
        (form) => form.id === action.payload.id
      );
      if (index !== -1) {
        state.formularios[index] = action.payload;
      }
    },

    // DELETE ADDRESS
    removeFormularioSuccess(state, action) {
      state.formularios = state.formularios.filter(
        (form) => form.id !== action.payload
      );
    }
  }
});

// Reducer
export default slice.reducer;

const apiUrl = import.meta.env.VITE_APP_API_URL2;

// ----------------------
// Actions

export function getFormularios() {
  return async () => {
    try {
      const response = await axios.get(`${apiUrl}/formulario`);
      dispatch(slice.actions.getFormulariosSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const useAddFormulario = () => {
    const queryClient = useQueryClient();
  
    return async (createFormularioDto) => {
      try {
        const response = await axios.post(
          `${apiUrl}/formulario`,
          createFormularioDto
        );
  
        // Invalidar consultas para mantener la lista actualizada
        queryClient.invalidateQueries({ queryKey: ['formularios_listado'] });
  
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    };
};

export const useUpdateFormulario = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
  
    return async (formularioId, updateFormularioDto) => {
      try {
        const response = await axios.patch(
          `${apiUrl}/formulario/${formularioId}`,
          updateFormularioDto
        );
  
        dispatch(slice.actions.updateFormularioSuccess(response.data));
  
        // Invalidar consultas para mantener la lista actualizada
        queryClient.invalidateQueries({ queryKey: ['formularios_listado'] });
  
        return { success: true };
      } catch (error) {
        dispatch(slice.actions.hasError(error));
        return { success: false, error: error.message };
      }
    };
};

export const useRemoveFormulario = () => {
    const queryClient = useQueryClient();
  
    return async (formularioId) => {
      try {
        await axios.delete(`${apiUrl}/formulario/${formularioId}`);  

        // Invalidar consultas para mantener la lista actualizada
        queryClient.invalidateQueries({ queryKey: ['formularios_listado'] });
  
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    };
};
