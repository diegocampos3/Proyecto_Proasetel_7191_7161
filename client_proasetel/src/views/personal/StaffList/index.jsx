import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project-imports
import StaffDrawer from './StaffDrawer';
import StaffTable from './StaffTable';
import Filter from './Filter';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getPersonal } from 'store/slices/personal';

// ==============================|| STAFF LIST ||============================== //

const StaffList = () => {
    const [rows, setRows] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { personal } = useSelector((state) => state.personal);

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    useEffect(() => {
        dispatch(getPersonal());
    }, []);

    useEffect(() => {
        console.log("Datos de personal extraídos:", personal);
        setRows(personal);
    }, [personal]);

    return (
        <MainCard content={false}>
            {/* table */}
            <Box sx={{ display: drawerOpen ? 'flex' : 'block' }}>
                <Grid container sx={{ position: 'relative', display: drawerOpen ? 'flex' : 'block' }}>
                    <Grid item xs={12} {...{ sm: drawerOpen && 8 }}>
                        <Filter {...{ handleToggleDrawer, rows: personal, setRows }} />
                        <StaffTable {...{ rows }} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        {...{ sm: drawerOpen && 4 }}
                        sx={{
                            borderLeft: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <StaffDrawer
                            {...{
                                open: drawerOpen,
                                handleToggleDrawer,
                                rows: personal,
                                setRows,
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default StaffList;
