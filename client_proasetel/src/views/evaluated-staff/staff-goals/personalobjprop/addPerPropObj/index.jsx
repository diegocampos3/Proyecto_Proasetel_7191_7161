import { useState, forwardRef, useEffect } from 'react';
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
import { addObjDep } from 'store/slices/departmentobj';
import { addStaffObjProp } from 'store/slices/staffobj';
import { getBusinessObjDep } from 'store/slices/departmentobj';

// Redux
import { dispatch, useSelector } from 'store';


const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));


// -------------------------------------------------

const AddPerPopObj = () => {

    const [listBusinessObj, setListBusinessObj] = useState([]); 
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const location = useLocation();

    const { businessObjs = [] } = useSelector((state) => state.departmentObj);


    useEffect(() => {
        if (Array.isArray(businessObjs)) {
            setListBusinessObj(businessObjs);
        } else {
            console.error("businessObjs no es un arreglo:", businessObjs);
        }
    }, [businessObjs]);

    useEffect(() => {
        dispatch(getBusinessObjDep());
    }, [dispatch]);
    
    console.log('Objetivos Empresariales', businessObjs)

   
    // Estado para Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => setSnackbarOpen(false);


    // Validación del formulario
    const BusinessObjSchema = Yup.object().shape({
        title: Yup.string()
            .min(10, 'El título debe tener al menos 10 caracteres')
            .max(30, 'El título debe tener máximo 30 caracteres')
            .required('El título es obligatorio.'),
        description: Yup.string()
            .min(50, 'La descripción debe tener al menos 50 caracteres')
            .max(150, 'La descripción debe tener máximo 150 caracteres')
            .required('La descripción es obligatoria.'),
        obj: Yup.string().required('El objetivo empresarial es obligatorio.')
        
        
    });

    // Manejar el envío del formulario
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            obj: '' ,
        },
        validationSchema: BusinessObjSchema,
        onSubmit: async (values, {  setSubmitting }) => {
            try {

                const data = {
                    titulo: values.title,
                    descripcion: values.description,
                    objtivoEmpDep: values.obj
                    
                }

                console.log("Inprimiendo data  de inclusión objperprop:", data)

                const result = await dispatch(addStaffObjProp(data));

                if (result.success) {
                    setSnackbarMessage('El objetivo fue creado con éxito.');
                    setSnackbarSeverity('success');
                    setTimeout(() => navigate('/evaluated-staff/staff-goals/personalobjprop'), 2000);
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

    const capitalizeFirstLetters = (str) => {

        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <MainCard
            title="Crear Objetivo Personal"
        >
            <form onSubmit={handleSubmit}>
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
                        <SubCard title="Nuevo Objetivo">
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Título del Objetivo"
                                        {...formik.getFieldProps('title')}
                                        error={touched.title && Boolean(errors.title)}
                                        helperText={touched.title && errors.title}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                    <InputLabel>Objetivo Empresarial</InputLabel>
                                    <Select
                                        {...formik.getFieldProps('obj')}
                                        error={formik.touched.obj && Boolean(formik.errors.obj)}
                                    >
                                        {listBusinessObj.length > 0 ? (
                                            listBusinessObj.map((obj) => (
                                                <MenuItem key={obj.idbp} value={obj.idbp}>
                                                    {capitalizeFirstLetters(obj.titulo)}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">Ninguno</MenuItem>
                                        )}
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
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                sx={{ mt: 2 }}
                            />
                        </SubCard>
                    </Grid>

                    <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={() => navigate('/evaluated-staff/staff-goals/personalobjprop')}>
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
                                Guardar Objetivo
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

export default AddPerPopObj;


