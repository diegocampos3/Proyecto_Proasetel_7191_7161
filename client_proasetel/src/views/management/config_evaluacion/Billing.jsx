import React from 'react';
import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'store';

// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Snackbar, Alert } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { getFormularios, useUpdateFormulario } from 'store/slices/formulario';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';


// ==============================|| PROFILE 2 - BILLING ||============================== //

const Billing = () => {
    const [city, setCity] = React.useState('1');

    const[formulario,setFormulario]= React.useState(''); 

    //fuera para el guardado del formulario seleccionado
    const dispatch = useDispatch();
    const updateFormulario = useUpdateFormulario(); 
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    //Para los mensajes de confirmacion 
    const handleSnackbarClose = () => setSnackbarOpen(false);


    const handleChangeCity = (event) => {
        // setCity(event.target.value);
        setFormulario(event.target.value);
    };

    const [Country, setCountry] = React.useState('1');
    const handleSelectChange1 = (event) => {
        setCountry(event.target.value);
    };

    const [state1, setState1] = React.useState({
        checkedA: true
    });
    const handleChangeState1 = (event) => {
        setState1({ ...state1, [event.target.name]: event.target.checked });
    };

    //traer los formularios
    const { formularios } = useSelector((state) => state.formulario)
    const [listFormularios, setListFormularios] = useState([]) 

    
    useEffect(() => {
        setListFormularios(formularios.filter((formulario) => formulario.estado === 1));
    }, [formularios]);

    //console.log('aaaaaaa', listFormularios)

    useEffect(() => {
        dispatch(getFormularios());
    }, []);

    // const handleGuardar = () => {
    //     if (formulario) {
    //         const updateFormularioDto = { estado: 2 };
    //         const result = dispatch(useUpdateFormulario({ formulario, updateFormularioDto }))
    //         // const result = await updateFormulario(formulario, updateFormularioDto);
    //         if (result.success) {
    //             // Si la actualización fue exitosa, actualizar la lista de formularios
    //             dispatch(getFormularios());
    //             setFormulario(''); // Limpiar la selección
    //         } else {
    //             console.error('Error al actualizar el formulario:', result.error);
    //         }
    //     }
    // };

    //----------- ESTABLECER COMO FORMULARIO DE ESTE PERIODO -----------------

    const handleConfirmGuardar = () => {
        setOpenConfirmDialog(true); // Abrir el diálogo de confirmación
    };

    const handleConfirmDialogClose = () => {
        setOpenConfirmDialog(false); // Cerrar el diálogo de confirmación
    };

    const handleConfirmDialogAccept = () => {
        setOpenConfirmDialog(false); // Cerrar el diálogo de confirmación
        handleGuardar(); // Ejecutar la función handleGuardar
    };

    // Obtener el nombre del formulario seleccionado
    const selectedFormulario = listFormularios.find((f) => f.idFormulario === formulario);

    const handleGuardar = async () => {
        if (formulario) {
            const updateFormularioDto = { estado: 2 }; // Solo actualizamos el estado a 2
            const result = await updateFormulario(formulario, updateFormularioDto); // Usar la función del hook

            if (result.success) {
                // Si la actualización fue exitosa, actualizar la lista de formularios
                dispatch(getFormularios());
                setFormulario(''); // Limpiar la selección
                setSnackbarMessage('Formulario definido satisfactoriamente para este Periodo');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                console.error('Error al actualizar el formulario:', result.error);
            }

        }
    };

//----------- FIN ESTABLECER COMO FORMULARIO DE ESTE PERIODO -----------------


    return (
        <Grid container spacing={gridSpacing}>

            <Grid item xs={12} sm={12}>
                <TextField id="standard-select-category" select label="Seleccione un formulario" value={formulario} fullWidth onChange={handleChangeCity}>
                    {listFormularios.map((option) => (
                        <MenuItem key={option.idFormulario} value={option.idFormulario}>
                            {option.nombre}
                        </MenuItem>
                    ))}
                </TextField>

            </Grid>
            <Grid item xs={12} sm={12}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleConfirmGuardar}
                    disabled={!formulario}
                >
                    Guardar
                </Button>
            </Grid>

            {/* Diálogo de confirmación */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleConfirmDialogClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar acción</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        ¿Está seguro de que desea establecer el formulario{' '}
                        <strong>{selectedFormulario?.nombre}</strong> como definitivo para este período de evaluación?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDialogAccept} color="primary" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default Billing;
