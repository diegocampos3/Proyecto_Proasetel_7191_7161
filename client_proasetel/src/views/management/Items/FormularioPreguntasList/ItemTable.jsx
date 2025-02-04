import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { dispatch, useSelector } from 'store';

// material-ui
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

// project imports
import ItemTableHeader from './ItemTableHeader';
import EditFormularioPreguntas from '../EditFormularioPreguntas'; 
import { removePregunta } from 'store/slices/formularioPregunta';


// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// table sort
function descendingComparator(a, b, orderBy) {
    //para ordenacion de #
    if (orderBy === 'contador') {
        // Ordenar por el índice de la fila
        return b.index - a.index;
    }
    //fin
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

// ==============================|| ITEM LIST - TABLE ||============================== //

const ItemTable = ({ open, setOpen, listPreguntasFormulario ,setRowValue }) => {
    const theme = useTheme();

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedRow, setSelectedRow] = React.useState(null);

    //para la edicion 
    const [editModalOpen, setEditModalOpen] = useState(false); // Estado para controlar el modal de edición
    const [selectedPregunta, setSelectedPregunta] = useState(null); // Estado para almacenar la pregunta seleccionada

    // Función para abrir el modal de edición
    const handleEditClick = (pregunta) => {
        setSelectedPregunta(pregunta); // Guarda la pregunta seleccionada
        setEditModalOpen(true); // Abre el modal
    };

    // Estados para el diálogo de confirmación
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [rowToDelete, setRowToDelete] = React.useState(null);

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');



    


    //ventanas
    const handleDrawerOpen = (row) => {
        setRowValue(row);
        setOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Función para abrir el diálogo de confirmación
    const handleDeleteClick = (row) => {
        setRowToDelete(row); // Guarda la fila que se va a eliminar
        setOpenConfirmDialog(true); // Abre el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const handleConfirmDelete = async () => {
        if (rowToDelete) {

            const result = await dispatch(removePregunta(rowToDelete.idPregunta));

            if (result.success) {
                setSnackbarMessage('Eliminación exitosa.');
                setSnackbarSeverity('success');

                setRows(prevRows => prevRows.filter(row => row.idPregunta !== rowToDelete.idPregunta));
                
            } else{
                setSnackbarMessage(result.error); 
                setSnackbarSeverity('error');
            }
            setOpenConfirmDialog(false);
            setSnackbarOpen(true);
        }
    };

    // useEffect(() => {
    //     console.log('Nuevo estado de rows:', rows);
    // }, [rows]);


    React.useEffect(() => {
        setRows(listPreguntasFormulario);
    }, [listPreguntasFormulario]);


    // Función para capitalizar la primera letra de cada palabra
    // const capitalizeFirstLetters = (str) => {
    //     return str.replace(/\b\w/g, (char) => char.toUpperCase());
    // };

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
                const newSelectedId = rows.map((n) => n.name);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (idPregunta) => selected.indexOf(idPregunta) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <>
            <TableContainer>
                <Table sx={{ minWidth: open ? 300 : 750 }} aria-labelledby="tableTitle">
                    <ItemTableHeader
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        theme={theme}
                        selected={selected}
                        drawer={open}
                    />
                    <TableBody>
                        {stableSort(
                        rows,
                        getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {

                            if (typeof row === 'number') return null;
                            const isItemSelected = isSelected(row.idPregunta);
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
                                    {/* <TableCell onClick={() => (open ? handleDrawerOpen(row) : '')}>
                                    <Typography variant="h5" >{row.idPregunta.slice(0,6)}</Typography>
                                    </TableCell> */}
                                        
                                    <TableCell onClick={() => (open ? handleDrawerOpen(row) : '')} sx={{ pl: 7 }} >{row.pregunta}</TableCell>
                                    {/* <TableCell sx={open ? { display: 'none' } : {}}>{row.pregunta}</TableCell> */}

                                    {/* <TableCell style={{ textAlign: 'center' }}>{row.index + 1}</TableCell> */}

                                    {/* <TableCell>{row.pregunta}</TableCell> */}

                                    <TableCell sx={{ pr: 3, ...(open && { display: 'none' }) }}>
                                            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                                <Tooltip title="Editar">
                                                    <IconButton color="primary" size="small" aria-label="Edit" onClick={() => handleEditClick(row)}>
                                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton color="terciary" size="small" aria-label="Delete" onClick={() => handleDeleteClick(row)}>
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
                                <TableCell colSpan={3} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Modal de edición */}
            {selectedPregunta && (
                <EditFormularioPreguntas
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    pregunta={selectedPregunta}
                />
            )}
            {/* Diálogo de confirmación para eliminar */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
            <DialogTitle id="confirm-dialog-title">Confirmar eliminación</DialogTitle>
            <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        ¿Está seguro de que desea eliminar la pregunta{' '}
                        <strong>{rowToDelete?.pregunta ? rowToDelete.pregunta : null}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
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

ItemTable.propTypes = {
    open: PropTypes.bool,
    setOpen:PropTypes.func,
    setRowValue: PropTypes.func,
    listPreguntasFormulario: PropTypes.array
};

export default ItemTable;
