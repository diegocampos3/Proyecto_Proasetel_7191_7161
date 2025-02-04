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
        cantidadPersonas: 3,
        periodo: '2023-Q1',
        people: [
            { name: 'Carlos Pérez', progress: 80 },
            { name: 'Ana García', progress: 70 },
            { name: 'Luis Rodríguez', progress: 85 }
        ]
    },
    {
        name: 'Objetivo departamental 2',
        progress: 50,
        cantidadPersonas: 2,
        periodo: '2023-Q2',
        people: [
            { name: 'María Torres', progress: 60 },
            { name: 'Jorge López', progress: 40 }
        ]
    },
    {
        name: 'Objetivo departamental 3',
        progress: 90,
        cantidadPersonas: 4,
        periodo: '2023-Q1',
        people: [
            { name: 'Elena Ruiz', progress: 95 },
            { name: 'Pedro Gómez', progress: 85 },
            { name: 'Clara Jiménez', progress: 92 },
            { name: 'Roberto Díaz', progress: 88 }
        ]
    }
];

const getColor = (progress) => {
    if (progress < 50) return 'error';
    if (progress < 80) return 'primary';
    return 'success';
};

const ProgressDepartment = ({ isLoading }) => {
    const [selectedObjective, setSelectedObjective] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const filteredData = objectiveData.filter((obj) => {
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {filteredData.map((obj) => (
                            <Grid key={obj.name} container direction="column" sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="subtitle1" color="inherit">
                                        {obj.name} {selectedObjective && `- ${obj.cantidadPersonas} Personas`}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <LinearProgress
                                        variant="determinate"
                                        value={obj.progress}
                                        color={getColor(obj.progress)}
                                        sx={{ height: 10, borderRadius: 5, mt: 1 }}
                                    />
                                </Grid>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {obj.progress}%
                                </Typography>
                                {selectedObjective && (
                                    <>
                                        <Typography variant="h5" color="textSecondary" sx={{ mt: 1 }}>
                                            Personas asociadas:
                                        </Typography>
                                        {obj.people.map((person, index) => (
                                            <Grid key={index} container direction="column" sx={{ ml: 2, mt: 1 }}>
                                                <Grid container justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="textSecondary">
                                                        {person.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {person.progress}%
                                                    </Typography>
                                                </Grid>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={person.progress}
                                                    color={getColor(person.progress)}
                                                    sx={{ height: 8, borderRadius: 5, mt: 0.5, width: '80%' }}
                                                />
                                            </Grid>
                                        ))}
                                        <Divider sx={{ my: 2 }} />
                                    </>
                                )}
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



