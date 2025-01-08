import { createSlice } from "@reduxjs/toolkit";

import axios from 'utils/axios';
import { dispatch } from "../index";

const initialState = {
    error: null,
    departments: []
};

const slice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        //HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // GET DEPAMENTS
        getDepartmentsSuccess(state, action){
            state.departments = action.payload;
        },

        // ADD DEPARMENT
        addDepartmentSuccess(state, action){
            state.departments = action.payload;
        },

        // UPDATE DEPARMENT
        updateDepartmentSuccess(state, action){
            state.departments = action.payload;
        },

        // REMOVE DEPARMENT
        removeDepartmentSuccess(state, action){
            state.departments = action.payload;
        }

    }
});

// Reducer
export default slice.reducer;

// .......................................

const apiUrl = import.meta.env.VITE_APP_API_URL2;

export function getDepartments(){
    return async () => {
        try {
            const response = await axios.get(`${apiUrl}/departamentos`);
            dispatch(slice.actions.getDepartmentsSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function addDepartment(department){
    return async () => {
        try {
            const response = await axios.post(`${apiUrl}/departamentos`, department);
            dispatch(slice.actions.addDepartmentSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function updateDepartment(departmentId, department){
    return async () => {
        try {
            const response = await axios.patch(`${apiUrl}/departamentos/${departmentId}`, department);
            dispatch(slice.actions.updateDepartmentSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function removeDepartment(departmentId){
    return async () => {
        try {
            const response = await axios.delete(`${apiUrl}/departamentos/${departmentId}`);
            dispatch(slice.actions.removeDepartmentSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

