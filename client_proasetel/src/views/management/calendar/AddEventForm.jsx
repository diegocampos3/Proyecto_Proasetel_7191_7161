import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { es } from 'date-fns/locale';

import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash-es';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import ColorPalette from './ColorPalette';
import { gridSpacing } from 'store/constant';

// assets
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';

// Función para asignar los valores iniciales (se agregan los nuevos campos)
const getInitialValues = (event, range) => {
    const newEvent = {
        title: '',
        description: '',
        color: '#2196f3',
        textColor: '',
        allDay: false,
        start: range ? new Date(range.start) : new Date(),
        end: range ? new Date(range.end) : new Date(),
        startConfig: event?.startConfig ? new Date(event.startConfig) : new Date(),
        endConfig: event?.endConfig ? new Date(event.endConfig) : new Date(),
        startEval: event?.startEval ? new Date(event.startEval) : new Date(),
        endEval: event?.endEval ? new Date(event.endEval) : new Date()
    };

    if (event || range) {
        return _.merge({}, newEvent, event);
    }

    return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddEventForm = ({ event, range, handleDelete, handleCreate, handleUpdate, onCancel }) => {
    const theme = useTheme();
    const isCreating = !event;

    const backgroundColor = [
        {
            value: theme.palette.primary.main,
            color: 'primary.main',
            label: 'Default'
        },
        {
            value: theme.palette.error.main,
            color: 'error.main'
        },
        {
            value: theme.palette.success.dark,
            color: 'success.dark'
        },
        {
            value: theme.palette.secondary.main,
            color: 'secondary.main'
        },
        {
            value: theme.palette.warning.dark,
            color: 'warning.dark'
        },
        {
            value: theme.palette.orange.dark,
            color: 'orange.dark'
        },
        {
            value: theme.palette.grey[500],
            color: 'grey.500'
        },
        {
            value: theme.palette.primary.light,
            color: 'primary.light'
        },
        {
            value: theme.palette.error.light,
            color: 'error.light'
        },
        {
            value: theme.palette.success.light,
            color: 'success.light'
        },
        {
            value: theme.palette.secondary.light,
            color: 'secondary.light'
        },
        {
            value: theme.palette.warning.light,
            color: 'warning.light'
        },
        {
            value: theme.palette.orange.light,
            color: 'orange.light'
        }
    ];

    const textColor = [
        {
            value: theme.palette.error.light,
            color: 'error.light',
            label: ''
        },
        {
            value: theme.palette.success.light,
            color: 'success.light',
            label: ''
        },
        {
            value: theme.palette.secondary.light,
            color: 'secondary.light',
            label: ''
        },
        {
            value: theme.palette.warning.light,
            color: 'warning.light',
            label: ''
        },
        {
            value: theme.palette.orange.light,
            color: 'orange.light',
            label: ''
        },
        {
            value: theme.palette.primary.light,
            color: 'primary.light',
            label: ''
        },
        {
            value: theme.palette.primary.main,
            color: 'primary.main',
            label: ''
        },
        {
            value: theme.palette.error.main,
            color: 'error.main',
            label: ''
        },
        {
            value: theme.palette.success.dark,
            color: 'success.dark',
            label: ''
        },
        {
            value: theme.palette.secondary.main,
            color: 'secondary.main',
            label: ''
        },
        {
            value: theme.palette.warning.dark,
            color: 'warning.dark',
            label: ''
        },
        {
            value: theme.palette.orange.dark,
            color: 'orange.dark',
            label: ''
        },
        {
            value: theme.palette.grey[500],
            color: 'grey.500',
            label: ''
        }
    ];

    // Se extiende el esquema de validación para incluir los nuevos campos.
    const EventSchema = Yup.object().shape({
        title: Yup.string().max(255).required('El titulo es requerido'),
        description: Yup.string().max(5000).required('La descripción es obligatoria'),
        start: Yup.date().required('La fecha de inicio es requerida'),
        end: Yup.date()
            .required('La fecha de fin es requerida')
            .min(Yup.ref('start'), 'La fecha de finalización debe ser posterior a la fecha de inicio'),
        color: Yup.string().max(255),
        textColor: Yup.string().max(255),
        startConfig: Yup.date()
            .required('La fecha de inicio de configuración es requerida')
            .test(
                'startConfig-before-end',
                'La fecha de inicio de configuración debe ser menor a la fecha fin del periodo',
                function (value) {
                    const { end } = this.parent;
                    return value && end ? new Date(value) < new Date(end) : true;
                }
            ),
        endConfig: Yup.date()
            .required('La fecha fin de configuración es requerida')
            .min(Yup.ref('startConfig'), 'La fecha fin de configuración debe ser posterior a la fecha de inicio de configuración'),
        startEval: Yup.date()
            .required('La fecha de inicio de evaluación es requerida')
            .test(
                'startEval-after-endConfig',
                'La fecha de inicio de evaluación debe ser mayor a la fecha fin de configuración',
                function (value) {
                    const { endConfig } = this.parent;
                    return value && endConfig ? new Date(value) > new Date(endConfig) : true;
                }
            ),
        endEval: Yup.date()
            .required('La fecha fin de evaluación es requerida')
            .min(Yup.ref('startEval'), 'La fecha fin de evaluación debe ser posterior a la fecha de inicio de evaluación')
            .test(
                'endEval-before-end',
                'La fecha fin de evaluación debe ser menor a la fecha fin del periodo',
                function (value) {
                    const { end } = this.parent;
                    return value && end ? new Date(value) < new Date(end) : true;
                }
            )
    });

    const formik = useFormik({
        initialValues: getInitialValues(event, range),
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = {
                    titulo: values.title,
                    descripcion: values.description,
                    fecha_ini: formatToIso(values.start),
                    fecha_fin: formatToIso(values.end),
                    fecha_ini_config: formatToIso(values.startConfig),
                    fecha_fin_config: formatToIso(values.endConfig),
                    fecha_ini_eval: formatToIso(values.startEval),
                    fecha_fin_eval: formatToIso(values.endEval),
                    color: values.color,
                    textColor: values.textColor
                };

                if (event) {
                    handleUpdate(event.id, data);
                } else {
                    handleCreate(data);
                    console.log("Data enviado:", data);
                }

                resetForm();
                onCancel();
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    // Función para formatear la fecha a ISO
    function formatToIso(dateValue) {
        if (typeof dateValue === 'string' && dateValue.includes('T')) {
            return dateValue;
        }
        return new Date(dateValue).toISOString();
    }

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle>{event ? 'Editar Periodo' : 'Añadir Periodo'}</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            {/* Datos generales */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Titulo"
                                    {...getFieldProps('title')}
                                    error={Boolean(touched.title && errors.title)}
                                    helperText={touched.title && errors.title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Descripción"
                                    {...getFieldProps('description')}
                                    error={Boolean(touched.description && errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                            </Grid>

                            {/* Periodo del Evento */}
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Inicio"
                                    value={new Date(values.start)}
                                    format="dd/MM/yyyy hh:mm aa"
                                    onChange={(date) => setFieldValue('start', date)}
                                    minDate={new Date()}
                                    locale={es}
                                    slotProps={{
                                        textField: {
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }
                                        }
                                    }}
                                />
                                {touched.start && errors.start && <FormHelperText error>{errors.start}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Fin"
                                    value={new Date(values.end)}
                                    format="dd/MM/yyyy hh:mm aa"
                                    onChange={(date) => setFieldValue('end', date)}
                                    minDate={new Date()}
                                    locale={es}
                                    slotProps={{
                                        textField: {
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }
                                        }
                                    }}
                                />
                                {touched.end && errors.end && <FormHelperText error>{errors.end}</FormHelperText>}
                            </Grid>

                            {/* Configuración de Objetivos */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Configuración de Objetivos
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Inicio Configuración"
                                    value={new Date(values.startConfig)}
                                    format="dd/MM/yyyy hh:mm aa"
                                    onChange={(date) => setFieldValue('startConfig', date)}
                                    minDate={new Date()}
                                    locale={es}
                                    slotProps={{
                                        textField: {
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }
                                        }
                                    }}
                                />
                                {touched.startConfig && errors.startConfig && (
                                    <FormHelperText error>{errors.startConfig}</FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Fin Configuración"
                                    value={new Date(values.endConfig)}
                                    format="dd/MM/yyyy hh:mm aa"
                                    onChange={(date) => setFieldValue('endConfig', date)}
                                    minDate={new Date()}
                                    locale={es}
                                    slotProps={{
                                        textField: {
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }
                                        }
                                    }}
                                />
                                {touched.endConfig && errors.endConfig && (
                                    <FormHelperText error>{errors.endConfig}</FormHelperText>
                                )}
                            </Grid>

                            {/* Evaluación */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Evaluación
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Inicio Evaluación"
                                    value={new Date(values.startEval)}
                                    format="dd/MM/yyyy hh:mm aa"
                                    onChange={(date) => setFieldValue('startEval', date)}
                                    minDate={new Date()}
                                    locale={es}
                                    slotProps={{
                                        textField: {
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }
                                        }
                                    }}
                                />
                                {touched.startEval && errors.startEval && (
                                    <FormHelperText error>{errors.startEval}</FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Fin Evaluación"
                                    value={new Date(values.endEval)}
                                    format="dd/MM/yyyy hh:mm aa"
                                    onChange={(date) => setFieldValue('endEval', date)}
                                    minDate={new Date()}
                                    locale={es}
                                    slotProps={{
                                        textField: {
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }
                                        }
                                    }}
                                />
                                {touched.endEval && errors.endEval && (
                                    <FormHelperText error>{errors.endEval}</FormHelperText>
                                )}
                            </Grid>

                            {/* Selección de colores */}
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Color de fondo</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-label="color"
                                                {...getFieldProps('color')}
                                                onChange={(e) => setFieldValue('color', e.target.value)}
                                                name="color-radio-buttons-group"
                                                sx={{ '& .MuiFormControlLabel-root': { mr: 0 } }}
                                            >
                                                {backgroundColor.map((item, index) => (
                                                    <ColorPalette key={index} value={item.value} color={item.color} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Color de Texto</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                aria-label="textColor"
                                                {...getFieldProps('textColor')}
                                                onChange={(e) => setFieldValue('textColor', e.target.value)}
                                                name="text-color-radio-buttons-group"
                                                sx={{ '& .MuiFormControlLabel-root': { mr: 0 } }}
                                            >
                                                <FormControlLabel
                                                    value=""
                                                    control={<Radio color="default" />}
                                                    label="Por Defecto"
                                                    sx={{ pr: 1 }}
                                                />
                                                {textColor.map((item, index) => (
                                                    <ColorPalette key={index} value={item.value} color={item.color} />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                {!isCreating && (
                                    <Tooltip title="Eliminar">
                                        <IconButton onClick={() => handleDelete(event?.id)} size="large">
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Grid>
                            <Grid item>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button type="button" variant="outlined" onClick={onCancel}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        {event ? 'Editar' : 'Añadir'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

AddEventForm.propTypes = {
    event: PropTypes.object,
    range: PropTypes.object,
    handleDelete: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    onCancel: PropTypes.func
};

export default AddEventForm;
