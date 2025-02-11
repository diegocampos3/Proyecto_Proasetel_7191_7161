import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// assets
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import AddIcon from '@mui/icons-material/AddTwoTone';

// project imports

import AddDepartment from './AddDepartment';

// ==============================|| CLIENT LIST - FILTER ||============================== //

const DepartmentFilter = ({rows, setRows }) => {
    
    const [search, setSearch] = React.useState('');

    // Ventana- Add
    const [openAddDepart, setOpenAddDepart] = React.useState(false);

    const handleToggleAdd = () => {
        setOpenAddDepart(!openAddDepart);
    }
    
    const handleAddClick = () => {
        handleToggleAdd();
    }



    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows?.filter((row) => {
                let matches = true;
                const properties = ['nombre', 'descripcion'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });
                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
            console.log('Filter setRows:', newRows)
        } else {
            setRows(rows);
            console.log('Filter Rows:', rows)

        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
            <TextField
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    )
                }}
                onChange={handleSearch}
                placeholder="Búsqueda de departamento"
                value={search}
                size="small"
                sx={{ width: { xs: 1, sm: 'auto' } }}
            />
            <Stack direction="row" alignItems="center" spacing={1.25}>
                {/* client add & dialog */}
                <Tooltip title="Crear Departamento">
                    <IconButton 
                        onClick={() => handleAddClick()}
                    >
                        <Fab color="primary" size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
                            <AddIcon fontSize="small" />
                        </Fab>
                    </IconButton>
                </Tooltip>
            </Stack>
            <AddDepartment open={openAddDepart} handleToggleAdd = {handleToggleAdd}></AddDepartment>
        </Stack>
    );
};

DepartmentFilter.propTypes = {
    setListDepartments: PropTypes.func,
    listDepartments: PropTypes.array
};

export default DepartmentFilter;
