import React, { useEffect, useState } from 'react';
import { dispatch, useSelector } from 'store';

// material-ui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import DialogTitle from '@mui/material/DialogTitle';
import MuiAlert from '@mui/material/Alert';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import '@mui/lab';

// project imports
import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';
import {getRespuestas, removeRespuesta, addRespuesta} from 'store/slices/respuestasPreguntas';
import EditRespuestaModal from './EditRespuestaModal';

// third-party
import * as yup from 'yup';
import ProductsPage from './ProductsPage';
// import TotalCard from './TotalCard';
import { useFormik } from 'formik';

// yup validation-schema
const validationSchema = yup.object({
    invoiceNumber: yup.string().required('Invoice Number is Required'),
    customerName: yup.string().required('Customer Name is Required'),
    customerEmail: yup.string().email('Enter a valid email').required('Customer Email is Required'),
    customerPhone: yup.string().min(10, 'Phone number should be of minimum 10 characters').required('Customer Phone is Required'),
    customerAddress: yup.string().required('Customer Address is Required'),
    orderStatus: yup.string().required('Order Status is required')
});

const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// ==============================|| CREATE INVOICE ||============================== //

function CreateInvoice() {
    const formik = useFormik({
        initialValues: {
            invoiceNumber: '',
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            customerAddress: '',
            orderStatus: 'pending'
        },
        validationSchema,
        onSubmit: (values) => {
            if (values) {
                setOpen(true);
            }
        }
    });

    //traeer los datos de las respuestasPreguntas
    const[listRespuestas,setListRespuestas]= useState([]) ; //nuevo
    const { respuestas } = useSelector((state) => state.respuestasPreguntas)

    useEffect(() => {
        setListRespuestas(respuestas);
    }, [respuestas]);

    //console.log('aaaaaaa', listFormularios)

    useEffect(() => {
        dispatch(getRespuestas());
    }, []);



    // array of products
    const initialProducsData = [
        {
            id: 1,
            product: 'Logo Design',
            description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
            quantity: 6,
            amount: 200.0,
            total: 1200.0
        },
        {
            id: 2,
            product: 'Landing Page',
            description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
            quantity: 7,
            amount: 100.0,
            total: 700.0
        },
        {
            id: 3,
            product: 'Admin Template',
            description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
            quantity: 5,
            amount: 150.0,
            total: 750.0
        }
    ];

    const [allAmounts, setAllAmounts] = useState({
        subTotal: 0,
        appliedTaxValue: 0.1,
        appliedDiscountValue: 0.05,
        taxesAmount: 0,
        discountAmount: 0,
        totalAmount: 0
    });

    // const [productsData, setProductsData] = useState(initialProducsData);
    // console.log('aaaaaaaaaa', listRespuestas)
    const [productsData, setProductsData] = useState([]);
    const [open, setOpen] = useState(false);
    const [valueBasic, setValueBasic] = React.useState(new Date());
    const [addItemClicked, setAddItemClicked] = useState(false);

    //actualizar productsData cada vez que listRespuestas cambie.
    useEffect(() => {
        setProductsData(listRespuestas);
    }, [listRespuestas]);

    // calculates costs when order-details change
    // useEffect(() => {
    //     const amounts = {
    //         subTotal: 0,
    //         appliedTaxValue: 0.1,
    //         appliedDiscountValue: 0.05,
    //         taxesAmount: 0,
    //         discountAmount: 0,
    //         totalAmount: 0
    //     };
    //     productsData.forEach((item) => {
    //         amounts.subTotal += item.total;
    //     });
    //     amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
    //     amounts.discountAmount = (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
    //     amounts.totalAmount = amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
    //     setAllAmounts(amounts);
    // }, [productsData]);

    // Mensajes de confirmación
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    //ventana snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    //para la edicion
    const [editingRespuesta, setEditingRespuesta] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const editProductHandler = (row) =>{
        setEditingRespuesta(row);
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingRespuesta(null);
    };


    // to delete row in order details
    const [rowToDelete, setRowToDelete] = React.useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);


    const deleteProductHandler = (row) => {
        // setProductsData(productsData.filter((item) => item.id !== id));
        setRowToDelete(row); // Guarda la fila que se va a eliminar
        setOpenConfirmDialog(true); // Abre el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const handleConfirmDelete = async () => {
        if (rowToDelete) {

            const result = await dispatch(removeRespuesta(rowToDelete.idRespuestaPregunta));

            if (result.success) {
                setSnackbarMessage('Eliminación exitosa.');
                setSnackbarSeverity('success');

                // setRows(prevRows => prevRows.filter(row => row.idPregunta !== rowToDelete.idPregunta));
                
            } else{
                setSnackbarMessage(result.error); 
                setSnackbarSeverity('error');
            }
            setOpenConfirmDialog(false);
            setSnackbarOpen(true);
        }
    };





    // Dialog Handler
    const handleDialogOk = () => {
        setOpen(false);
        formik.resetForm();
    };

    // add item handler
    // const handleAddItem = (addingData) => {
    const handleAddItem = async(addingData) => {

        const resultadd = await dispatch(addRespuesta(addingData));

        if (resultadd.success) {
            setSnackbarMessage('Agregación exitosa.');
            setSnackbarSeverity('success');

            setProductsData([
                ...productsData,
                {
                    idRespuestaPregunta: addingData.idRespuestaPregunta,
                    clave: addingData.clave,
                    descripcion: addingData.descripcion,
                    valor: addingData.valor,
                    // amount: addingData.amount,
                    // total: addingData.totalAmount
                }
            ]);
            
        } else{
            setSnackbarMessage(resultadd.error); 
            setSnackbarSeverity('error');
        }
        setOpenConfirmDialog(false);
        setSnackbarOpen(true);

        setAddItemClicked(false);
    };

    return (
        <>
            <MainCard title="Opciones de Respuesta">
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={gridSpacing}>
                        {/* <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Invoice Number</InputLabel>
                                <TextField
                                    id="invoiceNumber"
                                    name="invoiceNumber"
                                    value={formik.values.invoiceNumber}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
                                    helperText={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    placeholder="Invoice #"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Customer Name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="customerName"
                                    name="customerName"
                                    value={formik.values.customerName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                                    helperText={formik.touched.customerName && formik.errors.customerName}
                                    placeholder="Alex Z."
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Customer Email</InputLabel>
                                <TextField
                                    type="email"
                                    fullWidth
                                    id="customerEmail"
                                    name="customerEmail"
                                    value={formik.values.customerEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.customerEmail && Boolean(formik.errors.customerEmail)}
                                    helperText={formik.touched.customerEmail && formik.errors.customerEmail}
                                    placeholder="alex@company.com"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack>
                                <InputLabel required>Customer Contact Numer</InputLabel>
                                <TextField
                                    type="number"
                                    fullWidth
                                    id="customerPhone"
                                    name="customerPhone"
                                    value={formik.values.customerPhone}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.customerPhone && Boolean(formik.errors.customerPhone)}
                                    helperText={formik.touched.customerPhone && formik.errors.customerPhone}
                                    onChange={formik.handleChange}
                                    placeholder="+ 00 00000 00000"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack>
                                <InputLabel required>Customer Address</InputLabel>
                                <TextField
                                    fullWidth
                                    id="customerAddress"
                                    name="customerAddress"
                                    value={formik.values.customerAddress}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.customerAddress && Boolean(formik.errors.customerAddress)}
                                    helperText={formik.touched.customerAddress && formik.errors.customerAddress}
                                    onChange={formik.handleChange}
                                    multiline
                                    placeholder="Enter Address"
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack>
                                <InputLabel required>Invoice Date</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        format="dd/MM/yyyy"
                                        slotProps={{ textField: { fullWidth: true } }}
                                        value={valueBasic}
                                        onChange={(newValue) => {
                                            setValueBasic(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack>
                                <InputLabel required>Status</InputLabel>
                                <Select
                                    id="orderStatus"
                                    name="orderStatus"
                                    defaultValue={formik.values.orderStatus}
                                    value={formik.values.orderStatus}
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="refund">Refund</MenuItem>
                                    <MenuItem value="paid">Paid</MenuItem>
                                </Select>
                                {formik.errors.orderStatus && <FormHelperText error>{formik.errors.orderStatus}</FormHelperText>}
                            </Stack>
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <Divider />
                        </Grid> */}

                        <ProductsPage productsData={productsData} deleteProductHandler={deleteProductHandler} editProductHandler={editProductHandler} />
                        <EditRespuestaModal open={modalOpen} onClose={handleCloseModal} respuesta={editingRespuesta}/>

                        {addItemClicked ? (
                            <Grid item xs={12}>
                                <AddItemPage handleAddItem={handleAddItem} setAddItemClicked={setAddItemClicked} />
                            </Grid>
                        ) : (
                            <Grid item>
                                <Button variant="text" onClick={() => setAddItemClicked(true)}>
                                    + Añadir respuesta
                                </Button>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* <TotalCard productsData={productsData} allAmounts={allAmounts} /> */}

                        {/* <Grid item xs={12}>
                            <Stack>
                                <InputLabel required>Terms and Condition:</InputLabel>
                                <TextField
                                    fullWidth
                                    id="customerAddress"
                                    name="customerAddress"
                                    defaultValue="I acknowledge terms and conditions."
                                    multiline
                                    placeholder="Enter Address"
                                />
                            </Stack>
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                            <Button variant="contained" type="submit">
                                Add Invoice
                            </Button>
                        </Grid> */}
                        {/* <Grid item>
                            <Dialog open={open}>
                                <DialogContent>
                                    <DialogContentText sx={{ fontWeight: 500, color: `secondary.dark` }}>
                                        Invoice Created Successfully
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ pr: '20px' }}>
                                    <Button autoFocus variant="contained" onClick={handleDialogOk}>
                                        Ok
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid> */}
                    </Grid>
                </form>

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
                            ¿Está seguro de que desea eliminar la respuesta de clave{' '}
                            <strong>{rowToDelete?.clave ? rowToDelete.clave : null}</strong>?
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
            </MainCard>
        </>
    );
}

export default CreateInvoice;
