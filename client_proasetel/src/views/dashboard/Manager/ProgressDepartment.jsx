import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
import { dispatch, useSelector } from 'store';
import { getAvancePromedioDepart } from 'store/slices/resultadoEvaluacion';

const getColor = (progress) => {
    if (progress < 50) return 'error';
    if (progress < 80) return 'primary';
    return 'success';
};

const ProgressDepartment = ({ isLoading }) => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [listAvanceDep, setListAvanceDep] = useState([]);

    const { avanceDep } = useSelector((state) => state.resultadoEvaluacion);

    useEffect(() => {
        setListAvanceDep(avanceDep);
    }, [avanceDep]);

    useEffect(() => {
        dispatch(getAvancePromedioDepart());
    }, [dispatch]);

    console.log('List AvanceDep:', listAvanceDep);

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    // Filtrar por departamento y periodo
    const filteredData = listAvanceDep.filter((dept) => {
        const isDepartmentMatch = selectedDepartment ? dept.nombreDepartamento === selectedDepartment : true;
        const isPeriodMatch = selectedPeriod ? dept.nombrePeriodo === selectedPeriod : true;
        return isDepartmentMatch && isPeriodMatch;
    });

    // Condición para mostrar detalles (si se selecciona un departamento y un periodo específico)
    const showDetails = selectedDepartment && selectedPeriod;

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
                                    {listAvanceDep.map((dept) => (
                                        <MenuItem key={dept.idDepartamento} value={dept.nombreDepartamento}>
                                            {dept.nombreDepartamento}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select value={selectedPeriod} onChange={handlePeriodChange} displayEmpty sx={{ ml: 2 }}>
                                    <MenuItem value="">Todos los Periodos</MenuItem>
                                    {['Evento 3'].map((period) => (
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
                            <Grid key={dept.idDepartamento} container direction="column" sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="subtitle1" color="inherit">
                                        {dept.nombreDepartamento}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={parseFloat(dept.avance)} 
                                        color={getColor(parseFloat(dept.avance))} 
                                        sx={{ height: 10, borderRadius: 5, mt: 1 }}
                                    />
                                </Grid>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {dept.avance}%
                                </Typography>
                                {/* Si se ha seleccionado un departamento y periodo específico, mostramos los detalles */}
                                {showDetails && (
                                    <>
                                        <Typography variant="h5" color="textSecondary" sx={{ mt: 0.5 }}>
                                            Objetivos Departamentales:
                                        </Typography>
                                        {dept.objetivosEmp.map((objective, index) => {
                                            const percentage = parseFloat(objective.avance);
                                            return (
                                                <Grid key={index} container direction="column" sx={{ ml: 2, mt: 1 }}>
                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" color="textSecondary">
                                                            {objective.nombreObjetivoEmpresarial}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {percentage}%
                                                        </Typography>
                                                    </Grid>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={percentage} 
                                                        color={getColor(percentage)} 
                                                        sx={{ height: 8, borderRadius: 5, mt: 0.5, width: '80%' }}
                                                    />
                                                    <Divider sx={{ my: 2 }} />
                                                </Grid>
                                            );
                                        })}
                                    </>
                                )}
                                {/* Si no se ha seleccionado un periodo específico, solo mostramos el avance */}
                                {!showDetails && selectedDepartment && (
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                        Avance General de {dept.nombreDepartamento}: {dept.avance}%
                                    </Typography>
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

