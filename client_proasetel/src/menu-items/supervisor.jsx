import  { FormattedMessage}  from 'react-intl';

// assets
import { IconUserCheck, IconCalendar, IconBuilding, IconTarget, IconMouse, IconCheck, IconListDetails } from '@tabler/icons-react';


// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget,
    IconMouse,
    IconCheck,
    IconListDetails

}


// ================// SUPERVISOR // =============

const supervisor = {
    
    id: 'supervisor',
        title: <FormattedMessage id='Supervisor' />,
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
                id: 'selectbusinessObj',
                title: <FormattedMessage id="Selección Objetivos Empresariales" />,
                type: 'item',
                url: '/management/departmentobj/selectBusinessObj',
                icon: icons.IconCheck

            },
            {
                id: 'businessObjDep',
                title: <FormattedMessage id="Objetivos empresariales a cumplir" />,
                type: 'item',
                url: '/management/departmentobj/businessObjDep',
                icon: icons.IconBuilding

            },
            {
                id: 'selectobjpersprop',
                title: <FormattedMessage id="Lista de objetivos personales propuestos"/>,
                type: "item",
                url: '/management/departmentObj/acceptObjPersProp',
                icon: icons.IconListDetails
            }

            

        ]
}

export default supervisor;