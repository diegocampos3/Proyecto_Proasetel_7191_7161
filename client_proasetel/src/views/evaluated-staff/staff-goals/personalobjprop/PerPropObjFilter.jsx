import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


// material-ui
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from 'themes/typography';

// assets
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';


// ==============================|| CLIENT LIST - FILTER ||============================== //

const PerPropObjFilter = ({rows, setRows }) => {
    
    const [search, setSearch] = React.useState('');
    const navigate = useNavigate();

    console.log('Filas desde filtro:', rows)

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows?.filter((row) => {
                let matches = true;
                const properties = ['id', 'titulo', 'descripcion'];
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

    const handleAddClick = () => {
        navigate('/evaluated-staff/staff-goals/personalobjprop/addPerPropObj')
    }

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
                placeholder="Búsqueda de objetivo"
                value={search}
                size="small"
                sx={{ width: { xs: 1, sm: 'auto' } }}
            />
            
            <Stack direction="row" alignItems="center" spacing={1.25}>
                {/* client add & dialog */}
                <Tooltip title="Añadir Objetivo">
                    
                    <Fab 
                        color="primary" 
                        size="small" 
                        sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}
                        onClick={() => handleAddClick()}
                        >
                        <AddIcon fontSize="small" />
                    </Fab>

                </Tooltip>
            </Stack>
        </Stack>
    );
};

PerPropObjFilter.propTypes = {
    setListDepartments: PropTypes.func,
    listDepartments: PropTypes.array
};

export default PerPropObjFilter;
