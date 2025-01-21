import { useState, forwardRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';

// Material-UI
import {
    Button,
    CardContent,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Snackbar,
    Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { updateBusinessObj } from 'store/slices/businessobj'; 

const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const EditBusinessObj = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Cargar datos iniciales
    const initialData = location.state?.objetivo || {
        titulo: '',
        descripcion: '',
        estado: false,
    };

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    useEffect(() => {
        if (location.state?.objetivo) {
            formik.setValues({
                title: capitalizeFirstLetters(location.state.objetivo.titulo),
                description: location.state.objetivo.descripcion,
                status: location.state.objetivo.estado,
            });
        }
    }, [location.state]);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    // Validación del formulario
    const validationSchema = Yup.object({
        title: Yup.string()
            .min(10, 'El título debe tener al menos 10 caracteres')
            .max(30, 'El título debe tener máximo 30 caracteres')
            .required('El título es obligatorio.'),
        description: Yup.string()
            .min(50, 'La descripción debe tener al menos 50 caracteres')
            .max(150, 'La descripción debe tener máximo 150 caracteres')
            .required('La descripción es obligatoria.'),
        status: Yup.boolean().required('El estado es obligatorio.'),
    });

    const formik = useFormik({
        initialValues: {
            title: initialData.titulo,
            description: initialData.descripcion,
            status: initialData.estado,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const data = {
                    titulo: values.title,
                    descripcion: values.description,
                    estado: values.status,
                };

                const result = await dispatch(updateBusinessObj(initialData.id, data));

                if (result.success) {
                    setSnackbarMessage('El objetivo fue editado con éxito.');
                    setSnackbarSeverity('success');
                    setTimeout(() => navigate('/management/businessobj'), 1000);
                } else {
                    setSnackbarMessage(result.error || 'Error al editar el objetivo.');
                    setSnackbarSeverity('error');
                }
            } catch (error) {
                setSnackbarMessage('Error inesperado.');
                setSnackbarSeverity('error');
            } finally {
                setSnackbarOpen(true);
                setSubmitting(false);
            }
        },
    });

    const isInProgress = initialData.estado === true; 

    return (
        <MainCard title={
            <>
                Editar Objetivo Empresarial    
                <Typography variant="h3"component="span" sx={{ color: 'grey', fontWeight: 'normal', ml: 2 }}>
                    {initialData.id}
                </Typography>
            </>
        }>
            {isInProgress && (
                <Typography variant="h6" color="error" sx={{ marginBottom: 2 }}>
                    Este objetivo ya está en curso y no puede ser editado.
                </Typography>
            )}

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="Instrucciones para Redactar Objetivos SMART">
                            <CardContent sx={{ fontFamily: '"Roboto", sans-serif', color: '#555', p: 3 }}>
                                <h3 style={{ color: '#03A9F4', fontWeight: 'bold' }}>Estimado usuario, se requiere que los objetivos sigan el enfoque SMART:</h3>
                                <ul style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginTop: '10px' }}>
                                    <li><strong>S</strong>pecific (Específico): El objetivo debe ser claro y detallado.</li>
                                    <li><strong>M</strong>easurable (Medible): Debe tener criterios cuantificables.</li>
                                    <li><strong>A</strong>chievable (Alcanzable): Tiene que ser realista.</li>
                                    <li><strong>R</strong>elevant (Relevante): Debe ser importante para la empresa.</li>
                                    <li><strong>T</strong>ime-bound (Limitado en el tiempo): Debe tener un plazo de ejecución claro.</li>
                                </ul>
                                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e1f5fe', borderRadius: '8px' }}>
                                    <h4 style={{ color: '#039BE5', fontWeight: 'bold' }}>Ejemplo de cómo redactar un objetivo SMART:</h4>
                                    <p style={{ fontStyle: 'italic', color: '#039BE5' }}>
                                        <strong>Objetivo SMART:</strong> "Aumentar las ventas de la empresa en un 15% en los próximos 6 meses mediante la implementación de una nueva estrategia de marketing digital."
                                    </p>
                                </div>
                            </CardContent>
                        </SubCard>
                    </Grid>

                    <Grid item xs={12}>
                        <SubCard title="Editar Objetivo">
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Título del Objetivo"
                                        {...formik.getFieldProps('title')}
                                        error={formik.touched.title && Boolean(formik.errors.title)}
                                        helperText={formik.touched.title && formik.errors.title}
                                        disabled={isInProgress} // Deshabilitar si el objetivo está en curso
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Estado del Objetivo</InputLabel>
                                        <Select
                                            {...formik.getFieldProps('status')}
                                            error={formik.touched.status && Boolean(formik.errors.status)}
                                            disabled={isInProgress} // Deshabilitar si el objetivo está en curso
                                        >
                                            <MenuItem value={false}>Pendiente</MenuItem>
                                            <MenuItem value={true}>En Curso</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <TextField
                                fullWidth
                                label="Descripción del Objetivo"
                                multiline
                                rows={4}
                                {...formik.getFieldProps('description')}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                sx={{ mt: 2 }}
                                disabled={isInProgress} // Deshabilitar si el objetivo está en curso
                            />
                        </SubCard>
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/management/businessobj')}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={formik.isSubmitting || isInProgress} // Deshabilitar el botón de guardar si está en curso
                            >
                                Guardar Cambios
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

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

export default EditBusinessObj;


