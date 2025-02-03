import React, { useLayoutEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal'; // Importa el componente Modal

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { useDispatch } from 'react-redux';
import { updatePregunta } from 'store/slices/formularioPregunta'; // Importa la acción updatePregunta

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Estilos para el modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

// ==============================|| PREGUNTAS FORMULARIOS - EDITAR ||============================== //

const EditFormularioPreguntas = ({ open, onClose, pregunta }) => {
    const dispatch = useDispatch();

    // Estados para el formulario
    const [preguntaText, setPreguntaText] = React.useState(pregunta ? pregunta.pregunta : '');

    // Estados para el Snackbar
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');


    // Actualiza el estado cuando cambia la prop `pregunta`
    useLayoutEffect(() => {
        if (pregunta) {
            snackbarOpen && setSnackbarOpen(false); // Cierra el Snackbar si está abierto
            setPreguntaText(pregunta.pregunta); // Actualiza el estado con la nueva pregunta
        } else {
            setPreguntaText(''); // Limpia el estado si no hay pregunta
        }
    }, [pregunta]); // Este efecto se ejecuta cada vez que `pregunta` cambia


    // Actualiza el estado cuando cambia el texto de la pregunta
    const handlePreguntaChange = (event) => {
        setPreguntaText(event.target.value);
    };


    // Guarda los cambios
    const handleGuardar = async () => {
        if (!preguntaText.trim()) {
            setSnackbarMessage('Por favor, ingrese una pregunta.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        
        const preguntaActualizada = {
            idFormulario: pregunta.formulario.idFormulario,
            pregunta: preguntaText,
        };

        // React.useEffect(() => {
        //     console.log('Valor actualizado de aaaaaaaaaaaaa:', preguntaActualizada);
        // }, [pregunta]);
        // console.log('Valor actualizado de aaaaaaaaaaaaa:', preguntaActualizada);

        const result = await dispatch(updatePregunta(pregunta.idPregunta, preguntaActualizada));

        if (result.success) {
            setSnackbarMessage('Pregunta actualizada exitosamente.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                onClose(); // Cierra el modal después de guardar
            }, 1200);
        } else {
            setSnackbarMessage('Error al actualizar la pregunta: ' + result.error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Cierra el Snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <MainCard title="Editar pregunta">
                    <Box sx={{ p: 2.5 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ingrese la pregunta"
                                    multiline
                                    rows={2}
                                    value={preguntaText}
                                    onChange={handlePreguntaChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Stack sx={{ px: 2.5, pb: 0.5 }} spacing={1.5} direction="row" justifyContent="end">
                        <AnimateButton>
                            {/* <Button variant="contained" size="large" onClick={handleGuardar}>
                                Guardar
                            </Button> */}
                            <Button  onClick={onClose} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={handleGuardar} color="error" autoFocus>
                                Guardar
                            </Button>
                        </AnimateButton>
                    </Stack>
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
                </MainCard>
            </Box>
        </Modal>
    );
};

export default EditFormularioPreguntas;