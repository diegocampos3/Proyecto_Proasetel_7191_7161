import  { FormattedMessage}  from 'react-intl';

// assets
import { 
    IconUserCheck, IconCalendar, 
    IconBuilding, IconTarget, 
    IconCheck, IconListDetails, 
    IconFlag, IconDeviceAnalytics,
    IconMessage2, IconFileCheck

} from '@tabler/icons-react';
import { title } from 'process';


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
    IconMessage2,
    IconFileCheck


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
                title: (
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Selección Objetivos Personales" />
                </span>
                ),
                type: "item",
                url: '/evaluated-staff/staff-goals/businessobj',
                icon: icons.IconCheck
            },
            {
                id: 'staffgoalsper',
                title:(
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Objetivos Personales"/>
                </span>
                ),
                type:"item",
                url: '/evaluated-staff/staff-goals/personalobj',
                icon: icons.IconListDetails

            },
            {
                id: 'staffgoalperprop',
                title: (
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Objetivos Personales propuestos"/>
                </span>
                ),
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
            }, 
            //Evaluacion desempeno laboral
            {
                id: 'evaluacion_desempeno_laboral',
                title: (
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Evaluación de Desempeño Laboral"/>
                </span>
                ),
                type: "item",
                url: '/evaluated-staff/evaluacion_desempeno_laboral',
                icon: icons.IconFileCheck
            },   

        ]
}

export default employee;