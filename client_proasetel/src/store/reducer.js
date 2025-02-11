// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';

// project imports PROASETEL
import personalReducer from './slices/personal';
import calendarReducer from './slices/calendar';
import departmentReducer from './slices/department';
import businessObjReducer from './slices/businessobj';
import departmentObjReducer from './slices/departmentobj'
import staffObjReducer from './slices/staffobj'
import formularioReducer from './slices/formulario';
import formularioPreguntasReducer from './slices/formularioPregunta';
import respuestasPreguntasReducer from './slices/respuestasPreguntas';
import periodsEvaReducer from './slices/periodsEva'
import feedbackReducer from './slices/feedback'
import resultadoEvaluacionReducer from './slices/resultadoEvaluacion';
import periodoReducer from './slices/periodo';


// ==============================|| COMBINE REDUCER ||============================== //


const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    personal: personalReducer,
    department: departmentReducer,
    businessObj: businessObjReducer,
    departmentObj: departmentObjReducer,
    staffObj: staffObjReducer,
    formulario: formularioReducer,
    formularioPregunta: formularioPreguntasReducer,
    respuestasPreguntas: respuestasPreguntasReducer,
    periodsEva: periodsEvaReducer,
    feedback: feedbackReducer,
    resultadoEvaluacion: resultadoEvaluacionReducer,
    periodo:periodoReducer,
});

export default reducer;
