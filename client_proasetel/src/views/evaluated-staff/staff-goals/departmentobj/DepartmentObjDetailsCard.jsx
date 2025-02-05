import PropTypes from "prop-types";
import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

// material ui
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Gid from "@mui/material/Grid"
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// project imports
import { gridSpacing } from "store/constant";
import { ThemeMode} from "config"

// assets
// import { NotInterestedTwoTone } from "@mui/icons-material/NotInterestedTwoTone";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material"

// Redux
import { dispatch} from "store";
import { addStaffObj } from "store/slices/staffobj";


const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled"{...props}></MuiAlert>
))

// ===================// LISTA DE OBJETIVOS DEPARTAMENTALES //=====================

const DepartmentObjDetailsCard = ({idObjDep, titulo, descripcion, select}) => {

    const theme = useTheme();

    // Estado para el modal
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    // Mensaje de confirmación luego del modal
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Manejo de estados
    const handleSelectClick = () => {
        setOpenConfirmDialog(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    // Add DepartmentObj- PersonalObj
    const handleDepartmentObjPers = async () => {
        const data = {
                objetivoDep: idObjDep
            }
        
            const result = await dispatch(addStaffObj(data));
            
            if(result.success){
                setSnackbarMessage('Selección de Objetivo Empresarial Exitoso');
                setSnackbarSeverity('success');
            }else{
                setSnackbarMessage(result.error); 
                setSnackbarSeverity('error');
            }
            setOpenConfirmDialog(false);
            setSnackbarOpen(true);
    }

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    // Retorno del componente
    return (
        <>
        <Card
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: 'primary.main'
                }
            }}
        
        
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>

                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Objetivo Departamental</Typography>
                    <Typography variant= "h3">{capitalizeFirstLetters(titulo)}</Typography>
                    <Typography variant="caption">Titulo</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{color: 'grey.700'}}>
                        {descripcion}
                    </Typography>
                    <Typography variant="caption">Descripción</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={()=> handleSelectClick()}
                            disabled={select}
                        >
                            {select ? "Objetivo Seleccionado" : "Aceptar Objetivo"}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Card>

        {/* Modal de confirmación */}

        <Dialog
            open={openConfirmDialog}
            onClose={()=> setOpenConfirmDialog(false)}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">Confirmar Aceptación de Objetivo</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    ¿Está seguro de que desea aceptar el objetivo <strong>{capitalizeFirstLetters(titulo)}</strong>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenConfirmDialog(false)} color="error" autoFocus>
                    Cancelar
                </Button>
                <Button
                    color="primary"
                    onClick={handleDepartmentObjPers}
                >
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>

        {/*Modal luego de la confirmación*/}
        <Snackbar
            open={snackbarOpen}
            autoHiddenDuration={600}
            onClose={handleSnackbarClose}
            anchorOrigin={{vertical: 'botton', horizontal: 'center'}}
        >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
            </Alert>
            
        </Snackbar>
        
        </>
    );
};

DepartmentObjDetailsCard.PropTypes = {
    id: PropTypes.string,
    titulo: PropTypes.string,
    descripcion: PropTypes.string
};

export default DepartmentObjDetailsCard


