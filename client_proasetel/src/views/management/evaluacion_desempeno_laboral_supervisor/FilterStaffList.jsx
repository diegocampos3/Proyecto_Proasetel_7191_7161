import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';


// project imports
import { ThemeMode } from 'config';

// assets
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';

import { dispatch, useSelector } from 'store';
import { getDepartments } from 'store/slices/department';
import React from 'react';



// ==============================|| STAFF- FILTER LIST ||============================== //

const FilterStaffList = ({ handleToggleDrawer, onFilterChange}) => {
    

    const theme = useTheme();
    const { departments} = useSelector((state) => state.department);


    const [departamento, setDepartamento] = useState("");
    const [rol, setRol] = useState("");
    const [estado, setEstado] = useState("");


    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    const handleChangeDepartamento = (event) => {
        setDepartamento(event.target.value);
        onFilterChange({departamento: event.target.value, rol, estado})
    };

    const handleChangeRol = (event) => {
        setRol(event.target.value);
        onFilterChange({ departamento, rol: event.target.value, estado });

    };

    const handleChangeEstado = (event) => {
        setEstado(event.target.value);
        onFilterChange({ departamento, rol, estado: event.target.value });

    };

    const handleClearFilters = () => {
        setDepartamento(""); 
        setRol(""); 
        setEstado(""); 
        onFilterChange({ departamento: "", rol: "", estado: "" });

    };

    const capitalizeFirstLetters = (str) => {
        
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <Box sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50' }}>
            <Card sx={{ borderRadius: 0 }}>
                
                <Divider />
                <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                        <Select 
                            labelId="demo-simple-select-label" 
                            id="demo-simple-select" 
                            value={departamento} 
                            onChange={handleChangeDepartamento}
                            placeholder="Departamento"  
                            label="Departamento">
                            
                            {departments && departments.length > 0 ?(
                                departments.map((departamento) => (
                                    <MenuItem key={departamento.id} value={departamento.nombre}>
                                        {capitalizeFirstLetters(departamento.nombre)}
                                    </MenuItem>
                                ))
                            ):(
                                <MenuItem value="Ninguno">Ninguno</MenuItem>
                            )
                            }
                            
                        </Select>
                    </FormControl>
                </CardContent>
                <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                        <Select 
                            labelId="demo-simple-select-label" 
                            id="demo-simple-select" 
                            placeholder="Estado" 
                            value={estado}
                            onChange={handleChangeEstado}
                            label="Estado">
                            <MenuItem value={true}>Activo</MenuItem>
                            <MenuItem value={false}>Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
                <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                        <Select 
                            labelId="demo-simple-select-label" 
                            id="demo-simple-select" 
                            placeholder="Rol"
                            value={rol}  
                            onChange={handleChangeRol}
                            label="Rol">
                            <MenuItem value={"user"}>User</MenuItem>
                            <MenuItem value={"supervisor"}>Supervidor</MenuItem>
                            <MenuItem value={"empleado"}>Empleado</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
=
                <Divider />
                <CardContent sx={{ borderRadius: 0, py: 1.25, px: 2.5 }}>
                    <Stack spacing={4}>
                        
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <Button 
                                variant="contained" 
                                sx={{ borderRadius: 2.5 }} 
                                color="primary" 
                                startIcon={<ReplayIcon />}
                                onClick={handleClearFilters}
                                >
                                Reiniciar
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ borderRadius: 2.5 }}
                                onClick={() => {
                                    handleToggleDrawer();
                                    handleClearFilters();
                                }}
                                color="error"
                                startIcon={<CloseIcon />}
                            >
                                Cancelar
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

FilterStaffList.propTypes = {
    handleToggleDrawer: PropTypes.func
};

export default FilterStaffList;
