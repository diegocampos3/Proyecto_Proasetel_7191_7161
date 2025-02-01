
import {useEffect, useState} from 'react';

// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports

import DepartmentDrawer from './DepartmentDrawer';
import DepartmentFilter from './DepartmentFilter';
import DepartmentTable from './DepartmentTable';
import EditDepartment from './EditDepartment';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getDepartments, updateDepartment } from 'store/slices/department';

// ==============================|| DEPARTMENT LIST ||============================== //

const DepartmentList = () => {
    const [open, setOpen] = useState(false);
    const [listDepartments, setListDepartments] = useState([]) 

    const { departments } = useSelector((state) => state.department)
    const [rowValue, setRowValue] = useState(null);


    useEffect(() => {
        setListDepartments(departments);
    }, [departments]);

    useEffect(() => {
        dispatch(getDepartments());
    }, []);


    


    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <DepartmentFilter {...{rows: departments, setRows: setListDepartments}} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <DepartmentTable  open={open} setOpen={setOpen} listDepartments={listDepartments} setRowValue={setRowValue} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        <DepartmentDrawer open={open} setOpen={setOpen} rowValue={rowValue} />
                    </Grid>
                    
                </Grid>
            </Box>
        </MainCard>
    );
};

export default DepartmentList;
