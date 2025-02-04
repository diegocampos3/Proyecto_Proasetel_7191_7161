import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const allSatisfactionData = {
  '2023-Q1': { Bueno: 100, Malo: 20 },
  '2023-Q2': { Bueno: 120, Malo: 30 },
  '2023-Q3': { Bueno: 140, Malo: 40 },
  '2023-Q4': { Bueno: 160, Malo: 50 },
  'Todo': { Bueno: 520, Malo: 140 }, // Datos acumulados de todo el año
}; // Datos agrupados por trimestre

const SupervisorSatisfactionPieChart = ({ isLoading }) => {
  const theme = useTheme();
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [period, setPeriod] = useState('Todo'); // Periodo seleccionado (por defecto 'Todo')

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value);
  };

  const filterData = (period) => {
    // Filtra los datos según el periodo seleccionado
    return allSatisfactionData[period] || allSatisfactionData['Todo'];
  };

  useEffect(() => {
    const filteredData = filterData(period); // Obtener datos filtrados por periodo
    setChartSeries([filteredData.Bueno, filteredData.Malo]);

    setChartOptions({
      chart: { type: 'pie', height: 350 },
      labels: ['Bueno', 'Malo'],
      colors: [theme.palette.success.main, theme.palette.error.main],
      tooltip: { theme: theme.palette.mode },
      legend: { position: 'bottom' },
    });
  }, [theme, period]);

  return (
    <MainCard title="Nivel de Satisfacción">
      <Grid container direction="column" spacing={gridSpacing} style={{ minHeight: '400px' }}>
        {/* Filtro en la parte superior izquierda */}
        <Grid item>
          <Grid container justifyContent="flex-start">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Período</InputLabel>
                <Select value={period} onChange={handleChangePeriod} label="Seleccionar Período">
                  <MenuItem value="Todo">Todo el Año</MenuItem>
                  <MenuItem value="2023-Q1">2023-Q1</MenuItem>
                  <MenuItem value="2023-Q2">2023-Q2</MenuItem>
                  <MenuItem value="2023-Q3">2023-Q3</MenuItem>
                  <MenuItem value="2023-Q4">2023-Q4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Contenedor para el gráfico */}
        <Grid item>
          {isLoading ? (
            <Typography>Cargando...</Typography>
          ) : (
            <Chart options={chartOptions} series={chartSeries} type="pie" height={350} />
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SupervisorSatisfactionPieChart;
