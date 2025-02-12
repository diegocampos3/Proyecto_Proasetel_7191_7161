
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';


// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
// import Typography from 'themes/typography';


// project-imports
import FeddbackFilter from './FeddbackFilter';
import FeedbackTable from './FeedbackTable'
//import PerObjTable from './PerObjTable';
//import PerObjFilter from './PerObjFilter';
import MainCard from 'ui-component/cards/MainCard';
import { getPeriodos, updatePeriodo } from 'store/slices/periodo';
import ComingSoonEvaluacion from 'views/pages/maintenance/ComingSoon/ComingSoonEvaluacion';


import { dispatch, useSelector } from 'store';
import { getPeriodsEva } from 'store/slices/periodsEva';
import { getSupervisor} from 'store/slices/department';
import useAuth from 'hooks/useAuth';




// ==============================||  LISTA DE OBJETIVOS PERSONALES ||============================== //

const Feedback = () => {
    
    const [open, setOpen] = useState(false);
    const [listPeriodsEva, setListPeriodsEva] = useState([]);
    const [supervisorDep, setSupervisorDep] = useState('');
    const { user } = useAuth();

    console.log('Imprimiendo Id de usuario:',user?.id)

    const { periodsEva } = useSelector((state) => state.periodsEva);
    const {supervisor } = useSelector((state) =>  state.department);
    const [ rowValue, setRowValue] = useState(null);

    useEffect(() => {
          dispatch(getSupervisor(user?.id))
    },[dispatch])

    useEffect(() => {
        setSupervisorDep(supervisor)
    }, [])

    console.log('supervisor', supervisor)

    console.log('Imrpimiendo datos:', supervisorDep)
    
    useEffect(() => {
        if (periodsEva.length > 0) {
            const formattedData = periodsEva.map(item => ({
                userId: user?.id,
                idPeriodoEva: item.idPeriodoEva,
                periodo: item.periodo.titulo,
                descripcion: item.periodo.descripcion,
                fechaFin: item.periodo.fecha_fin,
                supervisor: `${supervisor?.nombres} ${supervisor?.apellidos}`
            }));
    
            setListPeriodsEva(formattedData);
        }
    }, [periodsEva, supervisor]);
    
    console.log('Datos formateados:', listPeriodsEva);
    

    useEffect(() => {
        dispatch(getPeriodsEva())
    },[])

    // console.log('Imprimiento peridodos:', periodsEva)
    
    //para manejo de comingsoonevaluacion

    const [periodoElegido, setPeriodoElegido] = React.useState('');

    //para el control de la muestra segun fecha
    //const dispatch = useDispatch();
    const { periodos, isLoading, error } = useSelector((state) => state.periodo);
    const [isWithinPeriod, setIsWithinPeriod] = React.useState(false);
    const [periodoId, setPeriodoId] = useState(null);

    useEffect(() => {
        dispatch(getPeriodos());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && periodos) {
            const now = new Date();
            const periodoActivo = periodos
            .find(periodo => {
                
                const startDate = new Date(periodo?.fecha_ini_eval);
                const endDate = new Date(periodo?.fecha_fin_eval);
                // Debe retornar la combinación de ambas condiciones
                return periodo?.estado === true && now >= startDate && now <= endDate;

                
            });
            
            const periodoFin = periodos?.find(periodo => {
                const endDate = new Date(periodo?.fecha_fin_eval);
                return periodo?.estado === true && now >= endDate
            })

            const periodoIdent = periodos?.find(periodo => {
                return periodo?.estado === true
            })


            console.log('Imprimiento PERIODOOO:', periodoIdent)

            if(periodoFin){
                setPeriodoId(periodoIdent?.idPeriodo)
                console.log('IDENTIFICADOR PERIODO:', periodoId)
                dispatch(updatePeriodo(periodoId, {estado : false}))
            }

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
                {/* <Typography variant="h4" color="error">
                    Error cargando períodos: {error}
                </Typography> */}
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
            {/* filter section */}
            <CardContent>
                <FeddbackFilter {...{rows: listPeriodsEva, setRows: setListPeriodsEva}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <FeedbackTable open={open} setOpen={setOpen} listPeriodsEva={listPeriodsEva} setRowValue={setRowValue} />
                    </Grid> 
                </Grid>
            </Box>
        </MainCard>
    );
};

export default Feedback;
 