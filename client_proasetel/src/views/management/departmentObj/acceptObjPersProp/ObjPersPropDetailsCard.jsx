import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Link, Navigate } from 'react-router-dom';

// project imports
import { gridSpacing } from 'store/constant';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotInterestedTwoToneIcon from '@mui/icons-material/NotInterestedTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// Redux
import { dispatch } from 'store';
import { updateStaffObjProp } from 'store/slices/staffobj';

import { removeBusinessObjDep } from 'store/slices/departmentobj';

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ==============================|| PERSONAL OBJETIVES PROPUESTOS DETAILS CARD ||============================== //

const ObjPersPropDetailsCard = ({ id, titulo, descripcion, estado, aceptacion, setListStaffObjProp, tituloObjEmpr }) => {
    
    const theme = useTheme();

    // Estados para el modal
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [openRejectDialog, setOpenRejectDialog] = React.useState(false);

    const navigate = useNavigate();

    const handleConfirmClick = () => {
        setOpenConfirmDialog(true);
    }

    const handleRejectClick = () => {
        setOpenRejectDialog(true);
    }

    // Mensaje de confirmación luego del modal
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleConfirmObjPersProp = async () => {
        const data = {
            aceptacion: true,
        };


        const result = await dispatch(updateStaffObjProp(id, data));

        if (result.success) {
            setListStaffObjProp((prev) =>
                prev.map((obj) =>
                    obj.id === id ? { ...obj, aceptacion: true } : obj
                )
            );
            setSnackbarMessage('Objetivo confirmado exitosamente');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage(result.error);
            setSnackbarSeverity('error');
        }

        setOpenConfirmDialog(false);
        setSnackbarOpen(true);
    };

    const handleRejectObjPersProp = async () => {
        const data = {
            aceptacion: false,
        };

        const result = await dispatch(updateStaffObjProp(id, data));

        if (result.success) {
            setListStaffObjProp((prev) =>
                prev.map((obj) =>
                    obj.id === id ? { ...obj, aceptacion: false } : obj
                )
            );
            setSnackbarMessage('Objetivo rechazado exitosamente');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage(result.error);
            setSnackbarSeverity('error');
        }

        setOpenRejectDialog(false);
        setSnackbarOpen(true);
    };

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

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
                        <Typography variant="caption">Objetivo Personal</Typography>
                        <Typography variant="h3">{capitalizeFirstLetters(titulo)}</Typography>
                        <Typography 
                            variant="caption" 
                            sx={{
                                color: aceptacion === null ? 'grey' : 
                                    aceptacion ? '#00BFFF' : 'red'
                            }}
                        >
                            {aceptacion === null ? '...Revisión' : 
                            aceptacion ? 'Aceptado' : 'Rechazado'}
                        </Typography>

                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption">Descripción</Typography>
                        <Typography variant="h6" sx={{ color: 'grey.700' }}>
                            {descripcion}
                        </Typography>
                    </Grid>  
                    <Grid item xs={12}>
                        <Typography variant="caption">Objetivo Empresarial</Typography>
                        <Typography variant="h6" sx={{ color: 'grey.700' }}>
                            {capitalizeFirstLetters(tituloObjEmpr)}
                        </Typography>
                    </Grid>  
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    onClick={handleConfirmClick}
                                    disabled = {aceptacion === true}
                                >
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    fullWidth startIcon={<NotInterestedTwoToneIcon />}
                                    onClick={handleRejectClick}
                                    disabled = {aceptacion === false}

                                >
                                    Rechazar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>

            {/* Modal de confirmación de rechazo */}
            <Dialog
                open={openRejectDialog}
                onClose={() => setOpenRejectDialog(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar Rechazo de Objetivo Personal</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        ¿Está seguro de que desea rechazar el objetivo personal <strong>{capitalizeFirstLetters(titulo)}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRejectDialog(false)} color="error" autoFocus>
                        Cancelar
                    </Button>
                    <Button 
                        color="primary"
                        onClick={handleRejectObjPersProp}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de confirmación de aceptación */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar Aceptación de Objetivo Personal</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        ¿Está seguro de que desea confirmar el objetivo personal <strong>{capitalizeFirstLetters(titulo)}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="error" autoFocus>
                        Cancelar
                    </Button>
                    <Button 
                        color="primary"
                        onClick={handleConfirmObjPersProp}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar con mensaje de confirmación */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

ObjPersPropDetailsCard.propTypes = {
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
};

export default ObjPersPropDetailsCard;
