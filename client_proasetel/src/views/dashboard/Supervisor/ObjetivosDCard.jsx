import React, { useEffect, useState } from 'react';


// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TargetIcon from '@mui/icons-material/Flag'; 


// third-party

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { ThemeMode } from 'config';


const ObjetivosDCard = ({totalObj}) => {
    
    const theme = useTheme();
    
    return (
        <>
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'primary.dark',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        '&>div': {
                            position: 'relative',
                            zIndex: 5
                        },
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background:
                                theme.palette.mode === ThemeMode.DARK
                                    ? `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                                    : theme.palette.primary[800],
                            borderRadius: '50%',
                            top: { xs: -105, sm: -85 },
                            right: { xs: -140, sm: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background:
                                theme.palette.mode === ThemeMode.DARK
                                    ? `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 85.50%)`
                                    : theme.palette.primary[800],
                            borderRadius: '50%',
                            top: { xs: -155, sm: -125 },
                            right: { xs: -70, sm: -15 },
                            opacity: 0.5
                        }
                    }}
                >
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.800',
                                            color: '#fff',
                                            mt: 1
                                        }}
                                    >
                                        <TargetIcon sx={{ color: 'white', fontSize: '24px' }} /> {/* Ícono personalizado */}
                                    </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            {totalObj}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.mode === ThemeMode.DARK ? 'text.secondary' : 'primary.200'
                                    }}
                                >
                                    Total de Objetivos Departamentales Evaluados
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
        </>
    );
};

export default ObjetivosDCard;
