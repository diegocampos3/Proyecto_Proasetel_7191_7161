// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  resultados: [],
  loading: false
};

const slice = createSlice({
  name: "resultadoEvaluacion",
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    // GET RESULTADOS
    getResultadosSuccess(state, action) {
      state.resultados = action.payload;
      state.loading = false;
    },

    // ADD RESULTADO
    addResultadoSuccess(state, action) {
      state.resultados.push(action.payload);
      state.loading = false;
    },

    // UPDATE RESULTADO
    updateResultadoSuccess(state, action) {
      const index = state.resultados.findIndex(
        (resultado) => resultado.idResultadoEvaluacion === action.payload.idResultadoEvaluacion
      );
      if (index !== -1) {
        state.resultados[index] = action.payload;
      }
      state.loading = false;
    },

    // DELETE RESULTADO
    removeResultadoSuccess(state, action) {
      state.resultados = state.resultados.filter(
        (resultado) => resultado.idResultadoEvaluacion !== action.payload
      );
      state.loading = false;
    },

    // LOADING
    setLoading(state) {
      state.loading = true;
    }
  }
});

// Reducer
export default slice.reducer;

const apiUrl = import.meta.env.VITE_APP_API_URL2;

// ----------------------
// Actions

export function createResultadoEvaluacion(resultadoData) {
  return async () => {
    try {
      dispatch(slice.actions.setLoading());
      const response = await axios.post(`${apiUrl}/resultado-evaluacion`, resultadoData);
      dispatch(slice.actions.addResultadoSuccess(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}

export function getResultadosEvaluacion() {
  return async () => {
    try {
      dispatch(slice.actions.setLoading());
      const response = await axios.get(`${apiUrl}/resultado-evaluacion`);
      dispatch(slice.actions.getResultadosSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateResultadoEvaluacion(id, updateData) {
  return async () => {
    try {
      dispatch(slice.actions.setLoading());
      const response = await axios.patch(`${apiUrl}/resultado-evaluacion/${id}`, updateData);
      dispatch(slice.actions.updateResultadoSuccess(response.data));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}

export function deleteResultadoEvaluacion(id) {
  return async () => {
    try {
      dispatch(slice.actions.setLoading());
      await axios.delete(`${apiUrl}/resultado-evaluacion/${id}`);
      dispatch(slice.actions.removeResultadoSuccess(id));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}

// React Query Hooks
export const useCreateResultadoEvaluacion = () => {
  const queryClient = useQueryClient();

  return async (createDto) => {
    try {
      const response = await axios.post(`${apiUrl}/resultado-evaluacion`, createDto);
      queryClient.invalidateQueries({ queryKey: ['resultados_evaluacion'] });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};

export const useBulkCreateResultados = () => {
  const queryClient = useQueryClient();

  return async (resultadosArray) => {
    try {
      const promises = resultadosArray.map(resultado => 
        axios.post(`${apiUrl}/resultado-evaluacion`, resultado)
      );
      
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['resultados_evaluacion'] });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};