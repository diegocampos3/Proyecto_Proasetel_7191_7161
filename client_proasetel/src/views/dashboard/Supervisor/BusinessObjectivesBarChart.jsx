// BusinessObjectivesBarChart.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const periods = [
  { value: 'all', label: 'Todos' },
  { value: '2024-Q1', label: '2024-Q1' },
  { value: '2024-Q2', label: '2024-Q2' }
];

const objectives = [
  { value: 'all', label: 'Todos' },
  { value: '1', label: 'Objetivo 1' },
  { value: '2', label: 'Objetivo 2' },
  { value: '3', label: 'Objetivo 3' }
];

const BusinessObjectivesBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState('all');
  const [objective, setObjective] = useState('all');
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    // Simular llamada a API para obtener datos filtrados por periodo y objetivo
    // Datos simulados: cada objeto tiene el nombre del objetivo y su porcentaje de avance.
    let data = [
      { id: '1', name: 'Objetivo 1', progress: 70, periodo: '2024-Q1' },
      { id: '2', name: 'Objetivo 2', progress: 50, periodo: '2024-Q1' },
      { id: '3', name: 'Objetivo 3', progress: 85, periodo: '2024-Q2' }
    ];

    // Filtro por objetivo (si no es "all")
    if (objective !== 'all') {
      data = data.filter((item) => item.id === objective);
    }
    // Filtro por periodo (si no es "all")
    if (period !== 'all') {
      data = data.filter((item) => item.periodo === period);
    }

    setChartSeries([
      {
        data: data.map((item) => item.progress)
      }
    ]);
    setChartOptions({
      chart: { type: 'bar', height: 350 },
      xaxis: {
        categories: data.map((item) => item.name)
      },
      colors: [theme.palette.primary.main],
      tooltip: { theme: theme.palette.mode }
    });
  }, [period, objective, theme]);

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
