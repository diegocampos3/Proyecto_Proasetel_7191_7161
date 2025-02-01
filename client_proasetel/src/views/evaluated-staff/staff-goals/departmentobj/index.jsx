import React from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// project imports
import DepartmentObjDetailsCard from './DepartmentObjDetailsCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getStaffObj } from 'store/slices/staffobj';
import { getObjDep } from 'store/slices/departmentobj';
import FilterObjs from '../FilterObjs';
import ObjContainer from '../ObjContainer';

// assets
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Divider } from '@mui/material';

const DepartmentObjs = () => {

    const [listDepObj, setListDepObj] = React.useState([]);  // Estado inicial como arreglo vacío
    const [listStaffObj, setListStaffObj] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1); 
    const [rowsPerPage, setRowsPerPage] = React.useState(8); 
    const location = useLocation();

    const { departmentObjs } = useSelector((state) => state.departmentObj);
    const {staffObjs} = useSelector((state) => state.staffObj)

    const data = location.state?.objEmpDep;
    console.log('Datos, objetivos departamentales', departmentObjs);
    console.log('Datos, objetivos personales selecionados', staffObjs)

    // Actualiza listBusinessObj cuando businessObjs cambia
    React.useEffect(() => {
        
        if (Array.isArray(departmentObjs)) 
            setListDepObj(departmentObjs);
            
        if (Array.isArray(staffObjs))
            setListStaffObj(staffObjs)

        
    }, [departmentObjs, staffObjs]);

    // Dispara el dispatch para obtener los datos
    React.useEffect(() => {
        dispatch(getObjDep(data.objEmpDepId));
        dispatch(getStaffObj())
    }, [dispatch, data.objEmpDepId]);  

    // Estado para el control del menú de filas por página
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (rows) => {
        if (rows) setRowsPerPage(rows); 
        setAnchorEl(null);
    };

    // Cálculos de la paginación
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Asegúrate de que listBusinessObj sea un arreglo antes de hacer slice
    const paginatedData = Array.isArray(listDepObj) ? listDepObj.slice(startIndex, endIndex) : [];

   const objSelect = listStaffObj.map(item => item.idObjDep);

    const isSelect = (id) => {
        return objSelect.includes(id)
    }

    // Mapeo de los datos paginados para mostrarlos
    const departmentObjR = paginatedData.map((obj, index) => (
        <Grid key={index} item xs={12} sm={6} lg={4} xl={3}>
            <DepartmentObjDetailsCard  idObjDep={obj.idObjDep} titulo={obj.titulo} descripcion={obj.descripcion} select={isSelect(obj.idObjDep)} />
        </Grid>
    ));

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h4">Objetivos Empresariales a Cumplir</Typography>
                    </Grid>
                    <Grid item>
                        {/* Sección de filtro */}
                        <CardContent>
                            <FilterObjs {...{ rows: departmentObjs, setRows: setListDepObj }} />
                        </CardContent>
                    </Grid>
                </Grid>
            }
        >
            <Grid container direction="row" spacing={gridSpacing}>
                {departmentObjR}
                <Divider />
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        {/* Paginación */}
                        <Grid item>
                            <Pagination
                                count={Math.ceil(listDepObj.length / rowsPerPage) || 1} // Evitar división por cero
                                page={currentPage}
                                onChange={(_, page) => setCurrentPage(page)}
                                color="primary"
                            />
                        </Grid>
                        {/* Control de filas por página */}
                        <Grid item>
                            <Button
                                variant="text"
                                size="large"
                                sx={{ color: 'grey.900' }}
                                color="inherit"
                                endIcon={<ExpandMoreRoundedIcon />}
                                onClick={handleClick}
                            >
                                {rowsPerPage} Objetivos
                            </Button>
                            {anchorEl && (
                                <Menu
                                    id="menu-user-card-style1"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => handleClose()}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                >
                                    <MenuItem onClick={() => handleClose(8)}> 8 Obj</MenuItem>
                                    <MenuItem onClick={() => handleClose(16)}>16 Obj</MenuItem>
                                    <MenuItem onClick={() => handleClose(24)}>24 Obj</MenuItem>
                                </Menu>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default DepartmentObjs ;