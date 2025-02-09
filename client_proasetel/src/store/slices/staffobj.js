import { createSlice } from "@reduxjs/toolkit";

import axios from "utils/axios"
import { dispatch } from "../index";

const initialState = {
    error: null,
    staffObjs: [],
    staffObjsProp: [],
    staffObjsPropDep: [],


    staffObjsbyUser: [],
    staffObjsPropbyUser: [],

}


const slice = createSlice({
    name: 'staffObj',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action){
            state.error = action.payload
        },

        //by user
        getStaffObjByUserSuccess(state, action){
            state.staffObjsbyUser = action.payload
        },

        getStaffObjPropAceptadosByUserSuccess(state, action){
            state.staffObjsPropbyUser = action.payload
        },

        //

        addStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },

        getStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },
        
        updateStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },

        removeStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },
        
        existeStaffObjSuccess(state, action){
            state.staffObjs = action.payload
        },

        getStaffObjPropSuccess(state, action){
            state.staffObjsProp = action.payload
        },

        getStaffObjPropAceptadosSuccess(state, action){
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
        },
        
        existeStaffObjPropSuccess(state, action){
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
            // console.log('Objetivos personales, AXIOS', response.data)
            dispatch(slice.actions.getStaffObjSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

export function updateStaffObj(id, data) {
    //console.log('iddddddddddddddd', id)
    return async () => {
        try {
            const response = await axios.patch(`/objetivosPers/${id}`, data);
            dispatch(slice.actions.updateStaffObjSuccess(response.data));
            return { success: true}
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return{ success: false, error: error.message}
        }
    }
}

export function getStaffObjByUser(id){
    return async () =>{
        try {
            const response = await axios.get(`/objetivosPers/byUser/${id}`);
            // console.log('Objetivos personales por Usuario, AXIOS', response.data)
            dispatch(slice.actions.getStaffObjByUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

// export function getStaffObjSupervisor(){
//     return async () =>{
//         try {
//             const response = await axios.get(`/objetivosPers`);
//             console.log('bjetivos personales, axios', response.data)
//             dispatch(slice.actions.getStaffObjSupervisorSuccess(response.data));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     }
// }

export function existeStaffObj(id) {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/objetivosPers/${id}`);
            return !!response.data; // Devuelve true si hay datos, false si no
        } catch (error) {
            console.error('Error al verificar existencia del objetivo:', error);
            return false; // Retorna false si hay error (por ejemplo, 404 Not Found)
        }
    };
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
            console.log('rspuesta ObjProp axios', response.data)
            dispatch(slice.actions.getStaffObjPropSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error))
        }
    }
}

export function existeStaffObjProp(id) {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/objetivos-pers-prop/${id}`);
            return !!response.data; // Devuelve true si hay datos, false si no
        } catch (error) {
            console.error('Error al verificar existencia del objetivo:', error);
            return false; // Retorna false si hay error (por ejemplo, 404 Not Found)
        }
    };
}

export function getStaffObjPropAceptados() {
    return async (dispatch) => {
        try {
            // Hacer la solicitud a la API
            const response = await axios.get(`/objetivos-pers-prop/user`);
            // console.log('AAAAAAAAAAArespuesta ObjProp axios', response.data);

            // Filtrar los datos para incluir solo aquellos con aceptacion === true
            const filteredData = response.data.filter(item => item.aceptacion === true);

            // Despachar la acción con los datos filtrados
            dispatch(slice.actions.getStaffObjPropAceptadosSuccess(filteredData));
        } catch (error) {
            // Manejar errores
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getStaffObjPropAceptadosByUser(id) {
    return async (dispatch) => {
        try {
            // Hacer la solicitud a la API
            const response = await axios.get(`/objetivos-pers-prop/byUser/${id}`);
            // console.log('AAAAAAAAAAArespuesta ObjProp axios', response.data);

            // Filtrar los datos para incluir solo aquellos con aceptacion === true
            const filteredData = response.data.filter(item => item.aceptacion === true);
            // console.log('Objetivos personales PROPUESTOS por Usuario, AXIOS', filteredData)

            // Despachar la acción con los datos filtrados
            dispatch(slice.actions.getStaffObjPropAceptadosByUserSuccess(filteredData));
        } catch (error) {
            // Manejar errores
            dispatch(slice.actions.hasError(error));
        }
    };
}

// export function getStaffObjPropAceptadosSupervisor() {
//     return async (dispatch) => {
//         try {
//             // Hacer la solicitud a la API
//             const response = await axios.get(`/objetivos-pers-prop/user`);
//             console.log('respuesta ObjProp axios', response.data);

//             // Filtrar los datos para incluir solo aquellos con aceptacion === true
//             const filteredData = response.data.filter(item => item.aceptacion === true);

//             // Despachar la acción con los datos filtrados
//             dispatch(slice.actions.getStaffObjPropAceptadosSupervisorSuccess(filteredData));
//         } catch (error) {
//             // Manejar errores
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// } 

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