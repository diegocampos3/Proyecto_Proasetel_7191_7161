import PropTypes from 'prop-types';

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

// assets
import DeleteIcon from '@mui/icons-material/Delete';

// table header options
const headCells = [
    
    {
        id: 'nombres',
        numeric: false,
        label: 'Nombres'
    },
    {
        id: 'apellidos',
        numeric: false,
        label: 'Apellidos'
    },
    // {
    //     id: 'email',
    //     numeric: false,
    //     label: 'Email'
    // },
    {
        id: 'estado',
        numeric: false,
        label: 'Estado'
    },

    {
        id: 'departamento',
        numeric: false,
        label: 'Departamento'
    },
    {
        id: 'rol',
        numeric: false,
        label: 'Rol'
    },
    
];

// ==============================|| STAFF - TABLE TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar sx={{ p: 0, pl: 2, pr: 1, ...(numSelected > 0 && { color: 'secondary.main' }) }}>
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

// ==============================|| LEAD - TABLE HEADER ||============================== //

function StaffTableHeader({ order, orderBy, numSelected, onRequestSort, selected }) {
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
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Typography component="span" sx={{ display: 'none' }}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Typography>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {numSelected <= 0 && <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}></TableCell>}
            </TableRow>
        </TableHead>
    );
}

StaffTableHeader.propTypes = {
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default StaffTableHeader;
