import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';



import { gridSpacing } from 'store/constant';

import BusinessObjectivesBarChart from './BusinessObjectivesBarChart';
import SupervisorSatisfactionPieChart from './SupervisorSatisfactionPieChart';
import ObjetivosBCard from './ObjetivosBCard';
import ObjetivosDCard from './ObjetivosDCard';
import ProgressDepartment from './ProgressDepartment';

// ==============================|| DASHBOARD ||============================== //

const Dashboard = () => {

    return (
        <Grid container spacing={gridSpacing}>

            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ObjetivosBCard/>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <ObjetivosDCard/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} lg={8} md={12}>
                        <BusinessObjectivesBarChart/>
                    </Grid>
                    <Grid item xs={12} lg={4} md={12}>
                        <SupervisorSatisfactionPieChart/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <ProgressDepartment/> 
                    </Grid>
                    <Grid item xs={12} md={4}>
                    </Grid>
                </Grid>
            </Grid>
            
        </Grid>
    );
};

export default Dashboard;
