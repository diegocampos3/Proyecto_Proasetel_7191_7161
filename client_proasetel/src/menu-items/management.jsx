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


// ================// PERSONAL // =============

const management = {
    id: 'management',
        title: <FormattedMessage id='gestion' />,
        icon: icons.IconUserCheck,
        type: 'group',
        children: [
            {
                id: 'personal',
                title: <FormattedMessage id="Personal" />,
                type: 'item',
                url: '/management/stafflist',
                icon: icons.IconUserCheck,
                breadcrumbs: false
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
                id: 'selectbusinessObj',
                title: <FormattedMessage id="Selección Objetivos Empresariales" />,
                type: 'item',
                url: '/management/departmentobj/selectBusinessObj',
                icon: icons.IconTarget

            },
            {
                id: 'businessObjDep',
                title: <FormattedMessage id="Objetivos a cumplir" />,
                type: 'item',
                url: '/management/departmentobj/businessObjDep',
                icon: icons.IconTarget

            }

        ]
}

export default management;

