import { createSlice } from "@reduxjs/toolkit";

// project import 
import axios from 'utils/axios';
import { dispatch } from "../index";


const initialState = {
    error: null,
    personal: [],
};

const slice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // GET PERSONAL
        getPersonalSuccess(state, action){
            state.personal = action.payload
        },

        // UPDATE PERSONAL
        updatePersonalSuccess(state, action) {
            const updatedUser = action.payload; // Este es el usuario actualizado que viene de response.data
            state.personal = state.personal.map((user) =>
                user.id === updatedUser.id ? updatedUser : user // Reemplaza solo el usuario correcto
            );
        }
    }
});

// Reducer
export default slice.reducer;


export function getPersonal() {
    return async () => {
        try {
            const response = await axios.get(`/auth`);
            dispatch(slice.actions.getPersonalSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}

export function updatePersonal(data) {
    return async (dispatch) => {
        try {
            const response = await axios.patch(
                `/auth/update-user/${data.id}`,
                {
                    rol: data.rol,
                    departamento: data.departamento,
                    isActive: data.isActive
                }
            );
            dispatch(slice.actions.updatePersonalSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}




