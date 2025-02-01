
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import PerObjTable from './PerObjTable';
import PerObjFilter from './PerObjFilter';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getStaffObj } from 'store/slices/staffobj';



// ==============================||  LISTA DE OBJETIVOS PERSONALES ||============================== //

const ObjDepList = () => {
    
    const [open, setOpen] = useState(false);
    const [listPerObj, setListPerObj] = useState([]);

    const { staffObjs } = useSelector((state) => state.staffObj);
    const [ rowValue, setRowValue] = useState(null);

    

    useEffect(() => {
        setListPerObj(staffObjs);
    }, [staffObjs]);

    useEffect(() => {
        dispatch(getStaffObj());
    }, [])
    
    console.log(getStaffObj)

    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <PerObjFilter {...{rows: staffObjs, setRows: setListPerObj}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <PerObjTable open={open} setOpen={setOpen} listPerObj={listPerObj} setRowValue={setRowValue} />
                    </Grid> 
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ObjDepList;
