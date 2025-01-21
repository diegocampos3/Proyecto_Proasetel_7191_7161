import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import ReceiptTwoTone from '@mui/icons-material/ReceiptTwoTone';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';

import { useEffect, useState } from 'react';
import { dispatch, useSelector } from 'store';
import { getDetailsUsersDep } from 'store/slices/department';

// ==============================|| CLIENT LIST - DETAILS ||============================== //

const ClientDetails = ({ rowValue, handleDrawerClose }) => {
    const theme = useTheme();
    const balance = Math.floor(Math.random() * 4);
    const matchesXs = useMediaQuery(theme.breakpoints.down('sm'));

     // Acceder al estado de Redux
     const {departmentDetails} = useSelector((state) => state.department);
     
     const [details, setDetails] = useState(null);
 
     
     useEffect(() => {
         
         if(rowValue && rowValue.id){
            setDetails(null);
             dispatch(getDetailsUsersDep(rowValue.id));
         }
     }, [rowValue])
     

    useEffect(() => {
        setDetails(departmentDetails);
    }, [departmentDetails])
    
    
    let label;
    let color;

    switch (balance.toString()) {
        case '0':
            label = 'Rejected';
            color = 'error';
            break;
        case '1':
            label = 'Pending';
            color = 'warning';
            break;
        case '3':
            label = 'Verified';
            color = 'success';
            break;
        case '2':
        default:
            label = 'New';
            color = 'primary';
            break;
    }


    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <Grid container spacing={1.5}>
            <Grid item xs={12}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ px: 2.5, pt: 1.5 }}>
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={handleDrawerClose} sx={{ mr: '10px', padding: matchesXs ? '0px' : '' }}>
                            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                        </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ color: '#00BFFF' }}>Información del departamento</Typography>
                        </Grid>
                    </Stack>
                    
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ px: 2.5 }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">{rowValue?.id.slice(0,6)}</Typography>
                            <Typography variant="subtitle2">ID</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">{rowValue?.nombre ? capitalizeFirstLetters(rowValue.nombre) : null}
                            </Typography>
                            <Typography variant="subtitle2">Nombre del departamento</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">{details?.totalUsuarios || '0'}</Typography>
                            <Typography variant="subtitle2">Cantidad de empleados</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ px: 2.5 }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ color: '#00BFFF' }}>Enfoque del departamento</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">{rowValue?.descripcion}</Typography>
                            <Typography variant="subtitle2">Descripción</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
    <Box sx={{ px: 2.5 }}>
        <Grid container spacing={2.5}>
            <Grid item xs={12}>
                <Typography variant="h5" sx={{ color: '#00BFFF' }}>Supervisor del Departamento</Typography>
            </Grid>
            {!(details?.id ) ? (
                <Grid item xs={12}>
                    <Typography variant="subtitle2">Este departamento no cuenta con supervisor</Typography>
                </Grid>
            ) : (
                <>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">{details?.id.slice(0, 6)}</Typography>
                        <Typography variant="subtitle2">ID</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">{details?.email}</Typography>
                        <Typography variant="subtitle2">Email</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">{details?.nombres}</Typography>
                        <Typography variant="subtitle2">Nombre</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">{details?.apellidos}</Typography>
                        <Typography variant="subtitle2">Apellidos</Typography>
                    </Grid>
                </>
            )}
        </Grid>
    </Box>
</Grid>

        </Grid>
    );
};

ClientDetails.propTypes = {
    rowValue: PropTypes.object,
    handleDrawerClose: PropTypes.func
};

export default ClientDetails;
