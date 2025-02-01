import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "../index";

const initialState = {
    error: null,
    staffObjs: [],
    staffObjsProp: [],
    staffObjsPropDep: []
}


const slice = createSlice({
    name: 'staffObj',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload
        },

        addStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },

        getStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },

        removeStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },

        getStaffObjPropSuccess(state, action){
            state.staffObjsProp = action.payload
        },

        addStaffObjPropSuccess(state, action){
            state.staffObjsProp = action.payload
        },

        updateStaffObjPropSuccess(state, action){
            state.staffObjsProp = action.payload
        },

        getStaffObjPropDepSuccess(state, action){
            state.staffObjsPropDep = action.payload
        },
        
        removeStaffObjPropSuccess(state, action){
            state.staffObjsProp = action.payload
        }
    }
});

// Reducer
export default slice.reducer

// --------------


export  function addStaffObj(staffObj) {
    return async () =>{
        try {
            const response = await axios.post(`/objetivosPers`,staffObj);
            dispatch(slice.actions.addStaffObjSuccess(response.data));
            return {success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return {success: true, error: error.message}
        }
    }
}

export function getStaffObj(){
    return async () =>{
        try {
            const response = await axios.get(`/objetivosPers`);
            console.log('Objetivos personales, axios', response.data)
            dispatch(slice.actions.getStaffObjSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}


export function removeStaffObj(id){
    return async () => {
        try {
            const response = await axios.delete(`/objetivosPers/${id}`);
            dispatch(slice.actions.removeStaffObjSuccess(response.data));
            return { success: true};
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message}
        }
    }
}

export function getStaffObjProp(){
    return async () => {
        try {
            const response = await axios.get(`/objetivos-pers-prop/user`);
            console.log('respuesta ObjProp axios', response.data)
            dispatch(slice.actions.getStaffObjPropSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}

export function addStaffObjProp(data) {
    return async () => {
        try {
            const response = await axios.post(`/objetivos-pers-prop`, data);
            dispatch(slice.actions.addStaffObjPropSuccess(response.data));
            return{success: true};
        } catch (error) {
            dispatch(slice.actions.hasError(error))
            return {success: false, error: error.message}
        }
    }
}

export function updateStaffObjProp(id, data) {
    return async () => {
        try {
            const response = await axios.patch(`/objetivos-pers-prop/${id}`, data);
            dispatch(slice.actions.updateStaffObjPropSuccess(response.data));
            return { success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return{ success: false, error: error.message}
        }
    }
}


export function getStaffObjPropDep() {
    return async () => {
        try {
            const response = await axios.get(`/objetivos-pers-prop/department`);
            dispatch(slice.actions.getStaffObjPropDepSuccess(response.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function removeStaffObjProp(id){
    return async () => {
        try {
            const response = await axios.delete(`/objetivos-pers-prop/${id}`);
            dispatch(slice.actions.removeStaffObjPropSuccess(response.data));
            return {success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return {success: false, error: error.message}
        }
    }
}