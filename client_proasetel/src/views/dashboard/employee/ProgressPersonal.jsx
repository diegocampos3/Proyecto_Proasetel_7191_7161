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

const objectiveData = [
    {
        name: 'Objetivo departamental 1',
        progress: 75,
        periodo: '2023-Q1',
        personalResult: 95,
        supervisorResult: 98
    },
    {
        name: 'Objetivo departamental 2',
        progress: 50,
        periodo: '2023-Q2',
        personalResult: 60,
        supervisorResult: 70
    },
    {
        name: 'Objetivo departamental 3',
        progress: 90,
        periodo: '2023-Q1',
        personalResult: 85,
        supervisorResult: 88
    }
];

const getColor = (progress) => {
    if (progress < 50) return 'error';
    if (progress < 80) return 'primary';
    return 'success';
};

const ProgressPersonal = ({ isLoading }) => {
    const [selectedObjective, setSelectedObjective] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedCalification, setSelectedCalification] = useState('personal'); // Calificación por defecto en "personal"

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const handleCalificationChange = (event) => {
        setSelectedCalification(event.target.value); // Actualización para la calificación
    };

    const filteredData = objectiveData.filter((obj) => {
        // Filtramos por objetivo, periodo y calificación (personal o supervisor)
        return (
            (!selectedObjective || obj.name === selectedObjective) &&
            (!selectedPeriod || obj.periodo === selectedPeriod)
        );
    });

    const uniquePeriods = [...new Set(objectiveData.map((obj) => obj.periodo))];

    return (
        <MainCard content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h4">Avance de Objetivos Departamentales</Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <Select
                                            value={selectedObjective}
                                            onChange={handleObjectiveChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Todos los objetivos</MenuItem>
                                            {objectiveData.map((obj) => (
                                                <MenuItem key={obj.name} value={obj.name}>
                                                    {obj.name}
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
                                            <MenuItem value="">Todos los períodos</MenuItem>
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
                                            <MenuItem value="personal">Calificación personal</MenuItem>
                                            <MenuItem value="supervisor">Calificación supervisor</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {filteredData.map((obj) => (
                            <Grid key={obj.name} container direction="column" sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="subtitle1" color="inherit">
                                        {obj.name}
                                    </Typography>
                                </Grid>
                                {/* Solo mostramos el progress bar del objetivo si la calificación es "Todos" */}
                                {selectedCalification === 'personal' || selectedCalification === 'supervisor' ? (
                                    <Grid item>
                                        <LinearProgress
                                            variant="determinate"
                                            value={obj[selectedCalification + 'Result']}
                                            color={getColor(obj[selectedCalification + 'Result'])}
                                            sx={{
                                                height: 8,
                                                borderRadius: 5,
                                                mt: 1,
                                                width: '80%',
                                            }}
                                        />
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <LinearProgress
                                            variant="determinate"
                                            value={obj.progress}
                                            color={getColor(obj.progress)}
                                            sx={{ height: 10, borderRadius: 5, mt: 1 }}
                                        />
                                    </Grid>
                                )}
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {selectedCalification === 'personal'
                                        ? `Resultado personal: ${obj.personalResult}%`
                                        : selectedCalification === 'supervisor'
                                        ? `Resultado supervisor: ${obj.supervisorResult}%`
                                        : `${obj.progress}%`}
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



