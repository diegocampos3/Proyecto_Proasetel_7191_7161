
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import DepObjTable from './DepObjTable';
import DepObjFilter from './DepObjFilter';
// import ClientFilter from './ClientFilter';
// import ClientDrawer from './ClientDrawer';
// import ClientTable from './ClientTable';
// import EditDepartment from './EditDepartment';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getObjDep } from 'store/slices/departmentobj';



// ==============================||  LISTA DE OBJETIVOS EMPRESARIALES ||============================== //

const ObjDepList = () => {
    const [open, setOpen] = useState(false);
    const [listDepObj, setListDepObj] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const { departmentObjs } = useSelector((state) => state.departmentObj);
    const [ rowValue, setRowValue] = useState(null);

    const data = location.state?.objEmpDep;
    console.log('recibiendo la data:', data.objEmpDepId);
    console.log('lista de objetivos:', departmentObjs )

    useEffect(() => {
        setListDepObj(departmentObjs);
    }, [departmentObjs]);

    useEffect(() => {
        dispatch(getObjDep(data.objEmpDepId));
    }, [])
    
    console.log(departmentObjs)

    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <DepObjFilter {...{rows: departmentObjs, setRows: setListDepObj, objEmpDep: data }} />
            </CardContent>

            {/* table */}
            <Box display={open ? 'flex' : 'block'}>
                <Grid container sx={{ position: 'relative' }}>
                    <Grid item sm={open ? 5 : 12} xs={12}>
                        <DepObjTable open={open} setOpen={setOpen} listDepObj={listDepObj} setRowValue={setRowValue} objEmpDep={data} />
                    </Grid>
                    <Grid item sm={open ? 7 : 12} xs={12} sx={{ borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                        {/*<ClientDrawer open={open} setOpen={setOpen} rowValue={rowValue} />*/}
                    </Grid>
                    
                </Grid>
            </Box>
        </MainCard>
    );
};

export default ObjDepList;
