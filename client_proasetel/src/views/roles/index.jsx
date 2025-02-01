import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import { ThemeMode } from 'config';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import useAuth from 'hooks/useAuth';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

const RoleCards = () => {
    const { user } = useAuth(); // Obtén el usuario desde useAuth
    const theme = useTheme();
    const navigate = useNavigate();
    const [isUserLoaded, setIsUserLoaded] = useState(false); // Estado para verificar si el usuario está cargado

    // Efecto para esperar a que el usuario esté disponible
    useEffect(() => {
        if (user) {
            setIsUserLoaded(true); // Marca que el usuario está cargado
        }
    }, [user]);

    const handleNavigation = (role) => {
        if (!user) {
            alert('Cargando información del usuario...');
            return;
        }

        if (role.title === 'Gerente' && user.rol !== 'admin') {
            alert('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
        } else {
            navigate(role.path);
        }
    };

    const cardSX = {
        overflow: 'hidden',
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: 150,
            height: 150,
            border: '35px solid',
            borderColor: 'background.paper',
            opacity: theme.palette.mode === ThemeMode.DARK ? 0.1 : 0.4,
            borderRadius: '50%',
            top: -72,
            right: -63
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: 150,
            height: 150,
            border: '2px solid',
            borderColor: 'background.paper',
            opacity: theme.palette.mode === ThemeMode.DARK ? 0.05 : 0.21,
            borderRadius: '50%',
            top: -97,
            right: -3
        },
        '& .MuiCardContent-root': {
            padding: '20px 38px 20px 30px'
        }
    };

    const roles = [
        {
            title: 'Gerente',
            icon: <AccountCircleIcon sx={{ fontSize: '2.25rem' }} />,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            path: '/management/stafflist'
        },
        {
            title: 'Supervisor',
            icon: <SupervisorAccountIcon sx={{ fontSize: '2.25rem' }} />,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            path: '/supervisor'
        },
        {
            title: 'Evaluado',
            icon: <AssignmentIndIcon sx={{ fontSize: '2.25rem' }} />,
            bgcolor: 'success.main',
            color: 'success.contrastText',
            path: '/evaluado'
        }
    ];

    // Si el usuario no está cargado, muestra un estado de carga
    if (!isUserLoaded) {
        return (
            <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress /> {/* Spinner de carga */}
                <Typography variant="h6" sx={{ ml: 2 }}>Cargando información del usuario...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Grid container justifyContent="center" spacing={3} sx={{ textAlign: 'center' }}>
                {roles.map((role, index) => (
                    <Grid item md={4} sm={6} xs={12} key={index}>
                        <SubCard
                            sx={{ bgcolor: role.bgcolor, color: role.color, ...cardSX }}
                            onClick={() => handleNavigation(role)}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        bgcolor: 'background.paper',
                                        opacity: theme.palette.mode === ThemeMode.DARK ? 1 : 0.5,
                                        color: role.color,
                                        height: 60,
                                        width: 60,
                                        borderRadius: '12px'
                                    }}
                                >
                                    {role.icon}
                                </Avatar>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '1.2rem',
                                        textAlign: 'end'
                                    }}
                                >
                                    {role.title}
                                </Typography>
                            </Stack>
                        </SubCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default RoleCards;