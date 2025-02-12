import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project imports
import UserProfile from './UserProfile';
import Billing from './Billing';
import SelecPeriodo from './SelecPeriodo';
import Payment from './Payment';
import ChangePassword from './ChangePassword';
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { ThemeMode } from 'config';
import ComingSoonConfig from 'views/pages/maintenance/ComingSoon/ComingSoonConfig';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { getPeriodos } from 'store/slices/periodo';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// tabs
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <div>{children}</div>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    // {
    //     label: 'User Profile',
    //     icon: <PersonOutlineTwoToneIcon />,
    //     caption: 'Profile Settings'
    // },
    // {
    //     label: 'Billing',
    //     icon: <DescriptionTwoToneIcon />,
    //     caption: 'Billing Information'
    // },
    {
    label: 'Periodo',
    icon: <DescriptionTwoToneIcon />,
    caption: 'Selección de Periodo'
    },
    {
        label: 'Formulario',
        icon: <DescriptionTwoToneIcon />,
        caption: 'Selección de Formulario'
    },
    // {
    //     label: 'Payment',
    //     icon: <IconQuestionMark />,
    //     caption: 'Add & Update Card'
    // },
    {
        label: 'Respuestas',
        icon: <ContactSupportIcon />,
        caption: 'Definición de respuestas'
    },
    // {
    //     label: 'Change Password',
    //     icon: <VpnKeyTwoToneIcon />,
    //     caption: 'Update Profile Security'
    // }
];

// ==============================|| PROFILE 2 ||============================== //



const Profile2 = () => {
    const { mode, borderRadius } = useConfig();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //para traer el idPeriodo
    //const [selectedPeriodoId, setSelectedPeriodoId] = React.useState('');
    const [periodoElegido, setPeriodoElegido] = React.useState('');

    //para el control de la muestra segun fecha
    // const dispatch = useDispatch();
    // const { periodos, isLoading, error } = useSelector((state) => state.periodo);
    // const [isWithinPeriod, setIsWithinPeriod] = React.useState(false);

    // useEffect(() => {
    //     dispatch(getPeriodos());
    // }, [dispatch]);

    // useEffect(() => {
    //     if (!isLoading && periodos) {
    //         const now = new Date();
    //         const periodoActivo = periodos
    //         .find(periodo => {
                
    //             const startDate = new Date(periodo.fecha_ini_config);
    //             const endDate = new Date(periodo.fecha_fin_config);
    //             // Debe retornar la combinación de ambas condiciones
    //             return periodo.estado === true && now >= startDate && now <= endDate;
    //         });

    //         if (periodoActivo) {
    //             setIsWithinPeriod(true);
    //             setPeriodoElegido(periodoActivo);
    //         } else {
    //             setIsWithinPeriod(false);
    //             setPeriodoElegido(null);
    //         }
    //     }
    // }, [isLoading, periodos]);

    // // const handleChange = (event, newValue) => {
    // //     setValue(newValue);
    // // };


    // if (isLoading) {
    //     return (
    //         <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
    //             <CircularProgress />
    //         </Grid>
    //     );
    // }

    // if (error) {
    //     return (
    //         <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
    //             <Typography variant="h4" color="error">
    //                 Error cargando períodos: {error}
    //             </Typography>
    //         </Grid>
    //     );
    // }

    // if (!isWithinPeriod) {
    //     return (
    //         <ComingSoonConfig/>
    //     );
    // }
    

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard title="Configuraciones para la Evaluación" content={false}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} lg={4}>
                            <CardContent>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    orientation="vertical"
                                    variant="scrollable"
                                    sx={{
                                        '& .MuiTabs-flexContainer': {
                                            borderBottom: 'none'
                                        },
                                        '& button': {
                                            color: mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                                            minHeight: 'auto',
                                            minWidth: '100%',
                                            py: 1.5,
                                            px: 2,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            textAlign: 'left',
                                            justifyContent: 'flex-start',
                                            borderRadius: `${borderRadius}px`
                                        },
                                        '& button.Mui-selected': {
                                            color: 'primary.main',
                                            bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'grey.50'
                                        },
                                        '& button > svg': {
                                            marginBottom: '0px !important',
                                            marginRight: 1.25,
                                            marginTop: 1.25,
                                            height: 20,
                                            width: 20
                                        },
                                        '& button > div > span': {
                                            display: 'block'
                                        },
                                        '& > div > span': {
                                            display: 'none'
                                        }
                                    }}
                                >
                                    {tabsOption.map((tab, index) => (
                                        <Tab
                                            key={index}
                                            icon={tab.icon}
                                            label={
                                                <Grid container direction="column">
                                                    <Typography variant="subtitle1" color="inherit">
                                                        {tab.label}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                                        {tab.caption}
                                                    </Typography>
                                                </Grid>
                                            }
                                            {...a11yProps(index)}
                                        />
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <CardContent
                                sx={{
                                    borderLeft: '1px solid',
                                    borderColor: mode === ThemeMode.DARK ? 'background.default' : 'grey.200',
                                    height: '100%'
                                }}
                            >
                                {/* <TabPanel value={value} index={0}>
                                    <UserProfile />
                                </TabPanel> */}
                                <TabPanel value={value} index={0}>
                                    <SelecPeriodo setPeriodoElegido={setPeriodoElegido} periodoElegido={periodoElegido}/>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <Billing periodoElegido={periodoElegido} />
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <Payment />
                                </TabPanel>
                                {/* <TabPanel value={value} index={3}>
                                    <ChangePassword />
                                </TabPanel> */}
                            </CardContent>
                        </Grid>
                    </Grid>
                    <Divider />
                    <CardActions>
                        <Grid container justifyContent="space-between" spacing={0}>
                            <Grid item>
                                {value > 0 && (
                                    <AnimateButton>
                                        <Button variant="outlined" size="large" onClick={(e) => handleChange(e, value - 1)}>
                                            Atrás
                                        </Button>
                                    </AnimateButton>
                                )}
                            </Grid>
                            <Grid item>
                                {value < 2 && (
                                    <AnimateButton>
                                        <Button variant="contained" size="large" onClick={(e) => handleChange(e, 1 + value)}>
                                            Continuar
                                        </Button>
                                    </AnimateButton>
                                )}
                            </Grid>
                        </Grid>
                    </CardActions>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Profile2;
