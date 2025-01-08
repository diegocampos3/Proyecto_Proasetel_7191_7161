import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// project imports
import ClientTableHeader from './ClientTableHeader';
import Avatar from 'ui-component/extended/Avatar';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { ThemeMode } from 'config';

// assets
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| CLIENT LIST - TABLE ||============================== //

const ClientTable = ({ open, setOpen, department, setRowValue }) => {
    const theme = useTheme();

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    let label;
    let color;
    let chipcolor;

    React.useEffect(() => {
        setRows(department);
    }, [department]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n.nombre);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (nombre) => {
        const selectedIndex = selected.indexOf(nombre);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, nombre);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (nombre) => selected.indexOf(nombre) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleDrawerOpen = (row) => {
        setRowValue(row);
        setOpen(true);
    };

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <>
            <TableContainer>
                <Table sx={{ minWidth: open ? 300 : 750 }} aria-labelledby="tableTitle">
                    <ClientTableHeader
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        selected={selected}
                        drawer={open}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;

                                const isItemSelected = isSelected(row.nombre);
                                const labelId = `enhanced-table-checkbox-${index}`;


                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                        {...(open && { sx: { '&:first-of-type': { borderTop: '1px solid', borderTopColor: 'divider' } } })}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            sx={open ? { pl: 3, display: 'none' } : { pl: 3 }}
                                            onClick={() => handleClick(row.nombre)}
                                        >
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={open ? { display: 'none' } : {}}>
                                            <Typography variant="h5">{row.id}</Typography>
                                        </TableCell>
                                        <TableCell sx={open ? { display: 'none' } : {}} >{capitalizeFirstLetters(row.nombre)}</TableCell>
                                        <TableCell sx={open ? { display: 'none' } : {}}>{row.descripcion}</TableCell>
                                        <TableCell align="center" sx={{ pr: 3, ...(open && { display: 'none' }) }}>
                                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                                <Tooltip title="View">
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        aria-label="View"
                                                        onClick={() => handleDrawerOpen(row)}
                                                    >
                                                        <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton color="secondary" size="small" aria-label="Edit">
                                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton color="error" size="small" aria-label="Delete">
                                                        <DeleteTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow sx={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={10} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                sx={{ display: open ? 'none' : 'inherit' }}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

ClientTable.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setRowValue: PropTypes.func,
    department: PropTypes.array
};

export default ClientTable;
