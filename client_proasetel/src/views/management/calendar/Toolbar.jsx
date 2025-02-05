import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// assets: asegúrate de tener los íconos necesarios importados
import { IconChevronLeft, IconChevronRight, IconLayoutGrid, IconLayoutList, IconListNumbers } from '@tabler/icons-react';

// Se agregan las opciones de vista. Se añadió la opción "Todos"
const viewOptions = [
    {
        label: 'Mes',
        value: 'dayGridMonth',
        icon: IconLayoutGrid
    },
    {
        label: 'Agenda',
        value: 'listWeek',
        icon: IconListNumbers
    },
    {
        label: 'Todos',
        value: 'listAll', // Debe coincidir con la vista personalizada de FullCalendar
        icon: IconLayoutList
    }
];

const Toolbar = ({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView, ...others }) => {
    const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [newViewOption, setNewViewOption] = useState(viewOptions);

    useEffect(() => {
        let newOption = viewOptions;
        if (matchSm) {
            // Filtramos las vistas que no sean compatibles en pantallas pequeñas, si fuera necesario
            newOption = viewOptions.filter((options) => options.value !== 'dayGridMonth' && options.value !== 'timeGridWeek');
        }
        setNewViewOption(newOption);
    }, [matchSm]);

    return (
        <Grid alignItems="center" container justifyContent="space-between" spacing={3} {...others} sx={{ pb: 3 }}>
            <Grid item>
                <Button variant="outlined" onClick={onClickToday}>
                    Hoy
                </Button>
            </Grid>
            <Grid item>
                <Stack direction="row" alignItems="center" spacing={3}>
                    <IconButton onClick={onClickPrev} size="large" aria-label="Mes anterior">
                        <IconChevronLeft />
                    </IconButton>
                    <Typography variant="h3" color="textPrimary">
                        {format(date, 'MMMM yyyy', { locale: es })}
                    </Typography>
                    <IconButton onClick={onClickNext} size="large" aria-label="Mes siguiente">
                        <IconChevronRight />
                    </IconButton>
                </Stack>
            </Grid>
            {/* <Grid item>
                <ButtonGroup variant="outlined" aria-label="Opciones de vista del calendario">
                    {newViewOption.map((viewOption) => {
                        const Icon = viewOption.icon;
                        return (
                            <Tooltip title={viewOption.label} key={viewOption.value}>
                                <Button
                                    disableElevation
                                    variant={viewOption.value === view ? 'contained' : 'outlined'}
                                    onClick={() => onChangeView(viewOption.value)}
                                >
                                    <Icon stroke="2" size="20px" />
                                </Button>
                            </Tooltip>
                        );
                    })}
                </ButtonGroup>
            </Grid> */}
        </Grid>
    );
};

Toolbar.propTypes = {
    date: PropTypes.instanceOf(Date),
    view: PropTypes.string,
    onClickNext: PropTypes.func,
    onClickPrev: PropTypes.func,
    onClickToday: PropTypes.func,
    onChangeView: PropTypes.func
};

export default Toolbar;
