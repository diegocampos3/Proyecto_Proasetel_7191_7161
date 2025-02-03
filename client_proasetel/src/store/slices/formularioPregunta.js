import { createSlice } from "@reduxjs/toolkit";
import axios from "utils/axios";
import { dispatch } from "../index";

const initialState = {
  error: null,
  preguntas: [],
};

const slice = createSlice({
  name: "formularioPregunta",
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getPreguntasSuccess(state, action) {
      state.preguntas = action.payload;
    },
    addPreguntaSuccess(state, action) {
      state.preguntas.push(action.payload);
    },
    updatePreguntaSuccess(state, action) {
      const index = state.preguntas.findIndex(
        (pregunta) => pregunta.idPregunta === action.payload.idPregunta
      );
      if (index !== -1) {
        state.preguntas[index] = action.payload;
      }
      //state.preguntas = action.payload
    },
    removePreguntaSuccess(state, action) {
      state.preguntas = state.preguntas.filter(
        (pregunta) => pregunta.idPregunta !== action.payload
      );
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------

const apiUrl = import.meta.env.VITE_APP_API_URL2;

//para sacar la informacion de una sola pregunta, enviando el idPregunta
// export function getPreguntas() {
//   return async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/formulario-preguntas`);
//       dispatch(slice.actions.getPreguntasSuccess(response.data));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

export function getPreguntasByFormulario(idFormulario) {
    return async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/formulario-preguntas/${idFormulario}`
        );
        dispatch(slice.actions.getPreguntasSuccess(response.data));
      } catch (error) {
        console.log('error', error);
        dispatch(slice.actions.hasError(error));
      }
    };
}

export function addPregunta(pregunta) {
  return async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/formulario-preguntas`,
        pregunta
      );
      dispatch(slice.actions.addPreguntaSuccess(response.data));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}

export function updatePregunta(preguntaId, pregunta) {
  return async () => {
    try {
      const response = await axios.patch(
        `${apiUrl}/formulario-preguntas/${preguntaId}`,
        pregunta
      );
      dispatch(slice.actions.updatePreguntaSuccess(response.data));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}

export function removePregunta(preguntaId) {
  return async () => {
    try {
      await axios.delete(`${apiUrl}/formulario-preguntas/${preguntaId}`);
      dispatch(slice.actions.removePreguntaSuccess(preguntaId));
      return { success: true };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return { success: false, error: error.message };
    }
  };
}
