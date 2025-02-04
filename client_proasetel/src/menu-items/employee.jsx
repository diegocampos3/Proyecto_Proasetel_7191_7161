import  { FormattedMessage}  from 'react-intl';

// assets
import { IconUserCheck, IconCalendar, IconBuilding, IconTarget, IconCheck, IconListDetails, IconFlag} from '@tabler/icons-react';
import { title } from 'process';


// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget,
    IconCheck,
    IconListDetails,
    IconFlag


}


// ================// EMPLOYEE // =============

const employee = {
    
    id: 'empleado',
        title: <FormattedMessage id='Colaborador' />,
        icon: icons.IconUserCheck,
        type: 'group',
        children: [
            
        
            {
                id: 'staffgoals',
                title: <FormattedMessage id="Selección Objetivos Personales" />,
                type: "item",
                url: '/evaluated-staff/staff-goals/businessobj',
                icon: icons.IconCheck
            },
            {
                id: 'staffgoalsper',
                title: <FormattedMessage id="Objetivos Personales"/>,
                type:"item",
                url: '/evaluated-staff/staff-goals/personalobj',
                icon: icons.IconListDetails

            },
            {
                id: 'staffgoalperprop',
                title: <FormattedMessage id="Objetivos Personales propuestos"/>,
                type: "item",
                url: '/evaluated-staff/staff-goals/personalobjprop',
                icon: icons.IconFlag
            },    

        ]
}

export default employee;