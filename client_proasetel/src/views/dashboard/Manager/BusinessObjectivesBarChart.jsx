import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getAvancePromedio } from 'store/slices/resultadoEvaluacion';

const BusinessObjectivesBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState('all');
  const [objective, setObjective] = useState('all');
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [listAvance, setListAvance] = useState([]);

  const { avance } = useSelector((state) => state.resultadoEvaluacion);

  console.log('listAvance:', listAvance)

  useEffect(() => {
    setListAvance(avance);
  }, [avance]);

  useEffect(() => {
    dispatch(getAvancePromedio());
  }, [dispatch]);

  useEffect(() => {
    let data = listAvance.map((item) => ({
      id: item.idObjetivoEmpresarial, // Corregido
      name: item.nombreObjetivoEmpresarial,
      progress: ((item.promedio_evaluado + item.promedio_supervisor) / 2).toFixed(2), // Corregido
      periodo: item.nombrePeriodo
    }));

    if (objective !== 'all') {
      data = data.filter((item) => item.id === objective);
    }
    if (period !== 'all') {
      data = data.filter((item) => item.periodo === period);
    }

    setChartSeries([
      {
        data: data.map((item) => parseFloat(item.progress))
      }
    ]);

    setChartOptions({
      chart: { type: 'bar', height: 350 },
      xaxis: {
        categories: data.map((item) => item.name)
      },
      colors: [theme.palette.primary.main],
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val) => `${val}%`
        }
      }
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
            <MenuItem value="all">Todos</MenuItem>
            {[...new Set(listAvance.map((item) => item.nombrePeriodo))].map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
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
            <MenuItem value="all">Todos</MenuItem>
            {listAvance.map((item) => (
              <MenuItem key={item.idObjetivoEmpresarial} value={item.idObjetivoEmpresarial}> {/* Corregido */}
                {item.nombreObjetivoEmpresarial}
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
