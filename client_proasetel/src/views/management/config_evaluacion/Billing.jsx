import React from 'react';
import {useEffect, useState} from 'react';
import { dispatch, useSelector } from 'store';

// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// project imports
import { gridSpacing } from 'store/constant';
import { getFormularios } from 'store/slices/formulario';

// select options
const cities = [
    {
        value: '1',
        label: 'Los Angeles'
    },
    {
        value: '2',
        label: 'Chicago'
    },
    {
        value: '3',
        label: 'Phoenix'
    },
    {
        value: '4',
        label: 'San Antonio'
    }
];

const countries = [
    {
        value: '1',
        label: 'India'
    },
    {
        value: '2',
        label: 'France'
    },
    {
        value: '3',
        label: 'USA'
    },
    {
        value: '4',
        label: 'UAE'
    }
];

// ==============================|| PROFILE 2 - BILLING ||============================== //

const Billing = () => {
    const [city, setCity] = React.useState('1');

    const[formulario,setFormulario]= React.useState(''); //nuevo


    const handleChangeCity = (event) => {
        // setCity(event.target.value);
        setFormulario(event.target.value);
    };

    const [Country, setCountry] = React.useState('1');
    const handleSelectChange1 = (event) => {
        setCountry(event.target.value);
    };

    const [state1, setState1] = React.useState({
        checkedA: true
    });
    const handleChangeState1 = (event) => {
        setState1({ ...state1, [event.target.name]: event.target.checked });
    };

    //traer los formularios
    const { formularios } = useSelector((state) => state.formulario)
    const [listFormularios, setListFormularios] = useState([]) 

    
    useEffect(() => {
        setListFormularios(formularios.filter((formulario) => !formulario.estado));
    }, [formularios]);

    //console.log('aaaaaaa', listFormularios)

    useEffect(() => {
        dispatch(getFormularios());
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            {/* <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Block No#" defaultValue="16657" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Apartment Name" defaultValue=" Dardan Ranch" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Street Line 1" defaultValue="Nathaniel Ports" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Street Line 2" defaultValue="nr. Oran Walks" />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Postcode" defaultValue="395005" />
            </Grid> */}
            <Grid item xs={12} sm={12}>
                <TextField id="standard-select-category" select label="Seleccione un formulario" value={formulario} fullWidth onChange={handleChangeCity}>
                    {listFormularios.map((option) => (
                        <MenuItem key={option.idFormulario} value={option.idFormulario}>
                            {option.nombre}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            {/* <Grid item xs={12} sm={4}>
                <TextField
                    id="standard-select-country"
                    select
                    label="Select Country"
                    value={Country}
                    fullWidth
                    onChange={handleSelectChange1}
                >
                    {countries.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid> */}
            {/* <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox checked={state1.checkedA} onChange={handleChangeState1} name="checkedA" color="primary" />}
                    label="Same as billing address"
                />
            </Grid> */}
        </Grid>
    );
};

export default Billing;
