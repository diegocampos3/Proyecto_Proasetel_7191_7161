import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoggedIn, requestResetPassword } = useAuth();

    return (
        <Formik
            initialValues={{ email: '', submit: null }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Campo Obligatorio')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    await requestResetPassword(values.email).then(
                        () => {
                            setStatus({ success: true });
                            setSubmitting(false);
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Revise su correo para restablecimiento de constraseña',
                                    variant: 'alert',
                                    alert: { color: 'success' },
                                    close: false
                                })
                            );
                            setTimeout(() => {
                                navigate(isLoggedIn ? '/auth/check-mail' : '/check-mail', { replace: true });
                            }, 1500);

                            // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
                            // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
                            // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
                            // github issue: https://github.com/formium/formik/issues/2430
                        },
                        (err) => {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    );
                } catch (err) {
                    console.error(err);
                    if (scriptedRef.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-forgot">Correo Electrónico</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-forgot"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Email Address / Username"
                            inputProps={{}}
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error id="standard-weight-helper-text-email-forgot">
                                {errors.email}
                            </FormHelperText>
                        )}
                    </FormControl>

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
                                Enviar Correo
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthForgotPassword;
