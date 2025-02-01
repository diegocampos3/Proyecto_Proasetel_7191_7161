import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Link, Navigate } from 'react-router-dom';


// project imports
import { gridSpacing } from 'store/constant';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import NotInterestedTwoToneIcon from '@mui/icons-material/NotInterestedTwoTone';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// Redux
import { dispatch } from 'store';
import { removeBusinessObjDep } from 'store/slices/departmentobj';

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ==============================|| BUSINESS OBJETIVES  DETAILS CARD ||============================== //

const BusinnesObjDetailsCard = ({idbp, id, titulo, descripcion, setListBusinessObj}) => {
    
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    // Trasladar a administración de objetivos
    const enviarData = {
        objEmpDepId: idbp,
        id,
        titulo
    }
    const handleSelectClick = () => {
        navigate('/evaluated-staff/staff-goals/departmentobj', {
            state: {objEmpDep: enviarData}
        })
    }

    return (
    <>
        <Card
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: 'primary.main'
                }
            }}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        
                        
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Objetivo Empresarial</Typography>
                    <Typography variant="h3">{capitalizeFirstLetters(titulo)}</Typography>
                    <Typography variant="caption">Titulo</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: 'grey.700' }}>
                        {descripcion}
                    </Typography>
                    <Typography variant="caption">Descripción<noscript></noscript></Typography>
                </Grid>  
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        
                        <Button 
                            variant="outlined"
                            fullWidth 
                            onClick={() => handleSelectClick()}
                        >
                            Objetivos Departamentales

                        </Button>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    </>
    );
};

BusinnesObjDetailsCard.propTypes = {
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
};

export default BusinnesObjDetailsCard;
