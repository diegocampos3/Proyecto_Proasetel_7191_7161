
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import FeddbackFilter from './FeddbackFilter';
import FeedbackTable from './FeedbackTable'
//import PerObjTable from './PerObjTable';
//import PerObjFilter from './PerObjFilter';
import MainCard from 'ui-component/cards/MainCard';

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

    console.log('Imprimiento peridodos:', periodsEva)
    

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
 