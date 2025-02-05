import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';


// material-ui
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// assets
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';


// ==============================|| OBJ PERSONAL - FILTER ||============================== //

const PerObjFilter = ({rows, setRows }) => {
    
    const [search, setSearch] = React.useState('');

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows?.filter((row) => {
                let matches = true;
                const properties = ['idObjDep','titulo', 'descripcion'];
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
                placeholder="Búsqueda de objetivo"
                value={search}
                size="small"
                sx={{ width: { xs: 1, sm: 'auto' } }}
            />
            
        </Stack>
    );
};

PerObjFilter.propTypes = {
    setListDepartments: PropTypes.func,
    listDepartments: PropTypes.array
};

export default PerObjFilter;
