import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
    Button,
    CardActions,
    CardContent,
    Divider,
    Grid,
    MenuItem,
    Select,
    Typography,
    LinearProgress
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const departmentData = [
    { name: 'Ventas', progress: 75, objectives: 5, achieved: [2, 1, 3, 0, 2], period: '2023-Q1' },
    { name: 'Marketing', progress: 45, objectives: 6, achieved: [1, 2, 0, 4, 1, 3], period: '2023-Q2' },
    { name: 'TI', progress: 85, objectives: 4, achieved: [3, 4, 2, 1], period: '2023-Q3' },
    { name: 'Recursos Humanos', progress: 60, objectives: 3, achieved: [2, 3, 1], period: '2023-Q4' },
    { name: 'Finanzas', progress: 30, objectives: 7, achieved: [1, 0, 2, 3, 1, 1, 4], period: '2023-Q1' }
];

const getColor = (progress) => {
    if (progress < 50) return 'error';
    if (progress < 80) return 'primary';
    return 'success';
};

const ProgressDepartment = ({ isLoading }) => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    // Filtrar por departamento y periodo
    const filteredData = departmentData.filter((dept) => {
        const isDepartmentMatch = selectedDepartment ? dept.name === selectedDepartment : true;
        const isPeriodMatch = selectedPeriod ? dept.period === selectedPeriod : true;
        return isDepartmentMatch && isPeriodMatch;
    });

    return (
        <MainCard content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h4">Avance de Objetivos</Typography>
                            </Grid>
                            <Grid item>
                                <Select value={selectedDepartment} onChange={handleDepartmentChange} displayEmpty>
                                    <MenuItem value="">Todos los Departamentos</MenuItem>
                                    {departmentData.map((dept) => (
                                        <MenuItem key={dept.name} value={dept.name}>
                                            {dept.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select value={selectedPeriod} onChange={handlePeriodChange} displayEmpty sx={{ ml: 2 }}>
                                    <MenuItem value="">Todos los Periodos</MenuItem>
                                    {['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4'].map((period) => (
                                        <MenuItem key={period} value={period}>
                                            {period}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {filteredData.map((dept) => (
                            <Grid key={dept.name} container direction="column" sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="subtitle1" color="inherit">
                                        {dept.name}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={dept.progress} 
                                        color={getColor(dept.progress)} 
                                        sx={{ height: 10, borderRadius: 5, mt: 1 }}
                                    />
                                </Grid>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {dept.progress}%
                                </Typography>
                                {selectedDepartment && (
                                    <>
                                        <Typography variant="h5" color="textSecondary" sx={{ mt: 0.5 }}>
                                            Objetivos Departamentales por Empresarial:
                                        </Typography>
                                        {dept.achieved.map((num, index) => {
                                            const maxAchieved = Math.max(...dept.achieved);
                                            const percentage = ((num / maxAchieved) * 100).toFixed(0);
                                            return (
                                                <Grid key={index} container direction="column" sx={{ ml: 2, mt: 1 }}>
                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Objetivo Empresarial {index + 1}: {num}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {percentage}%
                                                        </Typography>
                                                    </Grid>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={parseFloat(percentage)} 
                                                        color={getColor(parseFloat(percentage))} 
                                                        sx={{ height: 8, borderRadius: 5, mt: 0.5, width: '80%' }}
                                                    />
                                                    <Divider sx={{ my: 2 }} />
                                                </Grid>
                                            );
                                        })}
                                    </>
                                )}
                                <Divider sx={{ my: 0.5 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

ProgressDepartment.propTypes = {
    isLoading: PropTypes.bool
};

export default ProgressDepartment;
