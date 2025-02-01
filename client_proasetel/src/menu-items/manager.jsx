import  { FormattedMessage}  from 'react-intl';

// assets
import { IconUserCheck, IconCalendar, IconBuilding, IconTarget} from '@tabler/icons-react';
import { title } from 'process';


// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget

}

// ================// MANAGER // =============

const manager = {
    
    id: 'admin',
        title: <FormattedMessage id='Gerencia' />,
        icon: icons.IconUserCheck,
        type: 'group',
        children: [
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
            

        ]
}

export default manager;
