import { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditDepartmentBody from './EditDepartmentBody';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import { dispatch } from 'store';
import { updateDepartment } from 'store/slices/department';

const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const EditDepartment = ({ open, handleToggleEdit, row }) => {
    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [departamentoNombre, setDepartamentoNombre] = useState(row?.nombre || '');
    const [descripcion, setDescripcion] = useState(row?.descripcion || '');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleValuesChange = (values) => {
        setDepartamentoNombre(values.nombre);
        setDescripcion(values.descripcion);
    };

    useEffect(() => {
        setIsButtonDisabled(!isFormValid); // Activar o desactivar el botón según la validez del formulario
    }, [isFormValid]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleUpdate = async () => {
        const updatedData = {
            nombre: departamentoNombre,
            descripcion: descripcion,
        };

        const result = await dispatch(updateDepartment(row.id, updatedData));

        if (result.success) {
            setSnackbarMessage('Actualización exitosa.');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage(result.error);
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
        handleToggleEdit();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleToggleEdit}
                sx={{
                    '& .MuiDialog-paper': {
                        maxWidth: '100%',
                        width: 696,
                        borderRadius: 3,
                        py: 0,
                    },
                }}
            >
                <DialogTitle sx={{ px: 3, py: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h4">Editar Departamento</Typography>
                        </Stack>
                        <IconButton size="medium" onClick={handleToggleEdit}>
                            <CancelTwoToneIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <EditDepartmentBody
                        row={row || {}}
                        onValuesChange={handleValuesChange}
                        setIsFormValid={setIsFormValid} // Pasa setIsFormValid
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Stack spacing={1.5} direction="row">
                        <AnimateButton>
                            <Button variant="outlined" onClick={handleToggleEdit}>
                                Cancelar
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                variant="contained"
                                onClick={handleUpdate}
                                disabled={isButtonDisabled} // Botón deshabilitado según la validez
                            >
                                Guardar Cambios
                            </Button>
                        </AnimateButton>
                    </Stack>
                </DialogActions>
            </Dialog>
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
    );
};

EditDepartment.propTypes = {
    row: PropTypes.object,
    handleToggleEdit: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default EditDepartment;



