// BusinessObjectivesBarChart.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getAvanceDepartmentId } from 'store/slices/resultadoEvaluacion';
import { dispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';

const BusinessObjectivesBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState('all');
  const [objective, setObjective] = useState('all');
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [listAvance, setListAvance] = useState({}); // Cambiado a objeto

  const { user } = useAuth();
  const { avanceDepId } = useSelector((state) => state.resultadoEvaluacion);

  // Obtener datos iniciales
  useEffect(() => {
    dispatch(getAvanceDepartmentId(user?.departamento?.id));
  }, [dispatch, user?.departamento?.id]); // Añadida dependencia

  // Sincronizar listAvance con Redux
  useEffect(() => {
    setListAvance(avanceDepId || {});
  }, [avanceDepId]);

  // Generar periodos dinámicamente
  const periods = useMemo(() => {
    const objetivos = listAvance.objetivosEmpresariales || [];
    const uniquePeriods = [...new Set(objetivos.map(obj => obj.nombrePeriodo))];
    return [
      { value: 'all', label: 'Todos' },
      ...uniquePeriods.map(period => ({ value: period, label: period }))
    ];
  }, [listAvance]);

  // Generar objetivos dinámicamente
  const objectives = useMemo(() => {
    const objetivos = listAvance.objetivosEmpresariales || [];
    return [
      { value: 'all', label: 'Todos' },
      ...objetivos.map(obj => ({
        value: obj.idemp,
        label: obj.nombreObjetivoEmpresarial
      }))
    ];
  }, [listAvance]);

  // Actualizar gráfico
  useEffect(() => {
    const objetivos = listAvance.objetivosEmpresariales || [];
    let data = objetivos.map(obj => ({
      id: obj.idemp,
      name: obj.nombreObjetivoEmpresarial,
      progress: obj.avance,
      periodo: obj.nombrePeriodo
    }));

    // Aplicar filtros
    if (objective !== 'all') {
      data = data.filter(item => item.id === objective);
    }
    if (period !== 'all') {
      data = data.filter(item => item.periodo === period);
    }

    setChartSeries([{ 
      data: data.map(item => item.progress) 
    }]);
    
    setChartOptions({
      chart: { type: 'bar', height: 350 },
      xaxis: {
        categories: data.map(item => item.name)
      },
      colors: [theme.palette.primary.main],
      tooltip: { theme: theme.palette.mode }
    });
  }, [period, objective, theme, listAvance]);

  return (
    <MainCard title="Avance de Objetivos Empresariales">
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Periodo"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periods.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Objetivo"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          >
            {objectives.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      {isLoading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      )}
    </MainCard>
  );
};

export default BusinessObjectivesBarChart;