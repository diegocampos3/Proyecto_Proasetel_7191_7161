import { useEffect, useRef, useState } from 'react';
import { Manager } from 'socket.io-client';


// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

// project imports
import Toolbar from './Toolbar';
import AddEventForm from './AddEventForm';
import CalendarStyled from './CalendarStyled';

import Loader from 'ui-component/Loader';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import esLocale from '@fullcalendar/core/locales/es';




import { dispatch, useSelector } from 'store';
import { getEvents, addEvent, updateEvent, removeEvent  } from 'store/slices/calendar';
// assets
import AddAlarmTwoToneIcon from '@mui/icons-material/AddAlarmTwoTone';

// ==============================|| APPLICATION CALENDAR ||============================== //

const Calendar = () => {
    const calendarRef = useRef(null);
    const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const socketRef = useRef(null);


    // fetch events data
    const [events, setEvents] = useState([]);
    const calendarState = useSelector((state) => state.calendar)

   useEffect(() => {
        dispatch(getEvents()).then(() => setLoading(false));
   }, []);

   
   useEffect(() => {

    const formattedEvents = calendarState.events.map(event => ({
        id: event.idPeriodo,             
        title: event.titulo,             
        description: event.descripcion,  
        start: event.fecha_ini,          
        end: event.fecha_fin,            
        allDay: false,                     
        color: event.color,
        textColor: event.textColor
    }));

    setEvents(formattedEvents);

}, [calendarState]);


    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');

    // calendar toolbar events
    const handleDateToday = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleViewChange = (newView) => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.changeView(newView);
            setView(newView);
        }
    };

    // set calendar view
    useEffect(() => {
        handleViewChange(matchSm ? 'listWeek' : 'dayGridMonth');
    }, [matchSm]);

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // calendar event select/add/edit/delete
    const handleRangeSelect = (arg) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }

        setSelectedRange({
            start: arg.start,
            end: arg.end
        });
        setIsModalOpen(true);
    };

    const handleEventSelect = (arg) => {
        if (arg.event.id) {
            const selectEvent = events.find((_event) => _event.id === arg.event.id);
            setSelectedEvent(selectEvent);
        } else {
            setSelectedEvent(null);
        }
        setIsModalOpen(true);
    };


    const handleSendMessage = (message) => {
        if (message.trim().length === 0) return;

        socketRef.current?.emit('message-from-client', {
            id: 'YO!!',
            message: message,
        });
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
            console.log('Mensaje recibido:', payload);  // Verifica el payload
            setAlertMessage(`Nuevo mensaje de ${payload.fullName}: ${payload.message}`);
            setAlertOpen(true);
        });
    };

    useEffect(() => {
        const token = localStorage.getItem('serviceToken');
        if (token) connectToServer(token);
        return () => socketRef.current?.disconnect();
    }, []);

    // Creación de evento
    const handleEventCreate = async (data) => {
        dispatch(addEvent(data));
        handleSendMessage(data.titulo)
        handleModalClose();
    };


    const handleUpdateEvent = async (eventId, update) => {
        console.log('eventId:', eventId)
        console.log('update:', update)
        dispatch(updateEvent(eventId, update))
        handleModalClose();
    };

    const handleEventDelete = async (id) => {
        try {
            dispatch(removeEvent(id));
            handleModalClose();

        } catch (error) {
            console.log(error)
        }
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setSelectedRange(null);
    };

    if (loading) return <Loader />;

    return (
        <>
        <MainCard
            title="Programación de Eventos"
            secondary={
                <Button color="secondary" variant="contained" onClick={handleAddClick}>
                    <AddAlarmTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                    Añadir
                </Button>
            }
        >
            <CalendarStyled>
                <Toolbar
                    date={date}
                    view={view}
                    onClickNext={handleDateNext}
                    onClickPrev={handleDatePrev}
                    onClickToday={handleDateToday}
                    onChangeView={handleViewChange}
                />
                <SubCard>
                    <FullCalendar
                        locale={esLocale}
                        weekends
                        editable
                        droppable
                        selectable
                        events={events}
                        ref={calendarRef}
                        rerenderDelay={10}
                        initialDate={date}
                        initialView={view}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        headerToolbar={false}
                        allDayMaintainDuration
                        eventResizableFromStart
                        select={handleRangeSelect}
                        eventClick={handleEventSelect}
                        height={matchSm ? 'auto' : 720}
                        plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                    />
                </SubCard>
            </CalendarStyled>

            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && (
                    <AddEventForm
                        event={selectedEvent}
                        range={selectedRange}
                        onCancel={handleModalClose}
                        handleDelete={handleEventDelete}
                        handleCreate={handleEventCreate}
                        handleUpdate={handleUpdateEvent}
                    />
                )}
            </Dialog>
        </MainCard>
        </>
    );
};

export default Calendar;

