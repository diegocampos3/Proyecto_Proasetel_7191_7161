import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios";
import { dispatch } from "../index";


const initialState = {
    error: null,
    businessObjs: []
};

const slice = createSlice({
    name: 'businessObj',
    initialState,
    reducers: {
        
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload;
        },

        // GET BUSINESS OBJECTIVE
        getBusinessObjSuccess(state, action){
            state.businessObjs = action.payload;
        },

        // ADD BUSINESS OBJETIVE
        addBusinessObjSuccess(state, action){
            state.businessObjs = action.payload;
        },

        // UPDATE BUSINESS OBJECTIVE
        updateBusinessObjSuccess(state, action){
            state.businessObjs = action.payload;
        },

        // REMOVE BUSINESS OBJECTIVE
        removeBusinessObjSuccess(state, action){
            state.businessObjs = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------

const apiUrl = import.meta.env.VITE_APP_API_URL2;

export function getBusinessObj() {
    return async () => {
        try {
            const response = await axios.get(`${apiUrl}/objetivos-empr`);
            dispatch(slice.actions.getBusinessObjSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}


export function addBusinessObj(businessObj){
    return async () => {
        try {
           const response =  await axios.post(`${apiUrl}/objetivos-empr`, businessObj);
           dispatch(slice.actions.addBusinessObjSuccess(response.data)); 
           return { success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message};
        }
    };
}


export function updateBusinessObj(businessObjId, businessObj) {
    return async () => {
        try {
            const response = await axios.patch(`${apiUrl}/objetivos-empr/${businessObjId}`, businessObj);
            dispatch(slice.actions.updateBusinessObjSuccess(response.data));
            return { success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return { success: false, error: error.message}
        }
    };
}


export function removeBusinessObj(businessObjId) {
    return async () => {
        try {
            const response = await axios.delete(`${apiUrl}/objetivos-empr/${businessObjId}`);
            dispatch(slice.actions.removeBusinessObjSuccess(response.data));
            return { success: true};
        } catch (error) {
            dispatch(actions.hasError(error));
            return { success: false, error: error.message};
        }
    }
}




