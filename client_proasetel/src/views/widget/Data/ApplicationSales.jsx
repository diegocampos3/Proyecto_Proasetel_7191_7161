import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// table data
function createData(name, designation, product, date, badgeText, badgeType) {
    return { name, designation, product, date, badgeText, badgeType };
}

const rows = [
    createData('Materially', 'Powerful Admin Theme', '16,300', '$53', '$15,652'),
    createData('Photoshop', 'Design Software', '26,421', '$35', '$8,785'),
    createData('Guruable', 'Best Admin Template', '8,265', '$98', '$9,652'),
    createData('Flatable', 'Admin App', '10,652', '$20', '$7,856')
];
// =========================|| DATA WIDGET - APPLICATION SALES CARD ||========================= //

const ApplicationSales = ({ title }) => (
    <MainCard title={title} content={false}>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>Application</TableCell>
                        <TableCell align="right">Sales</TableCell>
                        <TableCell align="right">Avg. Price</TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                            Total
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow hover key={index}>
                            <TableCell sx={{ pl: 3 }}>
                                <Typography variant="subtitle1">{row.name}</Typography>
                                <Typography variant="subtitle2">{row.designation}</Typography>
                            </TableCell>
                            <TableCell align="right">{row.product}</TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                            <TableCell align="right" sx={{ pr: 3 }}>
                                <span>{row.badgeText}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="text" size="small">
                View all Projects
            </Button>
        </CardActions>
    </MainCard>
);

ApplicationSales.propTypes = {
    title: PropTypes.string
};

export default ApplicationSales;
