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

// constant
const getInitialValues = (event, range) => {
    const newEvent = {
        title: '',
        description: '',
        color: '#2196f3',
        textColor: '',
        allDay: false,
        start: range ? new Date(range.start) : new Date(),
        end: range ? new Date(range.end) : new Date()
    };

    if (event || range) {
        return _.merge({}, newEvent, event);
    }

    return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddEventFrom = ({ event, range, handleDelete, handleCreate, handleUpdate, onCancel }) => {
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

    const EventSchema = Yup.object().shape({
        title: Yup.string().max(255).required('El titulo es requerido'),
        description: Yup.string().max(5000).required('La descripción es obligatoria'),
        end: Yup.date().when('start', (start, schema) => start && schema.min(start, 'La fecha de finalización debe ser posterior a la fecha de inicio')),
        start: Yup.date(),
        color: Yup.string().max(255),
        textColor: Yup.string().max(255)
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
                    color: values.color,
                    textColor: values.textColor

                };

                if (event) {
                    handleUpdate(event.id, data);
                } else {
                    handleCreate(data);
                    console.log("Data enviado:", data )
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

    // Formatear datos
    function formatToIso(dateValue){
        if (typeof dateValue === 'string' && dateValue.includes('T')) {
            return dateValue;
        }
        return new Date(dateValue).toISOString();
    }
    
    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle>{event ? 'Edit Event' : 'Añadir Evento de Evaluación'}</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
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
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Inicio"
                                    value={new Date(values.start)}
                                    format="dd/MM/yyyy hh:mm a"
                                    onChange={(date) => setFieldValue('start', date)}
                                    minDate={new Date()}
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
                                {touched.start && errors.start && <FormHelperText error={true}>{errors.start}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Fecha Fin"
                                    value={new Date(values.end)}
                                    format="dd/MM/yyyy hh:mm a"
                                    onChange={(date) => setFieldValue('end', date)}
                                    minDate={new Date()}
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
                                {touched.end && errors.end && <FormHelperText error={true}>{errors.end}</FormHelperText>}
                            </Grid>
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
                                                    label="Default"
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
                                            {console.log(event.id)}
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
                                        {event ? 'Edit' : 'Añadir'}
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

AddEventFrom.propTypes = {
    event: PropTypes.object,
    range: PropTypes.object,
    handleDelete: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    onCancel: PropTypes.func
};

export default AddEventFrom;
