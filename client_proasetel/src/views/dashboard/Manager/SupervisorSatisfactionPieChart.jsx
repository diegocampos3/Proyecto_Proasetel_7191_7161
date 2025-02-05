import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { getSatisfaction } from 'store/slices/feedback';
import { dispatch, useSelector } from 'store';

const SupervisorSatisfactionPieChart = ({ isLoading }) => {
  const theme = useTheme();

  // Estados para los filtros
  const [selectedDept, setSelectedDept] = useState('all');   // Por defecto "all"
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // Por defecto "all"
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  // Obtenemos la data real desde el slice (la data tiene el formato indicado)
  const { satisfaction } = useSelector((state) => state.feedback);

  // Despachamos la acción para obtener la data al montar el componente
  useEffect(() => {
    dispatch(getSatisfaction());
  }, []);

  // Generamos dinámicamente las opciones del select de departamentos a partir de la data,
  // excluyendo la clave "all" ya que se agregará manualmente.
  const departmentOptions = useMemo(() => {
    if (satisfaction) {
      return Object.keys(satisfaction).filter((dept) => dept !== 'all');
    }
    return [];
  }, [satisfaction]);

  // Generamos dinámicamente las opciones del select de periodos a partir del departamento seleccionado.
  // Si el departamento está seleccionado, usamos las claves del objeto correspondiente.
  const periodOptions = useMemo(() => {
    if (satisfaction && selectedDept && satisfaction[selectedDept]) {
      return Object.keys(satisfaction[selectedDept]).filter(
        (period) => period !== 'all'
      );
    }
    return [];
  }, [satisfaction, selectedDept]);

  // Actualizamos la data del gráfico cada vez que cambien los filtros o la data
  useEffect(() => {
    let data = { Bueno: 0, Malo: 0 };

    if (satisfaction && satisfaction[selectedDept]) {
      const deptData = satisfaction[selectedDept];

      if (selectedPeriod === 'all') {
        // Si "Todos" periodos, promediamos (o sumamos) los valores de todos los periodos
        let totalBueno = 0;
        let totalMalo = 0;
        let count = 0;
        Object.keys(deptData).forEach((period) => {
          totalBueno += deptData[period].Bueno;
          totalMalo += deptData[period].Malo;
          count++;
        });
        if (count > 0) {
          data = {
            Bueno: totalBueno / count,
            Malo: totalMalo / count,
          };
        }
      } else {
        // Si se selecciona un periodo específico
        data = deptData[selectedPeriod] || { Bueno: 0, Malo: 0 };
      }
    }

    setChartSeries([data.Bueno, data.Malo]);

    setChartOptions({
      chart: { type: 'pie', height: 350 },
      labels: ['Bueno', 'Malo'],
      colors: [theme.palette.success.main, theme.palette.error.main],
      tooltip: { theme: theme.palette.mode },
      legend: { position: 'bottom' },
    });
  }, [selectedDept, selectedPeriod, theme, satisfaction]);

  return (
    <MainCard title="Satisfacción de Evaluadores hacia Supervisores">
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        {/* Select de Departamento */}
        <Grid item xs={6} sm={4}>
          <TextField
            select
            fullWidth
            label="Departamento"
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              // Al cambiar el departamento, se resetea el periodo a "all"
              setSelectedPeriod('all');
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            {departmentOptions.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* Select de Periodo */}
        <Grid item xs={6} sm={4}>
          <TextField
            select
            fullWidth
            label="Periodo"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {periodOptions.map((period) => (
              <MenuItem key={period} value={period}>
                {period}
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
