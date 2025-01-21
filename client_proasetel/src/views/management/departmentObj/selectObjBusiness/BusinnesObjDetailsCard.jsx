import PropTypes from 'prop-types';
import React, { useState } from 'react';

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
import { addBusinessObjDep } from 'store/slices/departmentobj';

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ==============================|| BUSINESS OBJETIVES  DETAILS CARD ||============================== //

const BusinnesObjDetailsCard = ({ id, titulo, descripcion, select}) => {
    
    const theme = useTheme();

    // Estados para el modal
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

    // Mensaje de confirmación luego del modal
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');


   const handleSelectClick = () => {
    setOpenConfirmDialog(true);
   }

   const handleSnackbarClose = () => {
    setSnackbarOpen(false);
};

   // Add Business Obj - Department
   const handleBusinessObjDepAdd = async () => {

    const data = {
        objetivoEmprId: id
    }

    const result = await dispatch(addBusinessObjDep(data));
    
    if(result.success){
        setSnackbarMessage('Selección de Objetivo Empresarial Exitoso');
        setSnackbarSeverity('success');
    }else{
        setSnackbarMessage(result.error); 
        setSnackbarSeverity('error');
    }
    setOpenConfirmDialog(false);
    setSnackbarOpen(true);
   }

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
                    <Grid container spacing={gridSpacing}>
                        
                        
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Objetivo Empresarial_{id.slice(0,6)}</Typography>
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
                            fullWidth onClick={() => handleSelectClick(id)}
                            disabled={select}
                            >
                            {select ? "Objetivo seleccionado" : "Aceptar Objetivo"}  
                            </Button>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Card>
        {/* Modal de confirmación */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar Aceptación de Objetivo Empresarial</DialogTitle>
                <DialogContent>
                        <DialogContentText id="confirm-dialog-description">
                            ¿Está seguro de que desea aceptar el objetivo empresarial <strong>{capitalizeFirstLetters(titulo)}</strong>?
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="error" autoFocus>
                        Cancelar
                    </Button>
                    <Button 
                        color="primary"
                        onClick={handleBusinessObjDepAdd}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

        {/* Modal luego de la confirmación */}
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

BusinnesObjDetailsCard.propTypes = {
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
};

export default BusinnesObjDetailsCard;

