import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



// material-ui
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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// project imports
import PerObjTableHeader from './PerObjTableHeader'


// assets
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


import { dispatch } from 'store';
import { removeStaffObj } from 'store/slices/staffobj';


// ----------------------------------------------------------------------

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

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));


// ==============================|| OBJ PERSONAL LIST - TABLE ||============================== //

const PerObjTable = ({ open, setOpen, listPerObj, setRowValue}) => {
    


    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const navigate = useNavigate();


    // Ventanas
    const [openEditDepart, setOpenEditDepart] = React.useState(false);
    
     // Estados para el modal
     const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
     const [rowToDelete, setRowToDelete] = React.useState(null);

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');


    React.useEffect(() => {
        setRows(listPerObj);
    }, [listPerObj]);

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
                const newSelectedId = rows.map((n) => n.titulo);
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

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleDrawerOpen = (row) => {
        setRowValue(row);
        setOpen(true);
    };

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Eliminación de objetivo - Empr
    const handlePersonalObjDelete = async () => {

        const id = rowToDelete.idObjPer;

        const result = await dispatch(removeStaffObj(id));

        if (result.success) {
            setSnackbarMessage('Eliminación exitosa.');
            setSnackbarSeverity('success');
        } else{
            setSnackbarMessage(result.error); 
            setSnackbarSeverity('error');
        }
        setOpenConfirmDialog(false);
        setSnackbarOpen(true);
    }

    const handleDeleteClick = (row) => {
        setRowToDelete(row); // Establecer el departamento a eliminar
        setOpenConfirmDialog(true); // Abrir el modal
    };

    const handleEditClick = (row) => {
        navigate('/management/departmentobj/manageDepartObj/editDepartObj', {
            state: { objetivo: row, objEmpDep },
        });
    };


    return (
        <>
            <TableContainer>
                <Table sx={{ minWidth: open ? 300 : 750 }} aria-labelledby="tableTitle">
                    <PerObjTableHeader
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

                                const isItemSelected = isSelected(row.titulo);
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
                                        
                                        
                                        <TableCell onClick={() => (open ? handleDrawerOpen(row) : '')} >{capitalizeFirstLetters(row.titulo)}</TableCell>
                                        <TableCell sx={open ? { display: 'none' } : {}}>{row.descripcion}</TableCell>
                                        {/*<TableCell sx={open ? { display: 'none' } : {}}>{row.estado ? 'En curso' : 'Pendiente'}</TableCell>*/}

                                        <TableCell align="center" sx={{ pr: 3, ...(open && { display: 'none' }) }}>
                                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                                <Tooltip title="Eliminar">
                                                    <IconButton 
                                                        color="error" 
                                                        size="small" 
                                                        aria-label="Eliminar"
                                                        onClick={() => handleDeleteClick(row)}
                                                        >
                                                        <DeleteTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center" sx={{ pr: 3, ...(open && { display: 'none'})}}>
                                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                                <Button>
                                                    Evaluar
                                                </Button>
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

            {/* Paginación de la tabla */}
            <TablePagination
                rowsPerPageOptions={[10, 25]} 
                component="div"
                sx={{ display: open ? 'none' : 'inherit' }}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página" 
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} 
            />

            {/* Modal de Confirmación */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar eliminación</DialogTitle>
                <DialogContent>
                    {rowToDelete?.estado ? (
                        <DialogContentText id="confirm-dialog-description" color="error">
                            Este objetivo está en curso y no se puede eliminar.
                        </DialogContentText>
                    ) : (
                        <DialogContentText id="confirm-dialog-description">
                            ¿Está seguro de que desea eliminar el objetivo <strong>{rowToDelete?.titulo ? capitalizeFirstLetters(rowToDelete.titulo) : null}</strong>?
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    {/* Deshabilitar el botón si el estado es true */}
                    <Button 
                        onClick={handlePersonalObjDelete} 
                        color="error" 
                        autoFocus 
                        disabled={rowToDelete?.estado}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>


            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </>
    );
};

PerObjTable.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setRowValue: PropTypes.func,
    listDepObj: PropTypes.array
};

export default PerObjTable;
