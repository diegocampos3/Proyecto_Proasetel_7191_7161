import { useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
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
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { addFeedback } from 'store/slices/feedback';
import { addBusinessObj } from 'store/slices/businessobj';



const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));


// -------------------------------------------------

const AddFeedback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const location = useLocation();

    // Estado para Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const initialData = location.state?.feedback

    console.log('Imprimiendo Initial Data', initialData)

    // Validación del formulario
    const BusinessObjSchema = Yup.object().shape({
        description: Yup.string()
            .min(50, 'La descripción debe tener al menos 100 caracteres')
            .max(150, 'La descripción debe tener máximo 500 caracteres')
            .required('La descripción es obligatoria.'),
    });

    // Manejar el envío del formulario
    const formik = useFormik({
        initialValues: {
            description: '',
        },
        validationSchema: BusinessObjSchema,
        onSubmit: async (values, {  setSubmitting }) => {
            try {

                const data = {
                    peridoEvaId: location.state?.feedback?.idPeriodoEva,
                    descripcion: values.description,

                }

                console.log("Inprimiendo data:", data)

                const result = await dispatch(addFeedback (data));

                if (result.success) {
                    setSnackbarMessage('Evaluación exitosa');
                    setSnackbarSeverity('success');
                    setTimeout(() => navigate('/evaluated-staff/feedback'), 2000);
                } else {
                    setSnackbarMessage(result.error);
                    setSnackbarSeverity('error');
                }

                setSnackbarOpen(true);
                setSubmitting();
            } catch (error) {
                console.error(error);
                setSnackbarMessage('Error inesperado.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        },
    });

    const { values, errors, touched, handleSubmit, handleChange, isSubmitting } = formik;

    return (
        <MainCard
            title="Evaluación a su supervisor"
        >
            <form onSubmit={handleSubmit}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                    <SubCard title="Instrucciones para Redactar la Evaluación del Supervisor">
                        <CardContent sx={{ fontFamily: '"Roboto", sans-serif', color: '#555', p: 3 }}>
                            <h3 style={{ color: '#03A9F4', fontWeight: 'bold' }}>Estimado usuario, para realizar una evaluación efectiva, considera las siguientes recomendaciones:</h3>
                            <ul style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginTop: '10px' }}>
                                <li><strong>Sea objetivo</strong>: Céntrate en hechos y comportamientos observables, evitando comentarios personales o subjetivos.</li>
                                <li><strong>Proporcione ejemplos específicos</strong>: Siempre que sea posible, incluye ejemplos concretos que respalden sus comentarios, ya sean positivos o negativos.</li>
                                <li><strong>Sea respetuoso</strong>: Mantén un tono profesional y respetuoso, incluso cuando se mencionen áreas de mejora.</li>
                            </ul>
                            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e1f5fe', borderRadius: '8px' }}>
                                <h4 style={{ color: '#039BE5', fontWeight: 'bold' }}>Ejemplo de evaluación constructiva:</h4>
                                <p style={{ fontStyle: 'italic', color: '#039BE5' }}>
                                    <strong>Evaluación:</strong> "Ha demostrado un buen liderazgo al asignar tareas claras al equipo. Sin embargo, podria mejorar en la retroalimentación continua, ofreciendo comentarios más frecuentes y específicos sobre el desempeño de los empleados."
                                </p>
                            </div>
                        </CardContent>
                    </SubCard>
                    </Grid>

                    <Grid item xs={12}>
                        <SubCard title="Cuales son sus principales espectativas que tiene de su Supervisor-Evaluador">
                            
                            <TextField
                                fullWidth
                                label="Escriba sus perspectivas"
                                multiline
                                rows={4}
                                {...formik.getFieldProps('description')}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                sx={{ mt: 2 }}
                            />
                        </SubCard>
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/evaluated-staff/feedback')}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                Guardar Evaluación
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

export default AddFeedback;

