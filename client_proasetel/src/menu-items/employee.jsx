import  { FormattedMessage}  from 'react-intl';

// assets
import { 
    IconUserCheck, IconCalendar, 
    IconBuilding, IconTarget, 
    IconCheck, IconListDetails, 
    IconFlag, IconDeviceAnalytics,
    IconMessage2

} from '@tabler/icons-react';


// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget,
    IconCheck,
    IconListDetails,
    IconFlag,
    IconDeviceAnalytics,
    IconMessage2


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
            {
                id: 'dashboarEmployee',
                title: <FormattedMessage id="Analítica" />,
                type: 'item',
                url: '/dashboard/employee',
                icon: icons.IconDeviceAnalytics,
            },
            {
                id: 'feedback',
                title: <FormattedMessage id="Feedback" />,
                type: 'item',
                url: '/evaluated-staff/feedback',
                icon: icons.IconMessage2,
            } 
            
            

        ]
}

export default employee;