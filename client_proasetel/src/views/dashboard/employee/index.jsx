import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';



import { gridSpacing } from 'store/constant';

import PerObjectivesBarChart  from './PerObjectivesBarChart ';
import ObjetivosPCard from './ObjetivosPCard';
import ObjetivosPersPCard from './ObjetivosPersPCard';
import ProgressPersonal from './ProgressPersonal';
import { dispatch, useSelector } from 'store';
import { getTotalObjUser } from 'store/slices/resultadoEvaluacion';
import useAuth from 'hooks/useAuth';

// ==============================|| DASHBOARD ||============================== //

const Dashboard = () => {

    const { user } = useAuth()

    const [totalObj, setTotalObj] =  useState({})
    const {totalObjUser} = useSelector((state) => state.resultadoEvaluacion);
    
        useEffect(() => {
            setTotalObj(totalObjUser)
        }, [totalObjUser])
    
        useEffect(() => {
            dispatch(getTotalObjUser(user?.id))
        }, [dispatch])
    
        console.log('Imprimiendo totalUser:', totalObj?.totalObjetivosUsuario)


    return (
        <Grid container spacing={gridSpacing}>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ObjetivosPCard totalObj={totalObj?.totalObjetivosEmpresariales}/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ObjetivosPersPCard totalObj={totalObj?.totalObjetivosUsuario} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} lg={12} md={12}>
                        <PerObjectivesBarChart />
                    </Grid>
                    <Grid item xs={12} lg={12} md={12}>
                        <ProgressPersonal/> 
                    </Grid>
                </Grid>
            </Grid>
            
        </Grid>
    );
};

export default Dashboard;
