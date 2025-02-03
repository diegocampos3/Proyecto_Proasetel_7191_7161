import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useAddFormulario } from 'store/slices/formulario';


// animation
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);


const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));


// ==============================|| ANADIR NUEVO FORMULARIO ||============================== //

const FormularioAdd = ({ open, handleCloseDialog, isOpen }) => {

    const addFormulario = useAddFormulario();

    // Estado para Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => setSnackbarOpen(false);

    // Validación del formulario
    const FormularioSchema = Yup.object().shape({
        title: Yup.string()
            .min(5, 'El título debe tener al menos 5 caracteres')
            .max(50, 'El título debe tener máximo 50 caracteres')
            .required('El título es obligatorio.'),
        description: Yup.string()
            .min(20, 'La descripción debe tener al menos 20 caracteres')
            .required('La descripción es obligatoria.'),
    });

   // Manejo del envío del formulario
   const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            status: false ,
        },
        validationSchema: FormularioSchema,
        onSubmit: async (values, {  setSubmitting, resetForm }) => {
            try {

                const data = {
                    nombre: values.title,
                    descripcion: values.description,
                    estado: values.status
                }

                console.log("Inprimiendo data:", data)

                const result = await addFormulario(data);

                if (result.success) {
                    setSnackbarMessage('El formulario fue creado con éxito.');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                    resetForm();
                    setTimeout(() => handleCloseDialog(), 1000);
                } else {
                    setSnackbarMessage(result.error);
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                }

                setSubmitting(false);
            } catch (error) {
                console.error(error);
                setSnackbarMessage('Error inesperado.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    const { errors, touched, handleSubmit, resetForm } = formik;

    useLayoutEffect(() => {
        if (isOpen) {
            setSnackbarOpen(false);
            resetForm();
        }
    }, [isOpen, resetForm]);


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            fullScreen
            sx={{
                '&>div:nth-of-type(3)': {
                    justifyContent: 'flex-end',
                    '&>div': {
                        m: 0,
                        borderRadius: '0px',
                        maxWidth: 450,
                        height: '100%',
                    }
                }
            }}
        >
            {open && (
                <>
                    <DialogTitle>Añadir Formulario</DialogTitle>
                    <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic1" fullWidth label="Ingrese el nombre del formulario*" 
                                {...formik.getFieldProps('title')}
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                                defaultValue="Nombre formulario" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic2"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Ingrese la descripción del formulario*"
                                    {...formik.getFieldProps('description')}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                    defaultValue="Descripción del formulario"
                                />
                            </Grid>
                        </Grid>
                    
                    </DialogContent>
                    <DialogActions>
                        <AnimateButton>
                            <Button type="submit" variant="contained">Crear</Button>
                        </AnimateButton>
                        <Button variant="text" color="error" onClick={handleCloseDialog}>
                            Cerrar
                        </Button>
                    </DialogActions>
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
                </>
            )}
        </Dialog>
    );
};

FormularioAdd.propTypes = {
    open: PropTypes.bool,
    handleCloseDialog: PropTypes.func,
    onAdd: PropTypes.func.isRequired
};

export default FormularioAdd;
