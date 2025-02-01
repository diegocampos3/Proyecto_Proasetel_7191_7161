import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// project imports
import ObjPersPropDetailsCard from './ObjPersPropDetailsCard';
//import BusinnesObjDetailsCard from './BusinnesObjDetailsCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getStaffObjPropDep } from 'store/slices/staffobj';
import FilterObjs from './FilterObjs';

// assets
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Divider } from '@mui/material';

const AcceptObjPersProp = () => {

    const [listStaffObjProp, setListStaffObjProp] = React.useState([]);  // Estado inicial como arreglo vacío
    const [currentPage, setCurrentPage] = React.useState(1); 
    const [rowsPerPage, setRowsPerPage] = React.useState(8); 

    // Obtén los datos de businessObjs, asegurándote de que sea un arreglo
    const { staffObjsPropDep } = useSelector((state) => state.staffObj);

    console.log('Dato desde fuera axios:', staffObjsPropDep );

    React.useEffect(() => {
        if (Array.isArray(staffObjsPropDep)) {
            setListStaffObjProp(staffObjsPropDep);
        } 
    }, [staffObjsPropDep ]);

    // Dispara el dispatch para obtener los datos
    React.useEffect(() => {
        dispatch( getStaffObjPropDep());
    }, [dispatch]);

    // Estado para el control del menú de filas por página
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (rows) => {
        if (rows) setRowsPerPage(rows); 
        setAnchorEl(null);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const paginatedData = Array.isArray(listStaffObjProp) ? listStaffObjProp.slice(startIndex, endIndex) : [];

    // Mapeo de los datos paginados para mostrarlos
    const ObjPersProp = paginatedData.map((obj, index) => (
        <Grid key={index} item xs={12} sm={6} lg={4} xl={3}>
            <ObjPersPropDetailsCard id={obj.id} titulo={obj.titulo}  descripcion={obj.descripcion} 
            estado={obj.estado} aceptacion={obj.aceptacion} setListStaffObjProp={setListStaffObjProp} 
            tituloObjEmpr = {obj.tituloObjEmpr}
            />
        </Grid>
    ));

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h4">Objetivos a revisión</Typography>
                    </Grid>
                    <Grid item>
                        {/* Sección de filtro */}
                        <CardContent>
                            <FilterObjs {...{ rows: staffObjsPropDep , setRows: setListStaffObjProp }} />
                        </CardContent>
                    </Grid>
                </Grid>
            }
        >
            <Grid container direction="row" spacing={gridSpacing}>
                {ObjPersProp}
                <Divider />
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        {/* Paginación */}
                        <Grid item>
                            <Pagination
                                count={Math.ceil(listStaffObjProp.length / rowsPerPage) || 1} // Evitar división por cero
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

export default AcceptObjPersProp;

