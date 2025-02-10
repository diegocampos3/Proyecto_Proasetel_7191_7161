import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getSatisfactionDepart } from 'store/slices/feedback';
import useAuth from 'hooks/useAuth';

const SupervisorSatisfactionPieChart = ({ isLoading }) => {
  const theme = useTheme();
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  // Se establece "Todo" como valor predeterminado del filtro
  const [period, setPeriod] = useState("Todo");
  const { user } = useAuth();

  const { satisfactionDepart } = useSelector((state) => state.feedback);

  useEffect(() => {
    if (user?.departamento?.id) {
      dispatch(getSatisfactionDepart(user.departamento.id));
    }
  }, [dispatch, user?.departamento?.id]);

  // Se determina qué llave utilizar:
  // Si satisfactionDepart tiene datos para el departamento del usuario, se usa esa llave; de lo contrario se utiliza "all"
  const departmentKey =
    satisfactionDepart && satisfactionDepart[user?.departamento?.id]
      ? user.departamento.id
      : 'all';

  // Extraemos la data de satisfacción para la llave seleccionada
  const satisfactionData =
    satisfactionDepart && satisfactionDepart[departmentKey]
      ? satisfactionDepart[departmentKey]
      : {};

  // Se crean las opciones del filtro: se agrega "Todo" de forma predeterminada y luego los eventos (períodos) disponibles
  const periodOptions = Array.from(new Set(['Todo', ...Object.keys(satisfactionData)]));

  // Si el período seleccionado ya no existe en periodOptions, se vuelve a "Todo"
  useEffect(() => {
    if (!periodOptions.includes(period)) {
      setPeriod("Todo");
    }
  }, [periodOptions, period]);

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value);
  };

  // Función que retorna los datos filtrados:
  // Si se selecciona "Todo", se agregan los valores de todos los períodos;
  // en caso contrario se retorna la data del período seleccionado.
  const filterData = (period) => {
    if (period === "Todo") {
      let aggregated = { Bueno: 0, Malo: 0 };
      Object.values(satisfactionData).forEach((item) => {
        aggregated.Bueno += item.Bueno;
        aggregated.Malo += item.Malo;
      });
      return aggregated;
    } else {
      return satisfactionData[period] || { Bueno: 0, Malo: 0 };
    }
  };

  useEffect(() => {
    const filteredData = filterData(period);
    setChartSeries([filteredData.Bueno, filteredData.Malo]);

    setChartOptions({
      chart: { type: 'pie', height: 350 },
      labels: ['Bueno', 'Malo'],
      colors: [theme.palette.success.main, theme.palette.error.main],
      tooltip: { theme: theme.palette.mode },
      legend: { position: 'bottom' },
    });
  }, [theme, period, satisfactionData]);

  return (
    <MainCard title="Nivel de Satisfacción">
      <Grid container direction="column" spacing={gridSpacing} style={{ minHeight: '400px' }}>
        {/* Filtro: Selección de Período */}
        <Grid item>
          <Grid container justifyContent="flex-start">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Período</InputLabel>
                <Select value={period} onChange={handleChangePeriod} label="Seleccionar Período">
                  {periodOptions.map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
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
