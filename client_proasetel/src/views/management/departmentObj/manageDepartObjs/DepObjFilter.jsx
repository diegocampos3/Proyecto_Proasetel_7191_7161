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

const DepObjFilter = ({rows, setRows, objEmpDep }) => {
    
    const [search, setSearch] = React.useState('');
    const navigate = useNavigate();

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows?.filter((row) => {
                let matches = true;
                const properties = ['id', 'titulo'];
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
        navigate('/management/departmentobj/manageDepartObj/addDepartObj', {
            state: {objEmpDep}
        })
    }

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
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
            <div style={{ textAlign: "center" }}>
            <h2>{capitalizeFirstLetters(objEmpDep.titulo)}</h2>
            <h5 style={{ color: "darkgray", marginTop: "0.5em" }}>
            {objEmpDep.id.slice(0, 6)}
            </h5>
            </div>
            

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

DepObjFilter.propTypes = {
    setListDepartments: PropTypes.func,
    listDepartments: PropTypes.array
};

export default DepObjFilter;
