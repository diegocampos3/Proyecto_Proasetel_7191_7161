import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { updateRespuesta } from 'store/slices/respuestasPreguntas';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ==============================|| EDITAR RESPUESTA ||============================== //

const EditRespuestaModal = ({ open, onClose, respuesta }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    clave: '',
    descripcion: '',
    valor: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (respuesta) {
      setFormData({
        clave: respuesta.clave,
        descripcion: respuesta.descripcion,
        valor: respuesta.valor
      });
    }
  }, [respuesta]);

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    //ventana snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    //   const handleSubmit = async (e) => {
    const handleSubmit = async () => {
        // e.preventDefault();
        setLoading(true);
        try {
            const result = await dispatch(updateRespuesta(respuesta.idRespuestaPregunta, formData));
        
            //   if (result.payload.success) {
            if (result.success) {
                setSnackbarMessage('Actualización exitosa.');
                setSnackbarSeverity('success');
                // onClose();
                      // Esperar 1.5 segundos antes de cerrar el modal
                setTimeout(() => {
                    onClose();
                }, 2000);

            } else{
                setSnackbarMessage(result.error); 
                setSnackbarSeverity('error');
            }
            
        } finally {
            setLoading(false);
            
        }
        setSnackbarOpen(true);
        // onClose();
    };
     
  const handleChange = (e) => {
    const { name, value } = e.target; setFormData({ ...formData, [name]: name === 'valor' ? parseInt(value) : value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth   disableEnforceFocus disableRestoreFocus>
      <DialogTitle>Editar Respuesta</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Clave"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            multiline
            rows={3}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Valor"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={handleChange}
            required
            inputProps={{
                step: "1",
                min: 0,
                max: 100
            }}
            // error={formData.valor < 0 || formData.valor > 100}
            // helperText={
            //     (formData.valor < 0 || formData.valor > 100) 
            //     ? "El valor debe estar entre 0 y 100" 
            //     : ""
            // }
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
      
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
        </Alert>
    </Snackbar>
    </Dialog>
  );
};

export default EditRespuestaModal;