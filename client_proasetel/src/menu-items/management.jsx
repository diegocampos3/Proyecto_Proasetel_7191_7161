import  { FormattedMessage}  from 'react-intl';

// assets
import { IconUserCheck, IconCalendar, IconBuilding} from '@tabler/icons-react';

// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding

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
                url: '/management/deparment',
                icon: icons.IconBuilding
            }

            
            
        ]
}

export default management;

