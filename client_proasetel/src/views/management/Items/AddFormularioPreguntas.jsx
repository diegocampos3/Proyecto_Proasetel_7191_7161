// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPregunta } from 'store/slices/formularioPregunta'; // Importa la acción addPregunta
import { useNavigate } from 'react-router-dom'; // Para redirigir después de guardar
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ==============================|| ANADIR - PREGUNTAS PARA FORMULARIO ||============================== //

const AddItem = () => {

    const { idFormulario } = useParams(); // Captura el idFormulario desde la URL
    const [pregunta, setPregunta] = React.useState(''); // Estado para almacenar la pregunta
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook para redirigir

    // Estados para el Snackbar
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success'); // 'success', 'error', 'warning', 'info'


    const handlePreguntaChange = (event) => {
        setPregunta(event.target.value); // Actualiza el estado con la pregunta ingresada
    };

    const handleGuardar = async () => {
        if (!pregunta.trim()) {
            setSnackbarMessage('Por favor, ingrese una pregunta.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const nuevaPregunta = {
            idFormulario,
            pregunta,
        };

        const result = await dispatch(addPregunta(nuevaPregunta)); // Envía la pregunta al servidor

        if (result.success) {
            setSnackbarMessage('Pregunta guardada exitosamente.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate(`/management/Items/FormularioPreguntasList/${idFormulario}`); // Redirige al listado de preguntas
            }, 1200); // Redirige después de 2 segundos
        } else {
            setSnackbarMessage('Error al guardar la pregunta: ' + result.error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <MainCard title="Añadir nueva pregunta" sx={{ '& .MuiCardContent-root': { p: 0 } }}>
            <Box sx={{ p: 2.5 }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Ingrese la pregunta"
                            multiline
                            rows={2}
                            value={pregunta} // Vincula el valor al estado
                            onChange={handlePreguntaChange} // Actualiza el estado cuando cambia el texto
                        />
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Divider />
            <Box sx={{ p: 1 }}>
            </Box>
            <Stack sx={{ px: 2.5, pb: 0.5 }} spacing={1} direction="row" justifyContent="end">
                <AnimateButton>
                    <Button variant="contained" size="large" onClick={handleGuardar}>
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
    );
};

export default AddItem;
