import React from 'react';
import {useEffect, useState} from 'react';
import { dispatch, useSelector } from 'store';
import { useNavigate, useParams } from 'react-router-dom';


// material-ui
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { getFormularios } from 'store/slices/formulario';
import { getPreguntasByFormulario } from 'store/slices/formularioPregunta';
import {getRespuestas} from 'store/slices/respuestasPreguntas';
import {existeStaffObj, existeStaffObjProp, updateStaffObjProp, updateStaffObj} from 'store/slices/staffobj';
import { createResultadoEvaluacion, updateResultadoEvaluacion, getResultadosEvaluacion } from 'store/slices/resultadoEvaluacion';




// ==============================|| RADIO ||============================== //

const UIRadio = () => {
    const [valueBasic, setValueBasic] = React.useState('female');
    const [valueLabel, setValueLabel] = React.useState('checked');
    const [valuePlacement, setValuePlacement] = React.useState('top');
    const [valueSize, setValueSize] = React.useState('md');
    const [valueColor, setValueColor] = React.useState('default');

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    
    //-------------------- TRAIDA DE FORMULARIO DEFINIDO PARA ESTE PERIODO ----------------

    //traer los formularios
    const { formularios } = useSelector((state) => state.formulario)
    const [formularioDefinido, setFormularioDefinido] = useState({}) 

    console.log('Formulario definido:', formularioDefinido)

    
    // useEffect(() => {
    //     setFormularioDefinido(formularios.filter((formulario) => formulario.estado === 2));
    // }, [formularios]);

    useEffect(() => {
        const formulariosFiltrados = formularios.filter((formulario) => formulario.estado === 2);
        setFormularioDefinido(formulariosFiltrados.length > 0 ? formulariosFiltrados : []);
    }, [formularios]);

    useEffect(() => {
        dispatch(getFormularios());
    }, []);

    // console.log('FORMULARIO DEFINIDO', formularioDefinido)

    //-------------------- FIN TRAIDA FORMULARIO DEFINIDO PARA ESTE PERIODO--------------



    //-------------------- TRAIDA DE PREGUNTAS SEGUN FORMULARIO  ----------------

    const [listPreguntasFormulario, setListPreguntasFormulario] = useState([]);
    
    useEffect(() => {
        if (formularioDefinido.length > 0 && formularioDefinido[0].idFormulario) {
            dispatch(getPreguntasByFormulario(formularioDefinido[0].idFormulario));
        }
    }, [formularioDefinido]);

    const preguntas = useSelector((state) => state.formularioPregunta.preguntas|| []);  // Aseguramos que sea un array vacío si no está disponible

    useEffect(() => {
        if (preguntas && preguntas.length > 0) {
            setListPreguntasFormulario(preguntas);
        }else{
            setListPreguntasFormulario([]);
        }
    }, [preguntas]);

    // console.log('PREGUNTAAAAAAAAAAAAAAASSS', listPreguntasFormulario)

    //-------------------- FIN TRAIDA DE PREGUNTAS SEGUN FORMULARIO  ----------------


    //-------------------- FIN TRAIDA DE PREGUNTAS SEGUN FORMULARIO  ----------------


    //--------------------  TRAIDA DE LAS RESPUESTAS  ----------------

    const[listRespuestas,setListRespuestas]= useState([]) ; //nuevo
    const { respuestas } = useSelector((state) => state.respuestasPreguntas)

    console.log('Trayendo las respuestas:', respuestas)

    useEffect(() => {
        setListRespuestas(respuestas);
    }, [respuestas]);


    useEffect(() => {
        dispatch(getRespuestas());
    }, []);

    // console.log('aaaaaaa', respuestas)

    //--------------------  FIN TRAIDA DE LAS RESPUESTAS  ----------------


    //-------------------- TRAIDA DE RESULTADOS EVALUACION  ----------------

    const[listResultadosEvaluacion,setListResultadosEvaluacion]= useState([]) ; //nuevo
    const {resultados} = useSelector((state) => state.resultadoEvaluacion)

    useEffect(() => {
        setListResultadosEvaluacion(resultados);
    }, [resultados]);

    useEffect(() => {
        dispatch(getResultadosEvaluacion());
    }, []);

    console.log('RESULTADOS', listResultadosEvaluacion)

    //-------------------- FIN TRAIDA DE RESULTADOS EVALUACION  ----------------



    //------------------------ eleccion de respuesta y almacenamiento en la base ----------------------
    
    const [selectedValues, setSelectedValues] = useState({});

    //console.log('RESPUESTASSSS^^^^^', selectedValues)

    const { idObjEvaluar } = useParams(); // Obtén el idObjEvaluar de la URL
    const navigate = useNavigate();

    const handleGuardar = async () => {
        // Validar el formulario antes de continuar
        if (!validateForm()) {
            showSnackbar('Por favor, responda todas las preguntas antes de guardar.', 'error');
            return; // Detener la ejecución si hay errores
        }

        try {
            // Determinar si el idObjEvaluar pertenece a idObjPer o idObjPersProp
            let idObjPer = null;
            let idObjPersProp = null;

            // Verificar existencia en staffobj
            const existeStaff = await dispatch(existeStaffObj(idObjEvaluar));
            if (existeStaff) {
                idObjPer = idObjEvaluar;
                // await dispatch(updateStaffObj(idObjEvaluar, { evaluado_empleado: true }));
                
            } else {
                // Si no existe en staffobj, verificar en staffobjprop
                const existeStaffProp = await dispatch(existeStaffObjProp(idObjEvaluar));
                if (existeStaffProp) {
                    idObjPersProp = idObjEvaluar;
                    // await dispatch(updateStaffObjProp(idObjEvaluar, { evaluado_empleado: true }));
                }
            }

            // Validar que al menos uno de los dos campos tenga valor
            if (!idObjPer && !idObjPersProp) {
                showSnackbar('El objetivo no existe en ninguna tabla', 'error');                
                return;
            }

            // console.log(
            //     'idObjPer',idObjPer,
            //     'idObjPersProp',
            //     'idPregunta', pregunta.idPregunta,
            //     'puntaje_evaluado', Number(selectedValues[pregunta.idPregunta]),

            // )

            // Guardar cada pregunta seleccionada
            for (const pregunta of listPreguntasFormulario) {
                if (selectedValues[pregunta.idPregunta]) {

                    const registroEncontrado = listResultadosEvaluacion.find((registro) => 
                        registro.idPregunta === pregunta.idPregunta &&
                        (registro.idObjPer === idObjEvaluar || registro.idObjPersProp === idObjEvaluar)
                    );

                    //console.log('REGISTRO ENCONTRADO', registroEncontrado)
                    // console.log('PREGUNTAAAAA:', pregunta)
                    if (registroEncontrado) {
                        // Extraer el idResultadoEvaluacion del registro encontrado
                        const idResultadoEvaluacion = registroEncontrado.idResultadoEvaluacion;
                        // console.log('IDRESULTADO_EVALUACION', idResultadoEvaluacion)
                        await dispatch(
                            updateResultadoEvaluacion(idResultadoEvaluacion,{
                                puntaje_evaluado: Number(selectedValues[pregunta.idPregunta]),
                            })
                        );
                    }else{
                        await dispatch(
                            createResultadoEvaluacion({
                                idObjPer,
                                idObjPersProp,
                                idPregunta: pregunta.idPregunta,
                                puntaje_evaluado: Number(selectedValues[pregunta.idPregunta]),
                                puntaje_supervisor: null
                            })
                        );
                    }
                }
            }
            if (idObjPer !== null){
                await dispatch(updateStaffObj(idObjEvaluar, { evaluado_empleado: true }));
            }else{
                if(idObjPersProp !== null){
                    await dispatch(updateStaffObjProp(idObjEvaluar, { evaluado_empleado: true }));
                }
            }
            showSnackbar('Evaluación guardada correctamente', 'success');           
            setTimeout(() => {
                navigate(-1); // Regresar a la página anterior después de 2 segundos
            }, 1800);
            // showSnackbar('Evaluación guardada correctamente', 'success');           
        } catch (error) {
            console.error('Error al guardar:', error);
            showSnackbar('Error al guardar la evaluación', 'error');      
        }
    };



//------------------------ fin eleccion de respuesta y almacenamiento en la base ----------------------

// ---------------------------------- MANEJO DE ERRORES FORMULARIO ----------------------------------//
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        listPreguntasFormulario.forEach((pregunta) => {
            if (!selectedValues[pregunta.idPregunta]) {
                newErrors[pregunta.idPregunta] = 'Debe seleccionar una opción';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

// ---------------------------------- FIN MANEJO DE ERRORES FORMULARIO ----------------------------------//


    return (
        <MainCard title="Evaluación Objetivo Personal" secondary={
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGuardar}
            >
                Guardar DC
            </Button>
        }>
            <Grid container spacing={gridSpacing}>
            {listPreguntasFormulario.map((pregunta, index) => (
                <Grid item xs={12} key={pregunta.idPregunta}>
                    <SubCard title={pregunta.pregunta}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <FormControl>
                                <RadioGroup
                                    row
                                    aria-label={`respuestas-${pregunta.idPregunta}`}
                                    value={selectedValues[pregunta.idPregunta] || ''}
                                    onChange={(e) => {
                                        setSelectedValues({ ...selectedValues, [pregunta.idPregunta]: e.target.value });
                                        setErrors({ ...errors, [pregunta.idPregunta]: '' }); // Limpiar el error al seleccionar una opción
                                    }}
                                    name={`radio-group-${pregunta.idPregunta}`}
                                >
                                        {listRespuestas.map((respuesta) => (
                                            <FormControlLabel
                                                key={respuesta.idRespuestaPregunta} // Asegúrate de usar un identificador único
                                                value={respuesta.valor}
                                                control={
                                                    <Radio 
                                                        sx={{ 
                                                            color: 'primary.main', // Ej: "primary.main"
                                                            '&.Mui-checked': { 
                                                                color: 'primary.main' 
                                                            } 
                                                        }} 
                                                    />
                                                }
                                                label={
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{respuesta.clave}</span>
                                                        <span>{respuesta.descripcion}</span>
                                                    </div>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                    {errors[pregunta.idPregunta] && (
                                        <Typography color="error" variant="body2">
                                            {errors[pregunta.idPregunta]}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            ))}
            </Grid>
            {/* Snackbar para mostrar mensajes */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2800} // Duración en milisegundos
                onClose={() => setSnackbarOpen(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </MainCard>
    );
};

export default UIRadio;
