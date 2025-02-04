import { useEffect, useRef, useState, useReducer, useContext  } from 'react';

import { Manager } from 'socket.io-client';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IconBell } from '@tabler/icons-react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import useMediaQuery from '@mui/material/useMediaQuery';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Transitions from 'ui-component/extended/Transitions';
import MainCard from 'ui-component/cards/MainCard';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Divider from '@mui/material/Divider';
import { useSelector } from 'store';
import accountReducer from 'store/accountReducer';


const NotificationSection = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [events, setEvents] = useState([]);


    // Obtener eventos desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/periodo');
                const fetchedEvents = response.data;
                const formattedEvents = fetchedEvents.map(event => ({
                    id: event.idPeriodo,
                    title: event.titulo,
                    description: event.descripcion,
                    start: event.fecha_ini,
                    end: event.fecha_fin,
                }));
                setEvents(formattedEvents);
                setNotificationCount(formattedEvents.length); // Actualiza el contador de notificaciones
            } catch (error) {
                console.error('Error al obtener los periodos:', error);
            }
        };

        fetchData();
    }, []);

    const anchorRef = useRef(null);
    const socketRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        // if (!open) {
        //     setNotificationCount(0); // Resetea el contador al abrir el menú
        // }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const connectToServer = (token) => {
        const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
            extraHeaders: { authentication: token },
        });

        const socket = manager.socket('/');
        socketRef.current = socket;

        socket.on('connect', () => console.log('Conectado al servidor'));
        socket.on('disconnect', () => console.log('Desconectado del servidor'));

        socket.on('message-form-server', (payload) => {
            setAlertMessage(`Nuevo mensaje de ${payload.fullName}: ${payload.message}`);
            setAlertOpen(true);
        });
    };

    useEffect(() => {
        const token = localStorage.getItem('serviceToken');
        if (token) connectToServer(token);
        return () => socketRef.current?.disconnect();
    }, []);

    return (
        <>
            <Box sx={{ ml: 2 }}>
                <Badge
                    badgeContent={notificationCount} // Contador de notificaciones
                    color="error" // Color del badge, puedes usar 'error' para que sea rojo
                    invisible={notificationCount === 0} // Solo mostrar el badge si hay notificaciones
                >
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
                            color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
                                color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'secondary.light',
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconBell stroke={1.5} size="20px" />
                    </Avatar>
                </Badge>
            </Box>

            <Popper
                placement={downMD ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[{ name: 'offset', options: { offset: [downMD ? 5 : 0, 20] } }]}>
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                    <Grid item>
                                                        <Stack direction="row" spacing={2}>
                                                            <Typography variant="subtitle1">Todos los avisos</Typography>
                                                            {/* <Chip
                                                                size="small"
                                                                label={notificationCount}
                                                                sx={{ color: 'background.default', bgcolor: 'warning.dark' }}
                                                            /> */}
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {/* Usar PerfectScrollbar para el desplazamiento */}
                                                <PerfectScrollbar
                                                    style={{
                                                        height: 'calc(100vh - 250px)', // Ajusta la altura según tus necesidades
                                                        overflowX: 'hidden',
                                                        maxHeight: '400px', // Limita la altura máxima
                                                    }}>
                                                    <Grid container direction="column" spacing={2}>
                                                        {events.map((event) => (
                                                            <Grid item key={event.id}>
                                                                <Box sx={{ padding: 2, borderBottom: '1px solid #ccc' }}>
                                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                                                        {event.title}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                                        {event.description}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                                                        {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                        <Grid item xs={12} p={0}>
                                                            <Divider sx={{ my: 0 }} />
                                                        </Grid>
                                                    </Grid>
                                                </PerfectScrollbar>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>


            <Snackbar open={alertOpen} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationSection;

