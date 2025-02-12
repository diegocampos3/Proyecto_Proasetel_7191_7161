import React, { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { MenuItem } from '@mui/material';

// ===========================|| FIREBASE - REGISTRO ||=========================== //

const JWTRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
    const { register } = useAuth();
    const [departments, setDepartments] = useState([]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const passwordRegex = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    useEffect(() => {
        changePassword('123456');
    }, []);

    // Traer los departamentos
    useEffect(() => {
        const fecthDepartaments = async () => {
            try {
                const apiUrl = import.meta.env.VITE_APP_API_URL2;
                const response = await axios.get(`${apiUrl}/departamentos`);

                // Verifica la estructura de la respuesta aquí
                console.log('Respuesta de la API:', response.data);

                // Asegúrate de que la respuesta sea un array de objetos con 'id' y 'nombre'
                const departamentsNames = response.data.map(department => ({
                    id: department.id,
                    nombre: department.nombre
                }));
                console.log('Departamentos:', departamentsNames);
                setDepartments(departamentsNames);
            } catch (error) {
                console.error('Error al traer los departamentos', error);
            }
        };

        fecthDepartaments();
    }, []);

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Regístrate con tu correo electrónico</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    nombres: '',
                    apellidos: '',
                    departamento: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Debe ser un email válido').max(50).required('Campo obligatorio'),
                    password: Yup.string()
                        .matches(passwordRegex, 'La contraseña debe tener por lo menos una letra mayúscula, una minúscula y un número.')
                        .min(8, 'La contraseña debe tener al menos 8 caracteres').required('Campo obligatorio'),
                    nombres: Yup.string().required('Campo obligatorio'),
                    apellidos: Yup.string().required('Campo obligatorio'),
                    departamento: Yup.string().required('Campo obligatorio'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await register(values.nombres, values.apellidos, values.email, values.password, values.departamento);
                            setStatus({ success: true });
                            setSubmitting(false);
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Tu registro se ha completado exitosamente.',
                                    variant: 'alert',
                                    alert: { color: 'success' },
                                    close: false
                                })
                            );
                            setTimeout(() => {
                                navigate('/login', { replace: true });
                            }, 1500);
                        
                    } catch (err) {
                        console.error(err);
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={{ xs: 0, sm: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nombres"
                                    margin="normal"
                                    name="nombres"
                                    type="text"
                                    value={values.nombres}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                    error={Boolean(touched.nombres && errors.nombres)} // Marcado en rojo si hay error
                                    helperText={touched.nombres && errors.nombres} // Muestra el mensaje de error
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Apellidos"
                                    margin="normal"
                                    name="apellidos"
                                    type="text"
                                    value={values.apellidos}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                    error={Boolean(touched.apellidos && errors.apellidos)} // Marcado en rojo si hay error
                                    helperText={touched.apellidos && errors.apellidos} // Muestra el mensaje de error
                                />
                            </Grid>
                        </Grid>

                        <FormControl fullWidth error={Boolean(touched.departamento && errors.departamento)} sx={{ ...theme.typography.customInput }}>
                            <Autocomplete
                                id="departamento-select"
                                name="departamento"
                                options={departments}
                                getOptionLabel={(option) => option.nombre}
                                value={departments.find((item) => item.nombre === values.departamento) || null}
                                onChange={(event, newValue) => handleChange({
                                    target: { name: 'departamento', value: newValue ? newValue.nombre : '' }
                                })}
                                onBlur={handleBlur}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Departamento"
                                        error={Boolean(touched.departamento && errors.departamento)}
                                        helperText={touched.departamento && errors.departamento}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Correo electrónico</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-password-register">Contraseña</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Contraseña"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Registrarse
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default JWTRegister;
