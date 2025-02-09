import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dispatch, useSelector } from 'store';
import { getPreguntasByFormulario } from 'store/slices/formularioPregunta';
import {getFormularioById} from 'store/slices/formulario'

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project imports
import ItemTable from './ItemTable';
import ItemDrawer from './ItemDrawer';
import ItemFilter from './ItemFilter';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { maxWidth } from '@mui/system';
import { alignProperty } from '@mui/material/styles/cssUtils';

// ==============================|| ITEM LIST ||============================== //

const ItemList = () => {
    const { idFormulario } = useParams();  // Aquí capturamos el 'idFormulario' desde la URL

    const [open, setOpen] = useState(false);
    const [listPreguntasFormulario, setListPreguntasFormulario] = useState([]);
    const [rowValue, setRowValue] = useState(null);
    const [formularioEstado, setFormularioEstado] = useState(null);
    
    useEffect(() => {
        if (idFormulario) {
            dispatch(getPreguntasByFormulario(idFormulario));  // Llamamos la acción para obtener las preguntas con idFormulario
        }
    }, [idFormulario]);

    const preguntas = useSelector((state) => state.formularioPregunta.preguntas|| []);  // Aseguramos que sea un array vacío si no está disponible

    useEffect(() => {
        if (preguntas && preguntas.length > 0) {
            setListPreguntasFormulario(preguntas);
        }else{
            setListPreguntasFormulario([]);
        }
    }, [preguntas]);


    //manejo de estado de formulario
    const {formulario} = useSelector((state) => state.formulario);  // Aseguramos que sea un array vacío si no está disponible
    useEffect(() => {
        if (idFormulario) {
            dispatch(getFormularioById(idFormulario));  // Llamamos la acción para obtener las preguntas con idFormulario
        }
    }, [idFormulario]);

    useEffect(() => {
        if(formulario){
            // console.log("FORMULARIOOO", formulario)
            setFormularioEstado(formulario.estado)
        }
    },[formulario]);

// console.log("ESTADOOO DEL FORMULARIOOO", formularioEstado)


    return (
        <MainCard content={false}>
            {/* Sección de filtro */}
            <CardContent>
                <ItemFilter {...{rows: preguntas, setRows:setListPreguntasFormulario, idFormulario: idFormulario}}/>        
            </CardContent>

            {/* Tabla */}
            <Box display={open ? 'flex' : 'block'} >
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <ItemTable open={open} setOpen={setOpen} listPreguntasFormulario={listPreguntasFormulario} formularioEstado={formularioEstado} setRowValue={setRowValue}/>
                    </Grid>
                    {/* <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderColor: 'divider' }}>
                        <ItemDrawer open={open} setOpen={setOpen} rowValue={rowValue} />
                    </Grid> */}
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ItemList;
