
import {useEffect, useState} from 'react';
import React from 'react';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import BusinessObjTable from './BusinessObjTable';
import BusinessObjFilter from './BusinessObjFilter';
// import ClientFilter from './ClientFilter';
// import ClientDrawer from './ClientDrawer';
// import ClientTable from './ClientTable';
// import EditDepartment from './EditDepartment';
import MainCard from 'ui-component/cards/MainCard';
import { getPeriodos } from 'store/slices/periodo';
import ComingSoonConfig from 'views/pages/maintenance/ComingSoon/ComingSoonConfig';


import { dispatch, useSelector } from 'store';
import { getBusinessObj } from 'store/slices/businessobj';
import { useDispatch } from 'react-redux';



// ==============================||  LISTA DE OBJETIVOS EMPRESARIALES ||============================== //

const ObjEmprList = () => {
    const [open, setOpen] = useState(false);
    const [listBusinessObj, setListBusinessObj] = useState([]);

    const { businessObjs } = useSelector((state) => state.businessObj);
    const [ rowValue, setRowValue] = useState(null);

    useEffect(() => {
        setListBusinessObj(businessObjs);
    }, [businessObjs]);

    useEffect(() => {
        dispatch(getBusinessObj());
    }, [])
    
    console.log(businessObjs)

    //para manejar la pantalla de comingsoonconfig


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
                <BusinessObjFilter {...{rows: businessObjs, setRows: setListBusinessObj}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <BusinessObjTable open={open} setOpen={setOpen} listBusinessObj={listBusinessObj} setRowValue={setRowValue} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        {/*<ClientDrawer open={open} setOpen={setOpen} rowValue={rowValue} />*/}
                    </Grid>
                    
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ObjEmprList;
