
import {useEffect, useState} from 'react';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import BusinessObjTable from './BusinessObjTable';
import BusinessObjFilter from './BusinessObjFilter';
// import ClientFilter from './ClientFilter';
// import ClientDrawer from './ClientDrawer';
// import ClientTable from './ClientTable';
// import EditDepartment from './EditDepartment';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getBusinessObj } from 'store/slices/businessobj';



// ==============================||  LISTA DE OBJETIVOS EMPRESARIALES ||============================== //

const ObjEmprList = () => {
    const [open, setOpen] = useState(false);
    const [listBusinessObj, setListBusinessObj] = useState([]);

    const { businessObjs } = useSelector((state) => state.businessObj);
    const [ rowValue, setRowValue] = useState(null);

    useEffect(() => {
        setListBusinessObj(businessObjs);
    }, [businessObjs]);

    useEffect(() => {
        dispatch(getBusinessObj());
    }, [])
    
    console.log(businessObjs)

    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <BusinessObjFilter {...{rows: businessObjs, setRows: setListBusinessObj}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <BusinessObjTable open={open} setOpen={setOpen} listBusinessObj={listBusinessObj} setRowValue={setRowValue} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        {/*<ClientDrawer open={open} setOpen={setOpen} rowValue={rowValue} />*/}
                    </Grid>
                    
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ObjEmprList;
