
import {useEffect, useState} from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';


// material-ui
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

// project-imports
import PerObjTable from './PerObjTable';
import PerObjFilter from './PerObjFilter';
import MainCard from 'ui-component/cards/MainCard';

import { dispatch, useSelector } from 'store';
import { getStaffObjByUser ,getStaffObjPropAceptadosByUser } from 'store/slices/staffobj';



// ==============================||  LISTA DE OBJETIVOS PERSONALES ||============================== //

const ObjDepList = () => {
    
    const [open, setOpen] = useState(false);
    const [listPerObj, setListPerObj] = useState([]);

    const { staffObjsbyUser, staffObjsPropbyUser } = useSelector((state) => state.staffObj);
    const [ rowValue, setRowValue] = useState(null);

    const { id } = useParams();

    // Normalizar y combinar los datos
    useEffect(() => {
        if (staffObjsbyUser && staffObjsPropbyUser) {
            console.log('SUPERVISOR objPers:', staffObjsbyUser)
            console.log('SUPERVISOR objPersProp:', staffObjsPropbyUser)
            // Normalizar los datos de staffObjs
            const normalizedStaffObjs = staffObjsbyUser
            // .filter(obj => obj.user === id)
            .map((obj) => ({
                idObjEvaluar:obj.idObjPer,
                titulo: obj.titulo,
                descripcion: obj.descripcion,
                evaluado_supervisor:obj.evaluado_supervisor
            }));

            // Normalizar los datos de staffObjsPropAceptados
            const normalizedStaffObjsPropAceptados = staffObjsPropbyUser
            // .filter(obj => obj.user === id)
            .map((obj) => ({
                idObjEvaluar:obj.id,
                titulo: obj.titulo,
                descripcion: obj.descripcion,
                evaluado_supervisor:obj.evaluado_supervisor
            }));

            // Combinar ambos arrays
            const combinedList = [...normalizedStaffObjs, ...normalizedStaffObjsPropAceptados];
            setListPerObj(combinedList);
        }
    }, [staffObjsbyUser, staffObjsPropbyUser, id]);

    
    useEffect(() => {
        dispatch(getStaffObjByUser(id));
    }, [id])


    //trae tambien los objetivos personales propuestos
    useEffect(() => {
        dispatch(getStaffObjPropAceptadosByUser(id));
    }, [id])

    
    // console.log('OBJETIVOOSS PERSONALES', staffObjs)
    // console.log('OBJETIVOS PROPUESTOOSSSS', staffObjsProp)
    // console.log('ID',id)

    return (
        <MainCard content={false}>
            {/* filter section */}
            <CardContent>
                <PerObjFilter {...{rows: staffObjsbyUser, setRows: setListPerObj}} />
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
