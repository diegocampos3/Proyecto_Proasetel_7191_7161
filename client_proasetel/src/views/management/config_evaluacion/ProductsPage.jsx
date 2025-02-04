import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// assets
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// ==============================|| PRODUCTS-DATA PAGE ||============================== //

function ProductsPage({ productsData, deleteProductHandler, editProductHandler }) {
    console.log('aaaaaaarender', productsData)
    return (
        <>
            {productsData.length ? (
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ pl: 3 }}>Descripción</TableCell>
                                    <TableCell align="right">Clave</TableCell>
                                    <TableCell align="right">Valor</TableCell>
                                    {/* <TableCell align="right">Total</TableCell> */}
                                    <TableCell align="right" sx={{ pr: 3 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ pl: 3 }}>
                                            <Typography variant="body2">{row.descripcion}</Typography>
                                            {/* <Typography variant="body2">{row.descripcion}</Typography> */}
                                        </TableCell>
                                        <TableCell align="right">{row.clave}</TableCell>
                                        <TableCell align="right">{row.valor}%</TableCell>
                                        {/* <TableCell align="right">${row.total}</TableCell> */}
                                        <TableCell sx={{ pr: 1 }} align="right">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => editProductHandler(row)}
                                                aria-label="'Edit'"
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                size="small"
                                                onClick={() => deleteProductHandler(row)}
                                                aria-label="'Delete'"
                                            >
                                                <DeleteTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            ) : null}
        </>
    );
}

ProductsPage.propTypes = {
    productsData: PropTypes.array,
    deleteProductHandler: PropTypes.func,
    editProductHandler: PropTypes.func
};

export default ProductsPage;
