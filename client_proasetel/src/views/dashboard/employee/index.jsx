import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';



import { gridSpacing } from 'store/constant';

import PerObjectivesBarChart  from './PerObjectivesBarChart ';
import ObjetivosPCard from './ObjetivosPCard';
import ObjetivosPersPCard from './ObjetivosPersPCard';
import ProgressPersonal from './ProgressPersonal';

// ==============================|| DASHBOARD ||============================== //

const Dashboard = () => {

    return (
        <Grid container spacing={gridSpacing}>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ObjetivosPCard/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ObjetivosPersPCard/>
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
