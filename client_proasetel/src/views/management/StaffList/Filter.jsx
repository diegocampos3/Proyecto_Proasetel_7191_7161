import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';


// assets
import AddIcon from '@mui/icons-material/AddTwoTone';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';

import SearchIcon from '@mui/icons-material/Search';

// ==============================|| STAFF - SEARCH FILTER ||============================== //

const Filter = ({ handleToggleDrawer, rows, setRows }) => {
    const [search, setSearch] = React.useState('');

    

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows?.filter((row) => {
                let matches = true;
                const properties = ['id', 'nombres', 'apellidos'];
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
        <>
            <Stack
                sx={{ p: 3 }}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
                spacing={2}
            >
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        )
                    }}
                    placeholder="Búsqueda de personal"
                    size="small"
                    value={search}
                    onChange={handleSearch}
                />
                <Stack direction="row" alignItems="center" justifyContent={{ xs: 'center' }} spacing={1.25}>
                    
                    <Tooltip title="Filtrar">
                        <IconButton size="large" onClick={handleToggleDrawer}>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
            
        </>
    );
};

Filter.propTypes = {
    rows: PropTypes.array,
    setRows: PropTypes.func,
    handleToggleDrawer: PropTypes.func
};

export default Filter;
