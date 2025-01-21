import PropTypes from 'prop-types';
import { useState, forwardRef, useEffect } from 'react';

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
import AddDepartmentBody from './AddDepartmentBody';
import AnimateButton from 'ui-component/extended/AnimateButton';

// Assets
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

// Store
import { dispatch } from 'store';
import { addDepartment } from 'store/slices/department';

// Custom Alert Component
const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ==============================|| EDIT DEPARTMENT ||============================== //

const AddDepartment = ({open, handleToggleAdd}) => {

    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [departamentoNombre, setDepartamentoNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);




    const handleValuesChange = (values) => {
        setDepartamentoNombre(values.nombre);
        setDescripcion(values.descripcion);
    };

    useEffect(() => {
        // Verifica si algún campo requerido está vacío
        setIsButtonDisabled(!departamentoNombre.trim() || !descripcion.trim() || !isFormValid);
    }, [departamentoNombre, descripcion, isFormValid]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleCreate = async () => {
        const createData = {
            nombre: departamentoNombre,
            descripcion: descripcion,
        };
        
        console.log(createData)
    
        const result = await dispatch(addDepartment(createData));
    
        if (result.success) {
            setSnackbarMessage('Departamento creado con existo');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage(result.error); 
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
        handleToggleAdd();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleToggleAdd}
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
                            <Typography variant="h4">Crear Departamento</Typography>
                        </Stack>
                        <IconButton size="medium" onClick={handleToggleAdd}>
                            <CancelTwoToneIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <AddDepartmentBody  
                        onValuesChange={handleValuesChange} 
                        setIsFormValid={setIsFormValid}
                        />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Stack spacing={1.5} direction="row">
                        <AnimateButton>
                            <Button variant="outlined" onClick={handleToggleAdd}>
                                Cancelar
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button 
                                variant="contained" 
                                onClick={handleCreate}
                                disabled={isButtonDisabled}
                                >
                                Crear Departamento
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

AddDepartment.propTypes = {
    handleToggleAdd: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default AddDepartment;

