import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
import { getAvanceDepartmentUser } from 'store/slices/resultadoEvaluacion';
import useAuth from 'hooks/useAuth';

// Función para determinar el color del progress bar según el avance
const getColor = (progress) => {
    if (progress < 50) return 'error';
    if (progress < 80) return 'primary';
    return 'success';
};

const ProgressDepartment = ({ isLoading }) => {
    const [selectedObjective, setSelectedObjective] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [listAvanceUser, setListAvanceUser] = useState({});
    const { user } = useAuth();

    // Extraemos el avance del departamento desde el state
    const { avanceDepUser } = useSelector((state) => state.resultadoEvaluacion);

    useEffect(() => {
        setListAvanceUser(avanceDepUser);
    }, [avanceDepUser]);

    useEffect(() => {
        if (user?.departamento?.id) {
            dispatch(getAvanceDepartmentUser(user.departamento.id));
        }
    }, [dispatch, user?.departamento?.id]);

    console.log('ListAvanceUser:', listAvanceUser);

    // Se extrae la lista de objetivos del JSON obtenido.
    const objectiveList = listAvanceUser?.objetivosEmpresariales || [];

    // Se obtienen los valores únicos para cada select
    const uniqueObjectives = [...new Set(objectiveList.map((obj) => obj.nombreObjetivoEmpresarial))];
    const uniquePeriods = [...new Set(objectiveList.map((obj) => obj.nombrePeriodo))];

    // Filtramos la data según el objetivo y el período seleccionados
    const filteredData = objectiveList.filter((obj) => {
        return (
            (!selectedObjective || obj.nombreObjetivoEmpresarial === selectedObjective) &&
            (!selectedPeriod || obj.nombrePeriodo === selectedPeriod)
        );
    });

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    return (
        <MainCard content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    {/* Filtros de Objetivo y Período */}
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
                                            {uniqueObjectives.map((objective) => (
                                                <MenuItem key={objective} value={objective}>
                                                    {objective}
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

                    {/* Renderizado de la data filtrada */}
                    <Grid item xs={12}>
                        {filteredData.map((obj) => (
                            <Grid key={obj.idemp} container direction="column" sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="subtitle1" color="inherit">
                                        {obj.nombreObjetivoEmpresarial}{' '}
                                        {selectedObjective && `- ${obj.usuarios.length} Persona(s)`}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <LinearProgress
                                        variant="determinate"
                                        value={obj.avance}
                                        color={getColor(obj.avance)}
                                        sx={{ height: 10, borderRadius: 5, mt: 1 }}
                                    />
                                </Grid>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                    {obj.avance}%
                                </Typography>
                                {/* Si se han seleccionado tanto objetivo como período, se muestran los usuarios asociados */}
                                {selectedObjective && selectedPeriod && (
                                    <>
                                        <Typography variant="h5" color="textSecondary" sx={{ mt: 1 }}>
                                            Personas asociadas:
                                        </Typography>
                                        {obj.usuarios.map((usuario, index) => (
                                            <Grid key={index} container direction="column" sx={{ ml: 2, mt: 1 }}>
                                                <Grid container justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="textSecondary">
                                                        {usuario.nombre} {usuario.apellido}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {usuario.avance}%
                                                    </Typography>
                                                </Grid>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={usuario.avance}
                                                    color={getColor(usuario.avance)}
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



