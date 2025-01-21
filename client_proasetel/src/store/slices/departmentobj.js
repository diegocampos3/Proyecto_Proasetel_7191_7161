import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "../index"

const initialState = {
    error: null,
    businessObjs: [],
    departmentObjs: []
    
};

const slice = createSlice({
    name: 'departmentObj',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // GET BUSINESS-OBJ-DEPARTMENT
        getBusinessObjDepSuccess(state, action){
            state.businessObjs = action.payload
        },

        // ADD BUSINESS-OBJ-DEPARTMENT
        addBusinessObjDepSuccess(state, action){
            state.businessObjs = action.payload
        },

        // REMOVE BUSINESS-OBJ-DEPARTMENT
        removeBusinessObjDepSuccess(state, action){
            state.businessObjs = action.payload
        },

        // GET OBJECTIVE-DEP
        getObjDepSuccess(state, action) {
            state.departmentObjs = action.payload
        },

        // ADD OBJECTIVE-DEP
        addObjDepSuccess(state, action){
            state.departmentObjs = action.payload
        },

        // EDIT OBJECTIVE-DEP
        updateObjDepSuccess(state, action){
            state.departmentObjs = action.payload
        },

        // REMOVE OBJECTIVE-DEP
        removeObjDepSuccess(state, action){
            state.departmentObjs = action.payload
        }
    }
});

// Reducer
export default slice.reducer;

// --------------------------

const apiUrl = import.meta.env.VITE_APP_API_URL2;

export function getBusinessObjDep() {
    return async () => {
        try {
            const response = await axios.get(`${apiUrl}/objtivos-emp-dep`);
            console.log('datos desde axios:', response)
            dispatch(slice.actions.getBusinessObjDepSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            
        }
    }
}

export function addBusinessObjDep(data) {
    return async () => {
        try {
            const response = await axios.post(`${apiUrl}/objtivos-emp-dep`, data);
            dispatch(slice.actions.addBusinessObjDepSuccess(response.data))
            return {success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { sucess: false, error: error.message}
        }
    }
}

export function removeBusinessObjDep(id) {
    return async () => {
        try {
            const response = await axios.delete(`${apiUrl}/objtivos-emp-dep/businessObj/${id}`);
            dispatch(slice.actions.removeBusinessObjDepSuccess(response.data));
            return {success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { sucess: false, error: error.message}
        }
    }
}

export function getObjDep(id) {
    return async () => {
        try {
            const response = await axios.get(`${apiUrl}/objetivosDep/${id}`);
            dispatch(slice.actions.getObjDepSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function addObjDep(departmentObj){
    return async () => {
        try {
            console.log("Anadir nuevo objetivo axios:", departmentObj)
            const response = await axios.post(`${apiUrl}/objetivosDep`, departmentObj);
            dispatch(slice.actions.addObjDepSuccess(response.data));
            return {success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return {success: false, error: error.message}
        }
    }
}

export function updateObjDep(id, departmentObj){
    return async () => {
        try {
            const response = await axios.patch(`${apiUrl}/objetivosDep/${id}`, departmentObj );
            dispatch(slice.actions.updateObjDepSuccess(response.data));
            return {success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message}
        }
    }
}

export function removeObjDep(departmentObj) {
    return async () => {
        try {
            const response = await axios.delete(`${apiUrl}/objetivosDep`, {
                data: departmentObj
            });
            dispatch(slice.actions.removeObjDepSuccess(response.data));
            return { success: true };
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message };
        }
    };
}
