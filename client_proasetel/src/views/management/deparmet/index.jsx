import {useEffect, useState} from 'react';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import ClientFilter from './ClientFilter';
import ClientDrawer from './ClientDrawer';
import ClientTable from './ClientTable';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getDepartments } from 'store/slices/department';

// ==============================|| DEPARMENT LIST ||============================== //

const ClientList = () => {
    const [open, setOpen] = useState(false);
    const [department, setDeparments] = useState([]);

    //const { detailCards } = useSelector((state) => state.user);
    const { departments}   = useSelector((state) => state.department)
    const [rowValue, setRowValue] = useState(null);

    useEffect(() => {
        setDeparments(departments)
    },[departments]);

    useEffect(() => {
        dispatch(getDepartments());
    },[])

    // React.useEffect(() => {
    //     setUsers(detailCards);
    // }, [detailCards]);

    // React.useEffect(() => {
    //     dispatch(getDetailCards());
    // }, []);

    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                {/*<ClientFilter {...{ users: detailCards, setUsers }} /> */}
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <ClientTable open={open} setOpen={setOpen} department={department} setRowValue={setRowValue} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        <ClientDrawer open={open} setOpen={setOpen} rowValue={rowValue} />
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ClientList;
