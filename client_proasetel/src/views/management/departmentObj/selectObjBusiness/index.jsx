import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

// project imports
import BusinnesObjDetailsCard from './BusinnesObjDetailsCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { dispatch, useSelector } from 'store';
import { getBusinessObj } from 'store/slices/businessobj';
import { getBusinessObjDep } from 'store/slices/departmentobj';
import useAuth from 'hooks/useAuth';
import FilterObjs from './FilterObjs';
import { getPeriodos } from 'store/slices/periodo';
import ComingSoonConfig from 'views/pages/maintenance/ComingSoon/ComingSoonConfig';

// assets
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Divider } from '@mui/material';

const DepartmentObj = () => {

    const [listBusinessObj, setListBusinessObj] = React.useState([]);
    const [listBusinessObjDep, setListBusinessObjDep] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1); 
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const { user } = useAuth();

    console.log('Imprimiendo idUsuarioDep:', user)
 

    const { businessObjs } = useSelector((state) => state.businessObj);
    const { businessObjs: newBusinessObjs } = useSelector((state) => state.departmentObj);

    
    React.useEffect(() => {
        setListBusinessObj(businessObjs);
        setListBusinessObjDep(newBusinessObjs)
    }, [businessObjs, newBusinessObjs]);


    React.useEffect(() => {
        dispatch(getBusinessObj());
        dispatch(getBusinessObjDep());

    }, []);

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
    const paginatedData = listBusinessObj.slice(startIndex, endIndex);

    const objSelect = listBusinessObjDep.map(item => ({
        idemp: item.id,
        idep: item.idep

    }));
    console.log('Lista seleccionados:', objSelect);
    console.log('Lista seleccionados 2', listBusinessObjDep)

    const isSelect = (id) => {
        console.log('imprimiendo id:', id, 'departamento:', user?.departamento?.id )
        return objSelect.some(item => item.idemp === id && item.idep === user?.departamento?.id);
    };
    
    const departmentObjR = paginatedData.map((obj, index) => (
        <Grid key={index} item xs={12} sm={6} lg={4} xl={3}>
            <BusinnesObjDetailsCard id={obj.id} titulo={obj.titulo} descripcion={obj.descripcion} select={isSelect(obj.id)} />
        </Grid>
    ));






//para manejo de comingsoonconfig

const [periodoElegido, setPeriodoElegido] = React.useState('');

    //para el control de la muestra segun fecha
    const dispatch = useDispatch();
    const { periodos, isLoading, error } = useSelector((state) => state.periodo);
    const [isWithinPeriod, setIsWithinPeriod] = React.useState(false);

    useEffect(() => {
        dispatch(getPeriodos());
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading && periodos) {
            const now = new Date();
            const periodoActivo = periodos
            .find(periodo => {
                
                const startDate = new Date(periodo.fecha_ini_config);
                const endDate = new Date(periodo.fecha_fin_config);
                // Debe retornar la combinación de ambas condiciones
                return periodo.estado === true && now >= startDate && now <= endDate;
            });

            if (periodoActivo) {
                setIsWithinPeriod(true);
                setPeriodoElegido(periodoActivo);
            } else {
                setIsWithinPeriod(false);
                setPeriodoElegido(null);
            }
        }
    }, [isLoading, periodos]);

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };


    if (isLoading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Typography variant="h4" color="error">
                    Error cargando períodos: {error}
                </Typography>
            </Grid>
        );
    }

    if (!isWithinPeriod) {
        return (
            <ComingSoonConfig/>
        );
    }
    

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h4">Selección de Objetivos Empresariales</Typography>
                    </Grid>
                    <Grid item>
                        {/* filter section */}
                        <CardContent>
                            <FilterObjs {...{ rows: businessObjs, setRows: setListBusinessObj }} />
                        </CardContent>
                    </Grid>
                </Grid>
            }
        >
            <Grid container direction="row" spacing={gridSpacing}>
                {departmentObjR}
                <Divider></Divider>
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        {/* Paginación */}
                        <Grid item>
                            <Pagination
                                count={Math.ceil(listBusinessObj.length / rowsPerPage)}
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

export default DepartmentObj;

