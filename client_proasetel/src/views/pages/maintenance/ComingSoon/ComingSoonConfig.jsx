// material-ui
import { useTheme, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { useEffect } from 'react';

// third party
import { useTimer } from 'react-timer-hook';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { ThemeMode } from 'config';
import { gridSpacing } from 'store/constant';
import { getPeriodos } from 'store/slices/periodo';

// assets
import imageGrid from 'assets/images/maintenance/img-soon-grid.svg';
import imageDarkGrid from 'assets/images/maintenance/img-soon-grid-dark.svg';
import imageBlock from 'assets/images/maintenance/img-soon-block.svg';
import imageBlueBlock from 'assets/images/maintenance/img-soon-blue-block.svg';
import imagePurpleBlock from 'assets/images/maintenance/img-soon-purple-block.svg';

import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';

// styles
const CardMediaWrapper = styled('div')({
    maxWidth: 720,
    margin: '0 auto',
    position: 'relative'
});

const PageContentWrapper = styled('div')({
    maxWidth: 450,
    margin: '0 auto',
    textAlign: 'center'
});

const TimerWrapper = styled('div')({
    maxWidth: 450,
    margin: '0 auto'
});

const ComingSoonCard = styled(Card)({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const TimeBlock = styled('div')(({ theme }) => ({
    background: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark.main : theme.palette.secondary.light,
    color: theme.palette.mode === ThemeMode.DARK ? theme.palette.dark.light : theme.palette.secondary.main,
    borderRadius: '12px',
    padding: '24px 0',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '3rem'
}));

const CardMediaBlock = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '8s blink ease-in-out infinite'
});

const CardMediaBlue = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '15s wings ease-in-out infinite'
});

const CardMediaPurple = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '12s wings ease-in-out infinite'
});

// ===========================|| COMING SOON 2 ||=========================== //

const ComingSoonConfig = () => {

    //para el control de la muestra segun fecha
    const dispatch = useDispatch();
    const theme = useTheme();
    const { periodos, isLoading, error } = useSelector((state) => state.periodo);
    const [tiempo, setTiempo] = React.useState(null);
    const [isWithinPeriod, setIsWithinPeriod] = React.useState(false);

    useEffect(() => {
        dispatch(getPeriodos());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && periodos) {
          const periodoActivo = periodos.find(periodo => periodo.estado === true);
          
    
          if (periodoActivo) {
            try {
              const baseDate = new Date(periodoActivo.fecha_ini_config);              
                setTiempo(baseDate);
            } catch (error) {
              console.error('Error al procesar fechas:', error);
            }
          }
        }
    }, [isLoading, periodos]);

    //console.log('EEEEEEEEEEEEEEEEEEEee', tiempo)
    const { seconds, minutes, hours, days, restart  } = useTimer({ expiryTimestamp: tiempo || new Date(), autoStart: false});

    
    React.useEffect(() => {
        if (tiempo) {
        const newTime = new Date(tiempo);
        restart(newTime);
        }
    }, [tiempo, restart]);


    return (
        <ComingSoonCard>
            <CardContent>
                <Grid container justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <PageContentWrapper>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Typography variant="h1">Próximamente...</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">El periodo de configuración comenzará en ...</Typography>
                                </Grid>
                            </Grid>
                        </PageContentWrapper>
                    </Grid>
                    <Grid item xs={12}>
                        <CardMediaWrapper>
                            <CardMedia
                                component="img"
                                image={theme.palette.mode === ThemeMode.DARK ? imageDarkGrid : imageGrid}
                                title="Slider5 image"
                            />
                            <CardMediaBlock src={imageBlock} title="Slider 1 image" />
                            <CardMediaBlue src={imageBlueBlock} title="Slider 2 image" />
                            <CardMediaPurple src={imagePurpleBlock} title="Slider 3 image" />
                        </CardMediaWrapper>
                    </Grid>
                    <Grid item xs={12}>
                        <TimerWrapper>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={3}>
                                    <TimeBlock>{days}</TimeBlock>
                                </Grid>
                                <Grid item xs={3}>
                                    <TimeBlock>{hours}</TimeBlock>
                                </Grid>
                                <Grid item xs={3}>
                                    <TimeBlock>{minutes}</TimeBlock>
                                </Grid>
                                <Grid item xs={3}>
                                    <TimeBlock>{seconds}</TimeBlock>
                                </Grid>
                            </Grid>
                        </TimerWrapper>
                    </Grid>
                    <Grid item xs={12}>
                        <PageContentWrapper>
                            {/* <Grid container spacing={gridSpacing} alignItems="center">
                                <Grid item xs zeroMinWidth>
                                    <TextField fullWidth label="Email Address" />
                                </Grid>
                                <Grid item>
                                    <AnimateButton>
                                        <Button variant="contained" size="large">
                                            <NotificationsActiveTwoToneIcon sx={{ fontSize: '1.3rem', mr: 0.75 }} /> Notify Me
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid> */}
                        </PageContentWrapper>
                    </Grid>
                </Grid>
            </CardContent>
        </ComingSoonCard>
    );
};

export default ComingSoonConfig;
