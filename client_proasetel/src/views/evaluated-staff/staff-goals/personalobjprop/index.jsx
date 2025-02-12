import {useEffect, useState} from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import PerPropObjFilter from './PerPropObjFilter';
import PerPropObjTable from './PerPropObjTable';
import MainCard from 'ui-component/cards/MainCard';
import { getPeriodos } from 'store/slices/periodo';
import ComingSoonConfig from 'views/pages/maintenance/ComingSoon/ComingSoonConfig';


import { dispatch, useSelector } from 'store';
import { getStaffObjProp } from 'store/slices/staffobj';



// ==============================||  LISTA DE OBJETIVOS PERSONALES PROPUESTOS ||============================== //

const ObjPersPList = () => {
    const [open, setOpen] = useState(false);
    const [listPersPrObj, setListPersPrObj] = useState([]);

    const { staffObjsProp } = useSelector((state) => state.staffObj);
    const [ rowValue, setRowValue] = useState(null);

    console.log(staffObjsProp)
    
    useEffect(() => {
        setListPersPrObj(staffObjsProp);
    }, [staffObjsProp]);

    useEffect(() => {
        dispatch(getStaffObjProp());
    }, [])
    

//para manejo de comingsoonconfig

const [periodoElegido, setPeriodoElegido] = React.useState('');

    //para el control de la muestra segun fecha
    const dispatch = useDispatch();
    const { periodos, isLoading, error } = useSelector((state) => state.periodo);
    const [isWithinPeriod, setIsWithinPeriod] = React.useState(false);

    useEffect(() => {
        dispatch(getPeriodos());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && periodos) {
            const now = new Date();
            const periodoActivo = periodos
            .find(periodo => {
                
                const startDate = new Date(periodo.fecha_ini_config);
                const endDate = new Date(periodo.fecha_fin_config);
                // Debe retornar la combinación de ambas condiciones
                return periodo.estado === true && now >= startDate && now <= endDate;
            });

            if (periodoActivo) {
                setIsWithinPeriod(true);
                setPeriodoElegido(periodoActivo);
            } else {
                setIsWithinPeriod(false);
                setPeriodoElegido(null);
            }
        }
    }, [isLoading, periodos]);

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };


    if (isLoading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Typography variant="h4" color="error">
                    Error cargando períodos: {error}
                </Typography>
            </Grid>
        );
    }

    if (!isWithinPeriod) {
        return (
            <ComingSoonConfig/>
        );
    }
    

    return (

        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <PerPropObjFilter {...{rows: staffObjsProp, setRows: setListPersPrObj}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <PerPropObjTable open={open} setOpen={setOpen} listPersPrObj={listPersPrObj} setRowValue={setRowValue} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        {/*<ClientDrawer open={open} setOpen={setOpen} rowValue={rowValue} />*/}
                    </Grid>
                    
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ObjPersPList;
