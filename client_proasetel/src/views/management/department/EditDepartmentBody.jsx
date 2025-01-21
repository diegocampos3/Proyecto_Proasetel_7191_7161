import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';

// Material-UI
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const EditDepartmentBody = ({ row, onValuesChange, setIsFormValid }) => {
    const EventSchema = Yup.object().shape({
        nombre: Yup.string()
            .min(6, 'El nombre debe tener al menos 6 caracteres')
            .max(30, 'El nombre no puede tener más de 30 caracteres')
            .required('El nombre es obligatorio'),
        descripcion: Yup.string()
            .min(50, 'La descripción debe tener al menos 80 caracteres')
            .max(300, 'La descripción no puede tener más de 300 caracteres')
            .required('La descripción es obligatoria'),
    });

    const formik = useFormik({
        initialValues: {
            nombre: row?.nombre || '',
            descripcion: row?.descripcion || '',
        },
        validationSchema: EventSchema,
        onSubmit: (values) => {
            onValuesChange(values);
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = formik;

    // Sincronizar los valores y la validez de Formik con el callback
    useEffect(() => {
        onValuesChange(values);
        setIsFormValid(isValid); // Actualizar el estado de la validez
    }, [values, isValid, onValuesChange, setIsFormValid]);

    return (
        <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="nombre"
                                    value={values.nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.nombre && errors.nombre)}
                                    helperText={touched.nombre && errors.nombre}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    name="descripcion"
                                    value={values.descripcion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.descripcion && errors.descripcion)}
                                    helperText={touched.descripcion && errors.descripcion}
                                    multiline
                                    InputProps={{
                                        sx: {
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word',
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Form>
        </FormikProvider>
    );
};

EditDepartmentBody.propTypes = {
    row: PropTypes.object.isRequired,
    onValuesChange: PropTypes.func.isRequired,
    setIsFormValid: PropTypes.func.isRequired, // Asegúrate de recibir setIsFormValid
};

export default EditDepartmentBody;
