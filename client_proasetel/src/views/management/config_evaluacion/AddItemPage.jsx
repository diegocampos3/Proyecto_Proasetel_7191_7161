import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';

//third party
import * as yup from 'yup';
import { useFormik } from 'formik';

// yup validation-schema
const validationSchema = yup.object({
    // invoiceNumber: yup.string().required('Invoice Number is Required'),
    clave: yup.string().required('El ingreso de una clave es obligatorio'),
    customerName: yup.string().required('Customer Name is Required'),
    customerEmail: yup.string().email('Enter a valid email').required('Customer Email is Required'),
    // customerPhone: yup.string().min(10, 'Phone number should be of minimum 10 characters').required('Customer Phone is Required'),
    valor: yup.number().typeError('El valor tiene que ser un númwero').min(0, 'El valor debe ser mínimo 0').max(100, 'El valor debe ser máximo 100').required('El ingreso de un valor es obligatorio'),
    // customerAddress: yup.string().required('Customer Address is Required'),
    descripcion: yup.string().required('El ingreso de una descripción es obligatorio'),
    orderStatus: yup.string().required('Order Status is required')
});

// ==============================|| ADD ITEM PAGE ||============================== //

function AddItemPage({ handleAddItem, setAddItemClicked }) {

    const formik = useFormik({
        initialValues: {
            // invoiceNumber: '',
            clave: '',
            customerName: '',
            customerEmail: '',
            // customerPhone: '',
            valor: '',
            // customerAddress: '',
            descripcion: '',
            orderStatus: 'pending'
        },
        validationSchema,
        onSubmit: (values) => {
            if (values) {
                setOpen(true);
            }
        }
    });

    const [selectedItem, setSelectedItem] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [amount, setAmount] = useState(0);
    const [errors, setErrors] = useState({
        quantityError: ''
    });

    const itemList = [
        {
            id: 111,
            name: 'Product Name 1',
            amount: 260,
            desc: 'Product Description 1'
        },
        {
            id: 112,
            name: 'Product Name 2',
            amount: 200,
            desc: 'Product Description 2'
        },
        {
            id: 113,
            name: 'Product Name 3',
            amount: 300,
            desc: 'Product Description 3'
        }
    ];

    useEffect(() => {
        if (selectedItem.id) {
            setAmount(selectedItem.amount * selectedQuantity);
        }
    }, [selectedQuantity, selectedItem]);

    const handleChange = (event) => {
        const value = event.target.value;
        if (event.target.name === 'quantity') {
            if (Number(value) < 0) {
                setErrors({
                    ...errors,
                    quantityError: 'negative values not allowed'
                });
                setSelectedQuantity(value);
            } else if (Number(value) === 0) {
                setErrors({
                    ...errors,
                    quantityError: 'quantity can not be zero'
                });
                setSelectedQuantity(value);
            } else {
                setSelectedQuantity(value);
                setErrors({
                    ...errors,
                    quantityError: ''
                });
            }
        } else {
            const selectedOption = itemList.find((item) => item.id === value);
            setSelectedItem(selectedOption);
        }
    };

    const handleOk = () => {
        const data = {
            clave: formik.values.clave,
            valor: formik.values.valor,
            descripcion: formik.values.descripcion
        };

        console.log('dataaaaaaaaa',data)

        handleAddItem(data);
    };

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={4}>
                    <Stack>
                        <InputLabel required>Clave de la Respuesta</InputLabel>
                        <TextField
                            // id="invoiceNumber"
                            id="clave"
                            // name="invoiceNumber"
                            name="clave"
                            // value={formik.values.invoiceNumber}
                            value={formik.values.clave}
                            onBlur={formik.handleBlur}
                            // error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
                            error={formik.touched.clave && Boolean(formik.errors.clave)}
                            // helperText={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
                            helperText={formik.touched.clave && formik.errors.clave}
                            onChange={formik.handleChange}
                            fullWidth
                            placeholder="Clave"
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack>
                        <InputLabel required>Valor de la Respuesta</InputLabel>
                        <TextField
                            type="number"
                            fullWidth
                            // id="customerPhone"
                            id="valor"
                            // name="customerPhone"
                            name="valor"
                            // value={formik.values.customerPhone}
                            value={formik.values.valor}
                            onBlur={formik.handleBlur}
                            // error={formik.touched.customerPhone && Boolean(formik.errors.customerPhone)}
                            // helperText={formik.touched.customerPhone && formik.errors.customerPhone}
                            error={formik.touched.valor && Boolean(formik.errors.valor)}
                            helperText={formik.touched.valor && formik.errors.valor}
                            onChange={formik.handleChange}
                            placeholder="Valor"
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack>
                        <InputLabel required>Descripción de la Respuesta</InputLabel>
                        <TextField
                            fullWidth
                            // id="customerAddress"
                            // name="customerAddress"
                            id="descripcion"
                            name="descripcion"
                            // value={formik.values.customerAddress}
                            value={formik.values.descripcion}
                            onBlur={formik.handleBlur}
                            // error={formik.touched.customerAddress && Boolean(formik.errors.customerAddress)}
                            // helperText={formik.touched.customerAddress && formik.errors.customerAddress}
                            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                            helperText={formik.touched.descripcion && formik.errors.descripcion}
                            onChange={formik.handleChange}
                            multiline
                            placeholder="Descripción"
                        />
                    </Stack>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Product Name</Typography>
                        <FormControl>
                            <Select
                                fullWidth
                                displayEmpty
                                value={selectedItem?.id || ''}
                                onChange={handleChange}
                                input={<OutlinedInput />}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return (
                                            <Typography color="textSecondary" sx={{ lineHeight: '1.4375em' }}>
                                                Select Product
                                            </Typography>
                                        );
                                    }

                                    const selectedData = itemList.filter((item) => item.id === selected)[0];

                                    return (
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                            <Typography variant="subtitle1" sx={{ lineHeight: '1.4375em' }}>
                                                {selectedData.name}
                                            </Typography>
                                            <Typography>Rate : {selectedData.amount}</Typography>
                                        </Stack>
                                    );
                                }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem disabled value="">
                                    <Typography color="textSecondary">Select Product</Typography>
                                </MenuItem>
                                {itemList.map((item, i) => (
                                    <MenuItem key={i} value={item.id}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                            <Typography variant="subtitle1">{item.name}</Typography>
                                            <Typography>Rate : {item.amount}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Grid> */}
                {/* <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" id="itemQuantity">
                            Quantity
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            name="quantity"
                            value={selectedQuantity}
                            onChange={handleChange}
                            error={Boolean(errors.quantityError)}
                            helperText={errors.quantityError}
                            disabled={!selectedItem.id}
                        />
                    </Stack>
                </Grid> */}
                {/* <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" id="itemAmount">
                            Amount
                        </Typography>
                        <TextField fullWidth name="amount" value={amount} disabled />
                    </Stack>
                </Grid> */}
                <Grid item container justifyContent="flex-end">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button color="error" onClick={() => setAddItemClicked(false)}>
                            Cancelar
                        </Button>
                        <Button
                            //disabled={!selectedItem.id || !selectedQuantity || Boolean(errors.quantityError)}
                            variant="contained"
                            size="small"
                            onClick={handleOk}
                        >
                            Añadir
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}

AddItemPage.propTypes = {
    handleAddItem: PropTypes.func,
    setAddItemClicked: PropTypes.func
};

export default AddItemPage;
