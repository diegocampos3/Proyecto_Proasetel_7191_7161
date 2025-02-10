// BusinessObjectivesBarChart.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getAvanceUser } from 'store/slices/resultadoEvaluacion';
import useAuth from 'hooks/useAuth';

const PerObjectivesBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // Estados para el filtro y configuración del gráfico
  const [period, setPeriod] = useState('all');
  const [objective, setObjective] = useState('all');
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [listAvanceUser, setAvanceUser] = useState({});

  // Extraemos la data del state
  const { avanceUser } = useSelector((state) => state.resultadoEvaluacion);

  useEffect(() => {
    setAvanceUser(avanceUser);
  }, [avanceUser]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAvanceUser(user.id));
    }
  }, [dispatch, user?.id]);

  console.log('ListAvanceUser:', listAvanceUser);

  // Extraemos el array de resultados; en este caso, cada objeto tiene:
  // - idObj, nombreObj, nombrePeriodo, avance, etc.
  const resultados = listAvanceUser?.resultados || [];

  // Generamos las opciones para el select de períodos a partir de los resultados
  const periodOptions = [
    { value: 'all', label: 'Todos' },
    ...Array.from(new Set(resultados.map((item) => item.nombrePeriodo))).map((period) => ({
      value: period,
      label: period
    }))
  ];

  // Generamos las opciones para el select de objetivos (usamos idObj como value y nombreObj como label)
  const objectiveOptions = [
    { value: 'all', label: 'Todos' },
    ...Array.from(
      new Map(resultados.map((item) => [item.idObj, item.nombreObj])).entries()
    ).map(([id, nombre]) => ({ value: id, label: nombre }))
  ];

  // Configuramos el gráfico cada vez que cambien los filtros o la data
  useEffect(() => {
    // Filtramos la data según el objetivo y el período seleccionados
    const filteredData = resultados.filter((item) => {
      const matchesObjective = objective === 'all' || item.idObj === objective;
      const matchesPeriod = period === 'all' || item.nombrePeriodo === period;
      return matchesObjective && matchesPeriod;
    });

    // Para el gráfico se usan:
    // - Categorías: el nombre del objetivo (nombreObj)
    // - Valores: el avance (avance)
    const categories = filteredData.map((item) => item.nombreObj);
    const seriesData = filteredData.map((item) => item.avance);

    setChartSeries([
      {
        data: seriesData
      }
    ]);

    setChartOptions({
      chart: { type: 'bar', height: 350 },
      xaxis: {
        categories: categories
      },
      colors: [theme.palette.primary.main],
      tooltip: { theme: theme.palette.mode }
    });
  }, [period, objective, resultados, theme]);

  return (
    <MainCard title="Avance de Objetivos">
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Periodo"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periodOptions.map((option) => (
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
            {objectiveOptions.map((option) => (
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

export default PerObjectivesBarChart;
