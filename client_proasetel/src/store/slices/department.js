import { createSlice } from "@reduxjs/toolkit";

import axios from 'utils/axios';
import { dispatch } from "../index";

const initialState = {
    error: null,
    departments: [],
    departmentDetails: null,
    supervisor: null
};

const slice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        //HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // GET DEPARMENTS
        getDepartmentsSuccess(state, action){
            state.departments = action.payload;
        },

        // ADD DEPARMENT 
        addDepartmentSuccess(state, action){
            state.departments = action.payload;
        },

        // UPDATE DEPARMENT
        updateDepartmentSuccess(state, action){
            const updateDepartment = action.payload;
            state.departments = state.departments.map((department) =>
                 department.id === updateDepartment.id ? updateDepartment : department
            )
        },

        // REMOVE DEPARMENT
        removeDepartmentSuccess(state, action){
            state.departments = action.payload;
        },

        // GET DETAILS USERS DEPARTMENT
        getDetailsUsersDepSuccess(state, action){
            console.log("Imprimiendo desde Redux:", action.payload)
            state.departmentDetails = action.payload;
        },

        // GET SUPERVISOR
        getSupervisorSuccess(state, action){
            state.supervisor = action.payload
        }

    }
});

// Reducer
export default slice.reducer;

// .......................................


export function getDepartments(){
    return async () => {
        try {
            const response = await axios.get(`/departamentos`);
            dispatch(slice.actions.getDepartmentsSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getDetailsUsersDep(departmentId){
    return async () => {
        try {
            console.log('Entrando a redux de departmnet')
            const response = await axios.get(`/departamentos/details/${departmentId}`);
            console.log('Datos del departamento _Redux:', response.data); // Verifica los datos antes de despacharlos

            dispatch(slice.actions.getDetailsUsersDepSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function getSupervisor(idUser){
    return async () => {
        try {
            const response = await axios.get(`/auth/supervisor/${idUser}`);
            dispatch(slice.actions.getSupervisorSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}



export function addDepartment(department){
    return async () => {
        try {
            const response = await axios.post(`/departamentos`, department);
            dispatch(slice.actions.addDepartmentSuccess(response.data));
            return { success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message }; 
        }
    }
}

export function updateDepartment(departmentId, department){
    return async () => {
        try {
            const response = await axios.patch(`/departamentos/${departmentId}`, department);
            dispatch(slice.actions.updateDepartmentSuccess(response.data));
            return { success: true };

        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message }; 

        }
    };
}

export function removeDepartment(departmentId){
    return async () => {
        try {
            const response = await axios.delete(`/departamentos/${departmentId}`);
            dispatch(slice.actions.removeDepartmentSuccess(response.data));
            return { success: true};
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { sucess: false, error: error.message};
        }
    };
}

