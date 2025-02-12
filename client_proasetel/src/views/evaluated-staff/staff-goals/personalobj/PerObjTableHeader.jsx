import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { visuallyHidden } from '@mui/utils';

// assets
import DeleteIcon from '@mui/icons-material/Delete';

// table header options
const headCells = [
    
    {
        id: 'titulo',
        numeric: false,
        label: 'Título'
    },
    {
        id: 'descripcion',
        numeric: false,
        label: 'Descripción'
    },
];

// ==============================|| CLIENT LIST - HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar sx={{ p: 0, pl: 1, pr: 1, ...(numSelected > 0 && { color: 'secondary.main' }) }}>
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Departamentos
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| CLIENT LIST - HEADER ||============================== //

const PerObjTableHeader = ({ drawer, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected }) => {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={12}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : undefined}
                            sx={drawer ? { display: 'none' } : {}}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : undefined}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {numSelected <= 0 && (
                    <>
                    <TableCell sortDirection={false} align="center" sx={drawer ? { pr: 3, display: 'none' } : { pr: 3 }}>
                        Eliminar
                    </TableCell>
                    
                 </>
                )}
            </TableRow>
        </TableHead>
    );
};

PerObjTableHeader.propTypes = {
    drawer: PropTypes.bool,
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default PerObjTableHeader;
