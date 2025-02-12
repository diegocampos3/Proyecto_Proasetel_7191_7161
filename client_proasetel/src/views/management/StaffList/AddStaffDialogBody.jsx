import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useAuth from 'hooks/useAuth';


import { dispatch, useSelector } from 'store';
import { getDepartments } from 'store/slices/department';

const AddStaffDialogBody = ({ row, onValuesChange }) => {
    
    const [departamentoNombre, setDepartamentoNombre] = useState(row?.departamento || '');
    const [estado, setEstado] = useState(row?.isActive ? 1 : 2); // 1 para activo, 2 para inactivo
    const [rol, setRol] = useState(row?.rol || "");
    
    const { logout, user } = useAuth();


    console.log('Imprimiendo rol de usuario:', user?.rol)
     

    console.log('Imprimiendo rol de usuario:', user)

    // Obtener los departments desde el store de Redux
    const { departments } = useSelector((state) => state.department);

    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    // Si el nombre del departamento está disponible en row.departamento
    useEffect(() => {
        if (row) {
            setRol(row.rol || '');
            setEstado(row.isActive ? 1 : 2);
            if (row.departamento) {
                const departamentoEncontrado = departments.find(departamento => departamento.nombre === row.departamento);
                if (departamentoEncontrado) {
                    setDepartamentoNombre(departamentoEncontrado.nombre);
                }
            }
        }
    }, [row, departments]);

    const handleDepartamentoChange = (event) => {
        setDepartamentoNombre(event.target.value);
    };

    const capitalizeFirstLetters = (str) => {

        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleEstadoChange = (event) => {
        setEstado(event.target.value);
    };
    
    const handleRolChange = (event) => {
        setRol(event.target.value);
    };

    useEffect(() => {
        onValuesChange({ departamentoNombre, rol, estado });
    }, [departamentoNombre, rol, estado, onValuesChange]);

    console.log('Body:', departamentoNombre);

    return (
        <CardContent sx={{ px: 2, py: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Stack spacing={2}>

                        <TextField fullWidth label="Nombres" value={row && row.nombres} InputProps={{ readOnly: true }} />

                        <TextField fullWidth label="Email" value={row && row.email} InputProps={{ readOnly: true }} />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={departamentoNombre}  // Asignar el nombre del departamento
                                onChange={handleDepartamentoChange}
                                label="Departamento"
                            >
                                {/* Renderiza las opciones de departamento */}
                                {departments && departments.length > 0 ? (
                                    departments.map((departamento) => (
                                        <MenuItem key={departamento.id} value={departamento.nombre}>
                                            {capitalizeFirstLetters(departamento.nombre)}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="Ninguno">Ninguno</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Stack>
                </Grid>

                <Grid item xs={6}>
                    <Stack spacing={2}>
                        <TextField fullWidth label="Apellidos" value={row && row.apellidos} InputProps={{ readOnly: true }} />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label2">Estado</InputLabel>
                            <Select
                                labelId="demo-simple-select-label2"
                                id="demo-simple-select"
                                value={estado}
                                onChange={handleEstadoChange}
                                label="Estado"
                            >
                                <MenuItem value={1}>Activo</MenuItem>
                                <MenuItem value={2}>Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={rol}
                                onChange={handleRolChange}
                                label="Rol"
                            >
                                
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="empleado">Empleado</MenuItem>
                                {user?.rol !== "supervisor" && (
                                <MenuItem value="supervisor">Supervisor</MenuItem>
                                )}                            </Select>
                        </FormControl>
                    </Stack>
                </Grid>
            </Grid>
        </CardContent>
    );
};

AddStaffDialogBody.propTypes = {
    row: PropTypes.object,
    onValuesChange: PropTypes.func.isRequired,
};

export default AddStaffDialogBody;
