import  { FormattedMessage}  from 'react-intl';

// assets
import { IconUserCheck, IconCalendar, IconBuilding, IconTarget, IconDeviceAnalytics, IconClipboardCheck, IconFileSettings} from '@tabler/icons-react';
import { title } from 'process';


// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget,
    IconDeviceAnalytics,
    IconClipboardCheck,
    IconFileSettings

}

// ================// MANAGER // =============

const manager = {
    
    id: 'admin',
        title: <FormattedMessage id='Gerencia' />,
        icon: icons.IconUserCheck,
        type: 'group',
        children: [
            {
                id: 'formularios',
                title: <FormattedMessage id="Formularios" />,
                type: 'item',
                url: '/management/formularios',
                icon: icons.IconClipboardCheck,
                breadcrumbs: false,
                roles: ['admin']
            },
            {
                id: 'config_evaluacion',
                title: (
                    <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        <FormattedMessage id="Configuración - Evaluación" />
                    </span>
                    ),
                type: 'item',
                url: '/management/config_evaluacion',
                icon: icons.IconFileSettings,
                breadcrumbs: false,
                roles: ['admin']
            },
            {
                id: 'personal',
                title: <FormattedMessage id="Personal" />,
                type: 'item',
                url: '/management/stafflist',
                icon: icons.IconUserCheck,
            },
            {
                id: 'calendar',
                title: <FormattedMessage id="Calendario" />,
                type: 'item',
                url: '/management/calendar',
                icon: icons.IconCalendar,
            },
            {
                id: 'deparment',
                title: <FormattedMessage id="Departamentos" />,
                type: 'item',
                url: '/management/department',
                icon: icons.IconBuilding
            },
            {
                id: 'businessObj',
                title: <FormattedMessage id="Objetivos Empresariales" />,
                type: 'item',
                url: '/management/businessobj',
                icon: icons.IconTarget
                
            },
            {
                id: 'dashboarManager',
                title: <FormattedMessage id="Analítica" />,
                type: 'item',
                url: '/dashboard/manager',
                icon: icons.IconDeviceAnalytics,
            },
            {
                id: 'dashboarSupervisor',
                title: <FormattedMessage id="Analítica" />,
                type: 'item',
                url: '/dashboard/supervisor',
                icon: icons.IconDeviceAnalytics,
            },
            {
                id: 'dashboarEmployee',
                title: <FormattedMessage id="Analítica" />,
                type: 'item',
                url: '/dashboard/employee',
                icon: icons.IconDeviceAnalytics,
            }

            

        ]
}

export default manager;
