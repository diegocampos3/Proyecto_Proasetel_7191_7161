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

// ==============================|| ITEMS LIST - FILTER ||============================== //

const ItemFilter = ({ rows, setRows, idFormulario }) => {
    const [search, setSearch] = React.useState('');

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows?.filter((row) => {
                let matches = true;

                const properties = ['idpregunta', 'pregunta'];
                let containsQuery = false;

                // properties.forEach((property) => {
                //     if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                //         containsQuery = true;
                //     }
                properties.forEach((property) => {
                    if (row[property] && row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else {
            setRows(rows);
                        // Restablecer a los datos originales
            // const filteredOriginalRows = originalRows.map((pregunta) => ({
            //     idPregunta: pregunta.idPregunta,
            //     pregunta: pregunta.pregunta,
            // }));
            // setRows(filteredOriginalRows);
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
                placeholder="Búsqueda de preguntas"
                value={search}
                size="small"
                sx={{ width: { xs: 1, sm: 'auto' } }}
            />

            <Stack direction="row" alignItems="center" spacing={1.25}>
                {/* <Tooltip title="Copy">
                    <IconButton size="large">
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Print">
                    <IconButton size="large">
                        <PrintIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Filter">
                    <IconButton size="large">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip> */}

                {/* items add & dialog */}
                <Tooltip title="Añadir pregunta">
                    <Link to={`/management/Items/AddFormularioPreguntas/${idFormulario}`}>
                        <Fab color="primary" size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
                            <AddIcon fontSize="small" />
                        </Fab>
                    </Link>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

ItemFilter.propTypes = {
    // setListPreguntasFormulario: PropTypes.func,
    // setListPreguntasFormulario: PropTypes.array
};

export default ItemFilter;
