import {useEffect, useState} from 'react';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import PerPropObjFilter from './PerPropObjFilter';
import PerPropObjTable from './PerPropObjTable';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getStaffObjProp } from 'store/slices/staffobj';



// ==============================||  LISTA DE OBJETIVOS PERSONALES PROPUESTOS ||============================== //

const ObjPersPList = () => {
    const [open, setOpen] = useState(false);
    const [listPersPrObj, setListPersPrObj] = useState([]);

    const { staffObjsProp } = useSelector((state) => state.staffObj);
    const [ rowValue, setRowValue] = useState(null);

    console.log(staffObjsProp)
    
    useEffect(() => {
        setListPersPrObj(staffObjsProp);
    }, [staffObjsProp]);

    useEffect(() => {
        dispatch(getStaffObjProp());
    }, [])
    


    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <PerPropObjFilter {...{rows: staffObjsProp, setRows: setListPersPrObj}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <PerPropObjTable open={open} setOpen={setOpen} listPersPrObj={listPersPrObj} setRowValue={setRowValue} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        {/*<ClientDrawer open={open} setOpen={setOpen} rowValue={rowValue} />*/}
                    </Grid>
                    
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ObjPersPList;
