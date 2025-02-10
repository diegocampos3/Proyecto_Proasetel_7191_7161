import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';
import { LOGIN, LOGOUT, INITIALIZED } from 'store/actions';
import accountReducer from 'store/accountReducer';
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// Estado inicial
const initialState = {
    isLoggedIn: false,
    isInitialized: false, // Indica si la autenticación se ha inicializado
    user: null
};

// Verificar si el token es válido
const verifyToken = (serviceToken) => {
    if (!serviceToken) return false;
    const decoded = jwtDecode(serviceToken);
    return decoded.exp > Date.now() / 1000;
};

// Establecer o eliminar el token de la sesión
const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// Crear el contexto
const JWTContext = createContext(null);

// URL de la API
const apiUrl = import.meta.env.VITE_APP_API_URL2;

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    // Cargar los datos del usuario al iniciar
    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    const response = await axios.get('/auth/me');
                    console.log('Imprimiento response.data:', response.data)
                    const {user } = response.data;
                    console.log('Imprimiendo desde provider:', user)

                    if (user) {
                        dispatch({
                            type: LOGIN,
                            payload: {
                                isLoggedIn: true,
                                user
                            }
                        });
                    } else {
                        console.error('No se encontró el usuario en la respuesta de la API.');
                        dispatch({
                            type: LOGOUT
                        });
                    }
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error('Error al cargar los datos del usuario:', err);
                dispatch({
                    type: LOGOUT
                });
            } finally {
                // Marcar la autenticación como inicializada
                dispatch({
                    type: INITIALIZED
                });
            }
        };

        init();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token, ...userData } = response.data; // Extrae el token y el resto de los datos
            console.log('Imoirmiendo el resto de data:', userData )
            if (token && userData) {
                setSession(token);
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: userData
                    }
                });
            } else {
                throw new Error('No se recibieron datos válidos del usuario.');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    // Función para registrar un usuario
    const register = async (nombres, apellidos, email, password, departamento) => {
        try {
            await axios.post(`${apiUrl}/auth/register`, {
                nombres,
                apellidos,
                email,
                password,
                departamento
            });
        } catch (error) {
            throw new Error('Este correo electrónico ya se encuentra registrado');
        }
    };

    // Mostrar un loader mientras se inicializa la autenticación
    if (!state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register }}>
            {children}
        </JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;