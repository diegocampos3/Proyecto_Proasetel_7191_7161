import PropTypes from 'prop-types';

// Material-UI
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

// Project imports
import AddStaffDialogBody  from './AddStaffDialogBody';
import AnimateButton from 'ui-component/extended/AnimateButton';

// Assets
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePersonal } from 'store/slices/personal';

// Custom Alert Component
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ==============================|| EDIT STAFF ||============================== //

const AddStaffDialog = ({ open, handleToggleAddDialog, row }) => {
    
    const [departamento, setDepartamento] = useState('');
    const [rol, setRol] = useState('');
    const [estado, setEstado] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const dispatch = useDispatch();

    const handleValuesChange = (values) => {
        setDepartamento(values.departamentoNombre);
        setRol(values.rol);
        setEstado(values.estado);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    
    const handleUpdate = async () => {
        const updatedData = {
            id: row.id,
            departamento: departamento,
            rol: rol,
            isActive: estado === 1,
        };

        
        const result =  await dispatch(updatePersonal(updatedData));
        
                console.log('Imprimiendo result', result)
                if(result.success){
        
                    setSnackbarMessage('Correcta Actualización');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                    handleToggleAddDialog(); // Cierra la ventana modal si la actualización es exitosa
        
                }else{
                    setSnackbarMessage(result.error);
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    //handleToggleAddDialog(); // Cierra la ventana modal si la actualización es exitosa
        
                }
        
    
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleToggleAddDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        maxWidth: '100%',
                        width: 696,
                        borderRadius: 3,
                        py: 0
                    }
                }}
            >
                {open && (
                    <>
                        <DialogTitle sx={{ px: 3, py: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                {!row ? (
                                    <Typography variant="h4">Editar Personal</Typography>
                                ) : (
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h4">Editar Personal</Typography>
                                    </Stack>
                                )}
                                <IconButton sx={{ p: 0 }} size="medium" onClick={handleToggleAddDialog}>
                                    <CancelTwoToneIcon />
                                </IconButton>
                            </Stack>
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{ p: 0 }}>
                            <AddStaffDialogBody  row={row} onValuesChange={handleValuesChange} />
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
                                <AnimateButton>
                                    <Button variant="outlined" onClick={handleToggleAddDialog}>
                                        Cancelar
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button variant="contained" onClick={handleUpdate}>
                                        Editar
                                    </Button>
                                </AnimateButton>
                            </Stack>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

AddStaffDialog.propTypes = {
    row: PropTypes.object,
    handleToggleAddDialog: PropTypes.func,
    open: PropTypes.bool
};

export default AddStaffDialog;

