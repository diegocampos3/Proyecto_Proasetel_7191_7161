import { useEffect, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project-imports
import StaffDrawer from './StaffDrawer';
import StaffTable from './StaffTable';
import Filter from './Filter';
import MainCard from 'ui-component/cards/MainCard';
import { getPeriodos } from 'store/slices/periodo';
import ComingSoonEvaluacion from 'views/pages/maintenance/ComingSoon/ComingSoonEvaluacion';


import { dispatch, useSelector } from 'store';
import { getPersonal } from 'store/slices/personal';

// ==============================|| STAFF LIST ||============================== //

const StaffList = () => {
    
    const [rows, setRows] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { personal } = useSelector((state) => state.personal);
     

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(() => {
        dispatch(getPersonal());
    }, []);

    useEffect(() => {
        setRows(personal);
    }, [personal]);

//para manejo de comingsoonevaluacion

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
                
                const startDate = new Date(periodo.fecha_ini_eval);
                const endDate = new Date(periodo.fecha_fin_eval);
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
            <ComingSoonEvaluacion/>
        );
    }

    return (
        <MainCard content={false}>
            {/* table */}
            <Box sx={{ display: drawerOpen ? 'flex' : 'block' }}>
                <Grid container sx={{ position: 'relative', display: drawerOpen ? 'flex' : 'block' }}>
                    <Grid item xs={12} {...{ sm: drawerOpen && 8 }}>
                        <Filter {...{ handleToggleDrawer, rows: personal, setRows }} />
                        <StaffTable {...{ rows }} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        {...{ sm: drawerOpen && 4 }}
                        sx={{
                            borderLeft: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <StaffDrawer
                            {...{
                                open: drawerOpen,
                                handleToggleDrawer,
                                rows: personal,
                                setRows,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default StaffList;
