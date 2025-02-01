import { LOGIN, LOGOUT, INITIALIZED } from './actions';

// Estado inicial
const initialState = {
    isLoggedIn: false,
    isInitialized: false, // Indica si la autenticación se ha inicializado
    user: null
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                isInitialized: true,
                user // Asegúrate de que el usuario se actualice aquí
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isInitialized: true,
                isLoggedIn: false,
                user: null
            };
        }
        case INITIALIZED: {
            return {
                ...state,
                isInitialized: true
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;