import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// Datos simulados de satisfacción por departamento y periodo
const satisfactionData = {
  all: {
    '2023-Q1': { Bueno: 120, Malo: 30 },
    '2023-Q2': { Bueno: 100, Malo: 50 },
    '2023-Q3': { Bueno: 110, Malo: 40 }
  },
  "1": {
    '2023-Q1': { Bueno: 20, Malo: 80 },
    '2023-Q2': { Bueno: 30, Malo: 70 },
    '2023-Q3': { Bueno: 40, Malo: 60 }
  },
  "2": {
    '2023-Q1': { Bueno: 80, Malo: 20 },
    '2023-Q2': { Bueno: 70, Malo: 30 },
    '2023-Q3': { Bueno: 90, Malo: 10 }
  },
  "3": {
    '2023-Q1': { Bueno: 60, Malo: 15 },
    '2023-Q2': { Bueno: 50, Malo: 20 },
    '2023-Q3': { Bueno: 55, Malo: 25 }
  }
};

const departments = [
  { id: 'all', name: 'Todos' },
  { id: '1', name: 'Ventas' },
  { id: '2', name: 'Marketing' },
  { id: '3', name: 'Soporte' }
];

const periods = [
  { id: '2023-Q1', name: '2023 - Q1' },
  { id: '2023-Q2', name: '2023 - Q2' },
  { id: '2023-Q3', name: '2023 - Q3' },
  { id: 'all', name: 'Todos' } // Opción para "Todos"
];

const SupervisorSatisfactionPieChart = ({ isLoading }) => {
  const theme = useTheme();
  const [selectedDept, setSelectedDept] = useState('all');  // Iniciar con 'all'
  const [selectedPeriod, setSelectedPeriod] = useState('all');  // Iniciar con 'all'
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    // Obtener los datos según el departamento y el periodo seleccionado
    let data = { Bueno: 0, Malo: 0 };

    if (selectedPeriod === 'all') {
      // Si el periodo es 'Todos', promediamos todos los periodos
      const allPeriodsData = satisfactionData[selectedDept];
      let totalBueno = 0;
      let totalMalo = 0;
      let count = 0;

      // Sumar los valores de todos los periodos
      Object.keys(allPeriodsData).forEach((period) => {
        totalBueno += allPeriodsData[period].Bueno;
        totalMalo += allPeriodsData[period].Malo;
        count++;
      });

      // Calcular el promedio
      data = {
        Bueno: totalBueno / count,
        Malo: totalMalo / count
      };
    } else {
      // Si no es 'Todos', obtenemos los datos del periodo seleccionado
      data = satisfactionData[selectedDept] && satisfactionData[selectedDept][selectedPeriod]
        ? satisfactionData[selectedDept][selectedPeriod]
        : { Bueno: 0, Malo: 0 };
    }

    setChartSeries([data.Bueno, data.Malo]); // Asignar los datos filtrados

    setChartOptions({
      chart: { type: 'pie', height: 350 },
      labels: ['Bueno', 'Malo'],
      colors: [theme.palette.success.main, theme.palette.error.main],
      tooltip: { theme: theme.palette.mode },
      legend: { position: 'bottom' }
    });
  }, [selectedDept, selectedPeriod, theme]);

  return (
    <MainCard title="Satisfacción de Evaluadores hacia Supervisores">
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={4}>
          <TextField
            select
            fullWidth
            label="Departamento"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            select
            fullWidth
            label="Periodo"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map((period) => (
              <MenuItem key={period.id} value={period.id}>
                {period.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      {isLoading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="pie" height={350} />
      )}
    </MainCard>
  );
};

export default SupervisorSatisfactionPieChart;
