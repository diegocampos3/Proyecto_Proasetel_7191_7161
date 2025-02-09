import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { visuallyHidden } from '@mui/utils';

// table header options
const headCells = [
    // {
    //     id: 'contador',
    //     numeric: true,
    //     label: '#',
    //     align: 'center'
    // },
    {
        id: 'pregunta',
        numeric: false,
        label: 'Pregunta',
        align: 'center'
    },
    {
        id: 'Editar/Eliminar',
        numeric: false,
        label: 'Editar/Eliminar',
        align: 'center'
    }
];

// ==============================|| ITEM TABLE - HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| ITEM TABLE - HEADER ||============================== //

const ItemTableHeader = ({ open, order, orderBy, numSelected, onRequestSort, selected, formularioEstado }) => {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const filteredHeadCells = headCells.filter((cell) => {
        if (cell.id === 'Editar/Eliminar') {
            return Number(formularioEstado) === 1; // Muestra solo si idFormulario es 1
        }
        return true; // Mantén las demás columnas
    });

    return (
        <TableHead>
            <TableRow>
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={12}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    filteredHeadCells.map((headCell) => {
                        const isActive = orderBy === headCell.id;
                        return (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                sortDirection={isActive ? order : undefined}
                                {...(open && { sx: { display: 'none' } })}
                            >
                                <TableSortLabel
                                    active={isActive}
                                    direction={isActive ? order : undefined}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {isActive && (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    )}
                                </TableSortLabel>
                            </TableCell>
                        );
                    })}
            </TableRow>
        </TableHead>
    );
};

ItemTableHeader.propTypes = {
    open: PropTypes.bool,
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default ItemTableHeader;
