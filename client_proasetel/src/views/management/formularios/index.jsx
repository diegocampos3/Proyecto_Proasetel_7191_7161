import React from 'react';
import { useState } from 'react';

import { useFetchFormularios } from 'api/formularios/fetchformularios';
import { DataGrid } from '@mui/x-data-grid';
import { columnasDatagrid, filtrarOperador, textoFiltrosDataGrid } from 'utils/datagridparams';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// ICONOS
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from 'ui-component/extended/Chip';
import SearchIcon from '@mui/icons-material/Search';

//MUI
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// project imports
import FormularioAdd from './FormularioAdd';
import {useRemoveFormulario} from 'store/slices/formulario';
import FormularioEdit from './FormularioEdit';
import MainCard from 'ui-component/cards/MainCard';

const UsuariosListado = () => {
    const navigate = useNavigate();

    // Estados para el modal
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [rowToDelete, setRowToDelete] = React.useState(null);

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    //Estados para la edicion 
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [formularioToEdit, setFormularioToEdit] = React.useState(null);

    


    // ---------------------------  HANDLE's  -----------------------------//

    //Para los mensajes de confirmacion 
    const handleSnackbarClose = () => setSnackbarOpen(false);

    // //para abrir y cerrar el dialogo de edicion 
    const handleClickOpenEditDialog = (formulario, index) => {
        setFormularioToEdit(formulario); // Establece el formulario que se va a editar
        setOpenEditDialog(true); // Abre el diálogo de edición
    };
    
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false); // Cierra el diálogo de edición
        setFormularioToEdit(null); // Limpia el formulario almacenado
    };

    // Redirige a la página de detalles del formulario
    const handleRowClick = (params, event) => {

        if (event.target.closest('button') || event.target.closest('svg')) {
            return;
        }

        navigate(`/management/Items/FormularioPreguntasList/${params.row.id}`);
    };

    //para eliminar formulario 
    const removeFormulario = useRemoveFormulario();

    const capitalizeFirstLetters = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleFormularioDelete = async () => {
        try {
        const result = await removeFormulario(rowToDelete.idFormulario); 
    
        if (result.success) {
            setSnackbarMessage('Eliminación exitosa.');
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage(result.error);
            setSnackbarSeverity('error');
        }
        } catch (error) {
        // Manejar errores inesperados
        setSnackbarMessage('Error inesperado al eliminar.');
        setSnackbarSeverity('error');
        } 
        // Cerrar el diálogo de confirmación
        setOpenConfirmDialog(false);

        // Abrir el Snackbar después de actualizar los estados
        setTimeout(() => {
            setSnackbarOpen(true);
        }, 0);
    };

    const handleDeleteClick = (row) => {
        setRowToDelete(row); // Establecer el departamento a eliminar
        setOpenConfirmDialog(true); // Abrir el modal
    };


    // ---------- Anadir un nuevo formulario ------------
    const [open, setOpen] = React.useState(false);
    const handleClickOpenDialog = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const { data } = useFetchFormularios();

    const columnasBase = [
        { field: 'numero', headerName: '#', filterable: true, sortable: true, filterOperators: filtrarOperador(['contains']),           
            minWidth: 60,
            flex: 0.2,
            renderCell: (params) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {params.value}
                </Box>
            )
        },
        { field: 'nombre', headerName: 'Nombre', filterable: true, sortable: true, filterOperators: filtrarOperador(['contains']),
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <Box
                    sx={{
                        whiteSpace: 'normal', // Permite múltiples líneas
                        wordWrap: 'break-word',
                        width: '100%',
                        padding: '0.5rem',
                    }}
                >
                    {params.value}
                </Box>
            )
        },
        { field: 'descripcion', headerName: 'Descripción', filterable: true, sortable: true, filterOperators: filtrarOperador(['contains']),
            minWidth: 200,
            flex: 2, 
            renderCell: (params) => (
                <Box
                    sx={{
                        whiteSpace: 'normal', // Permite texto en varias líneas
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        width: '100%',
                        padding: '0.5rem',
                    }}
                >
                    {params.value}
                </Box>
            )
        },
        {
            field: 'estado', // Asegúrate de que este campo sea el que contiene el estado
            headerName: 'Estado',
            filterable: true,
            sortable: false,
            minWidth: 150,
            flex: 0.5,
            renderCell: (params) => {
                const { value } = params;
                return (
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%', // Se expande en función del contenido
                    }}
                >
                    <Chip
                        label={value ? 'Usado' : 'Nuevo'} 
                        size="small" 
                        chipcolor={value ? 'success' : 'primary'} 
                        sx={{
                            whiteSpace: 'normal', // Permite varias líneas
                            overflow: 'visible', // Evita truncamiento
                            textOverflow: 'clip', // Muestra todo el texto sin recortes
                            maxWidth: '100%', // Limita el ancho al tamaño disponible
                            padding: '0.5rem', // Opcional para estilo
                        }}
                    />
                    </Box>
                );
            }
        },
        {
            field: 'botones_accion',
            headerName: 'Acciones',
            filterable: false,
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => {
                if (params.row.estado === false) {
                    return (
                        <>
                            <Tooltip title="Editar Formulario">
                                <IconButton onClick={() => handleClickOpenEditDialog(params.row, params.rowIndex)}>
                                    <EditTwoToneIcon />
                                </IconButton>
                            </Tooltip>

                            {<Tooltip title="Eliminar Formulario">
                                <IconButton onClick={() => handleDeleteClick(params.row)}>
                                    <DeleteIcon sx={{ color: '#298FA6' }} />
                                </IconButton>
                            </Tooltip>}
                        </>
                    );
                }
                // Si el estado no es "Nuevo" (false), no muestra los botones
                return null;
            }
        }
    ];

    const columnasTabla = columnasDatagrid(columnasBase);

    const dataFilasFuncion = () => {
        let contador = 0;

        return (
            data?.map((item) => {
                return {
                    id: item.idFormulario,
                    numero: ++contador,
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    estado: item.estado,
                    ...item, // Copia las demás propiedades de `item`
                };
            }) ?? []
        );
    };

    // Asigna el resultado de la función a `dataFilas`
    const dataFilas = dataFilasFuncion();

    //para la busqueda en la barra de busqueda

    const [search, setSearch] = React.useState('');
    const [originalRows, setOriginalRows] = React.useState([]);
    const [filteredRows, setFilteredRows] = React.useState([]);

    React.useEffect(() => {
        const filas = dataFilasFuncion();
        setOriginalRows(filas);
        setFilteredRows(filas);
    }, [data]);

    const handleSearch = (event) => {
        const newString = event.target.value;
        setSearch(newString);
    
        if (newString) {
            const searchLower = newString.toLowerCase();
            const filtered = originalRows.filter(row => {
                return ['nombre', 'descripcion'].some(property => 
                    row[property]?.toString().toLowerCase().includes(searchLower)
                );
            });
            setFilteredRows(filtered);
        } else {
            setFilteredRows(originalRows);
        }
    };


    return (
        <>
            <MainCard title="Formularios" content={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                        onChange={handleSearch}
                        placeholder="Búsqueda de formularios"
                        value={search}
                        size="small"
                        sx={{ width: { xs: 1, sm: 'auto' }, marginTop: 2, marginLeft:3, marginBottom:4 }}
                    />
                {/* </div> */}
                {/* <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white' }}> */}
                    <Tooltip title="Añadir un nuevo formulario">
                        <Fab
                            color="primary"
                            size="small"
                            onClick={handleClickOpenDialog}
                            sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32, margin: '1rem 3rem 1rem 2rem' }}
                        >
                            <AddIcon fontSize="small" />
                        </Fab>
                    </Tooltip>
                    <FormularioAdd open={open} handleCloseDialog={handleCloseDialog} isOpen={open} />
                </div>
            <DataGrid
                // rows={dataFilas}
                rows={filteredRows}
                columns={columnasTabla}
                autoHeight
                getRowHeight={() => 'auto'} // Ajusta dinámicamente el alto de las filas
                sx={{
                    width: '100%',
                    bgcolor: '#fff',
                    '& .text-red': { color: '#f44336 !important', fontWeight: 'bold' },
                    '& .text-orange': { color: '#ff9800 !important', fontWeight: 'bold' },
                    '& .text-green': { color: '#4caf50 !important', fontWeight: 'bold' },
                    '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
                    '& .MuiDataGrid-row': { cursor: 'pointer' },
                }}
                pagination
                pageSizeOptions={[20, 25, 50, 100]}
                slotProps={{
                    pagination: { labelRowsPerPage: 'Filas por página' }
                }}

                paginationMode="server"
                filterDebounceMs={700}
                localeText={textoFiltrosDataGrid}
                checkboxSelection={false}
                isRowSelectable={() => false}
                disableColumnMenu
                onRowClick={handleRowClick}
            />
        </MainCard>
        <Dialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            >
            <DialogTitle id="confirm-dialog-title">Confirmar eliminación</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    ¿Está seguro de que desea eliminar el formulario <strong>{rowToDelete?.nombre ? capitalizeFirstLetters(rowToDelete.nombre) : null}</strong>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleFormularioDelete} color="error" autoFocus>
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
        <FormularioEdit
            open={openEditDialog}
            handleCloseDialog={handleCloseEditDialog}
            formularioToEdit={formularioToEdit}
            // isOpen={openEditDialog}
        />
        </>
    );
};

export default UsuariosListado; 