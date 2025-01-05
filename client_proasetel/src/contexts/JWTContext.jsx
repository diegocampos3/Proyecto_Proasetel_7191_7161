import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import { isAxiosError } from 'axios';


const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

// Definición de constante para API de proasetel
const apiUrl = import.meta.env.VITE_APP_API_URL2;


export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    const response = await axios.get(`${apiUrl}/auth/me`);
                    const { user } = response.data;
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email, password) => {
        
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
            const { token, user } = response.data;
        
            if (token) {
                setSession(token); 
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user
                    }
                });
            } 
            
        } catch (error) {

            // Lanza el error con el mensaje adecuado
            throw new Error(error.message);
         
        }
    
        
    };
    
    const register = async (nombres, apellidos, email, password, departamento) => {
        try {
            // Realizar la solicitud POST para registrar el usuario
            const response = await axios.post(`${apiUrl}/auth/register`, {
                nombres,
                apellidos,
                email,
                password,
                departamento
            });
    
            // Obtener usuarios del localStorage o usar el nuevo usuario
            const localUsers = JSON.parse(window.localStorage.getItem('users') || '[]');
            const users = [
                ...localUsers,
                { nombres, apellidos, email, password, departamento }
            ];
    
            // Guardar los usuarios actualizados en localStorage
            window.localStorage.setItem('users', JSON.stringify(users));
    
        } catch (error) {
            if(error.statusCode === 400)
                throw new Error('Este correo electrónico ya se encuentra registrado');
           
        
        }       
    };
    
   

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const requestResetPassword = async (email) => {
        try {
          const response = await axios.patch(`${apiUrl}/auth/request-reset-password`,{
            email
          });
      
          if (response && response.status === 200) 
            console.log('Enviando correo.....');
          
        } catch (error) {
          
            throw new Error(error.message);
        }
    };

    const resetPassword = async (resetPasswordToken, password) => {
        try {
          const response = await axios.patch(`${apiUrl}/auth/reset-password`,{
            resetPasswordToken,
            password
          });
      
          if (response && response.status === 200) 
            console.log('Contraseña restablecida');
          
        } catch (error) {
          
            throw new Error(error.message);
        }
    };
      



    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register,requestResetPassword, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
