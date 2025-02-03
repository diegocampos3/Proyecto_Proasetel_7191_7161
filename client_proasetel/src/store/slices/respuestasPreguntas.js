import { createSlice } from "@reduxjs/toolkit";
import axios from "utils/axios";
import { dispatch } from "../index";

const initialState = {
  error: null,
  respuestas: [],
};

const slice = createSlice({
  name: "respuestasPreguntas",
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getRespuestasSuccess(state, action) {
      state.respuestas = action.payload;
    },
    addRespuestaSuccess(state, action) {
      state.respuestas.push(action.payload);
    },
    updateRespuestaSuccess(state, action) {
      const index = state.respuestas.findIndex(
        (respuesta) => respuesta.idRespuestaPregunta === action.payload.idRespuestaPregunta
      );
      if (index !== -1) {
        state.respuestas[index] = action.payload;
      }
    },
    removeRespuestaSuccess(state, action) {
      state.respuestas = state.respuestas.filter(
        (respuesta) => respuesta.idRespuestaPregunta !== action.payload
      );
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------
const apiUrl = import.meta.env.VITE_APP_API_URL2;

export function getRespuestas() {
  return async () => {
    try {
      const response = await axios.get(`${apiUrl}/respuestas-preguntas`);
      dispatch(slice.actions.getRespuestasSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRespuestaById(idRespuesta) {
  return async () => {
    try {
      const response = await axios.get(`${apiUrl}/respuestas-preguntas/${idRespuesta}`);
      return response.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return null;
    }
  };
}

export function addRespuesta(respuestaData) {
  return async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/respuestas-preguntas`,
        respuestaData
      );
      dispatch(slice.actions.addRespuestaSuccess(response.data));
      return { success: true };
    } catch (error) {
      //console.error("Error en addRespuesta:", error.message);
      const errorMessage = error.response?.data?.message || "Ocurrió un error inesperado";
      dispatch(slice.actions.hasError(error.message));
      return { success: false, error: error.message };
    }
  };
}

export function updateRespuesta(idRespuesta, respuestaData) {
  return async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/respuestas-preguntas/${idRespuesta}`,
        respuestaData
      );
      dispatch(slice.actions.updateRespuestaSuccess(response.data));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      return { success: false, error: error.message };
    }
  };
}

export function removeRespuesta(idRespuesta) {
  return async () => {
    try {
      await axios.delete(`${apiUrl}/respuestas-preguntas/${idRespuesta}`);
      dispatch(slice.actions.removeRespuestaSuccess(idRespuesta));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}