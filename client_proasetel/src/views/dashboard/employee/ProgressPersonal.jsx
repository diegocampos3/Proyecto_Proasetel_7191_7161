import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
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
import { getAvanceUser } from 'store/slices/resultadoEvaluacion';
import useAuth from 'hooks/useAuth';

const getColor = (progress) => {
    if (progress < 50) return 'error';
    if (progress < 80) return 'primary';
    return 'success';
};

const ProgressPersonal = ({ isLoading }) => {
    const [selectedObjective, setSelectedObjective] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedCalification, setSelectedCalification] = useState('personal'); // Valor por defecto: "personal"
    const [listAvanceUser, setAvanceUser] = useState({});
    const { user } = useAuth();

    // Extraemos la data de avance desde el state
    const { avanceUser } = useSelector((state) => state.resultadoEvaluacion);

    useEffect(() => {
        setAvanceUser(avanceUser);
    }, [avanceUser]);

    useEffect(() => {
        if (user?.id) {
            dispatch(getAvanceUser(user.id));
        }
    }, [dispatch, user?.id]);

    console.log('ListAvanceUserProgress:', listAvanceUser);

    // Extraemos los objetivos y períodos únicos a partir de la data
    const uniqueObjectives = [
        ...new Set((listAvanceUser?.resultados || []).map((obj) => obj.nombreObj))
    ];
    const uniquePeriods = [
        ...new Set((listAvanceUser?.resultados || []).map((obj) => obj.nombrePeriodo))
    ];

    // Filtramos la data según el objetivo y el período seleccionados
    const filteredData = (listAvanceUser?.resultados || []).filter((obj) => {
        return (
            (!selectedObjective || obj.nombreObj === selectedObjective) &&
            (!selectedPeriod || obj.nombrePeriodo === selectedPeriod)
        );
    });

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const handleCalificationChange = (event) => {
        setSelectedCalification(event.target.value);
    };

    return (
        <MainCard content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h4">
                                    Avance de Objetivos Personales
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Select
                                            value={selectedObjective}
                                            onChange={handleObjectiveChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                Todos los objetivos
                                            </MenuItem>
                                            {uniqueObjectives.map((obj) => (
                                                <MenuItem key={obj} value={obj}>
                                                    {obj}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item>
                                        <Select
                                            value={selectedPeriod}
                                            onChange={handlePeriodChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                Todos los períodos
                                            </MenuItem>
                                            {uniquePeriods.map((period) => (
                                                <MenuItem key={period} value={period}>
                                                    {period}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item>
                                        <Select
                                            value={selectedCalification}
                                            onChange={handleCalificationChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="personal">
                                                Calificación personal
                                            </MenuItem>
                                            <MenuItem value="supervisor">
                                                Calificación supervisor
                                            </MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {filteredData.map((obj) => (
                            <Grid key={obj.idObj} container direction="column" sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="subtitle1" color="inherit">
                                        {obj.nombreObj}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <LinearProgress
                                        variant="determinate"
                                        value={
                                            selectedCalification === 'personal'
                                                ? obj.puntaje_evaluado
                                                : obj.puntaje_supervisor
                                        }
                                        color={getColor(
                                            selectedCalification === 'personal'
                                                ? obj.puntaje_evaluado
                                                : obj.puntaje_supervisor
                                        )}
                                        sx={{
                                            height: 8,
                                            borderRadius: 5,
                                            mt: 1,
                                            width: '80%',
                                        }}
                                    />
                                </Grid>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {selectedCalification === 'personal'
                                        ? `Resultado personal: ${obj.puntaje_evaluado}%`
                                        : `Resultado supervisor: ${obj.puntaje_supervisor}%`}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

ProgressPersonal.propTypes = {
    isLoading: PropTypes.bool,
};

export default ProgressPersonal;




