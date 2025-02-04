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
import FeedbackTableHeader from './FeedbackTableHeader';

// assets
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { dispatch } from 'store';
import { verificarUser } from 'store/slices/feedback';

// ----------------------------------------------------------------------

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const FeedbackTable = ({ open, setOpen, listPeriodsEva, setRowValue}) => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [evaluatedRows, setEvaluatedRows] = React.useState({});
    const navigate = useNavigate();

    React.useEffect(() => {
        setRows(listPeriodsEva);
        checkEvaluations();
    }, [listPeriodsEva]);

    const checkEvaluations = async () => {
        const evaluations = {};
        for (const row of listPeriodsEva) {
            const data = { peridoEvaId: row.idPeriodoEva, userId: row.userId };
            try {
                const response = await dispatch(verificarUser(data));
                evaluations[row.idPeriodoEva] = response;
            } catch (error) {
                console.error('Error al verificar usuario:', error);
                evaluations[row.idPeriodoEva] = false;
            }
        }
        setEvaluatedRows(evaluations);
    };

    const handleAddClick = (row) => {
        navigate('/evaluated-staff/feedback/addFeedback', {
            state: { feedback: row }
        });
    };

    const isPastDate = (fechaFin) => {
        const today = new Date();
        const cierreDate = new Date(fechaFin);
        return cierreDate < today;
    };

    const formatDate = (fechaFin) => {
        const date = new Date(fechaFin);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    return (
        <>
            <TableContainer>
                <Table sx={{ minWidth: open ? 300 : 750 }} aria-labelledby="tableTitle">
                    <FeedbackTableHeader
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        rowCount={rows.length}
                        selected={selected}
                        drawer={open}
                    />
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            const isEvaluated = evaluatedRows[row.idPeriodoEva];
                            const isBlocked = isPastDate(row.fechaFin) || isEvaluated;
                            return (
                                <TableRow hover key={index} tabIndex={-1}>
                                    <TableCell>{row.periodo}</TableCell>
                                    <TableCell>{row.descripcion}</TableCell>
                                    <TableCell>{formatDate(row.fechaFin)}</TableCell>
                                    <TableCell>{row.supervisor}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                            <Button
                                                onClick={() => handleAddClick(row)}
                                                disabled={isBlocked}
                                                sx={{
                                                    backgroundColor: isEvaluated ? '#8BC34A' : 'primary.main',
                                                    color: 'white',
                                                    '&:disabled': {
                                                        backgroundColor: isEvaluated ? '#8BC34A' : 'grey',
                                                        color: 'white',
                                                    }
                                                }}
                                            >
                                                {isEvaluated ? 'Evaluado' : 'Evaluar'}
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
        </>
    );
};

FeedbackTable.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setRowValue: PropTypes.func,
    listPeriodsEva: PropTypes.array
};

export default FeedbackTable;
