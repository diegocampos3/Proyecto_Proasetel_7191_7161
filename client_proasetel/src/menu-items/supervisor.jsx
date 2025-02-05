import  { FormattedMessage}  from 'react-intl';

// assets
import { IconUserCheck, IconCalendar, IconBuilding, IconTarget, IconMouse, IconCheck, IconListDetails, IconFileCheck } from '@tabler/icons-react';


// constant
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget,
    IconMouse,
    IconCheck,
    IconListDetails,
    IconFileCheck

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
                title: 
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Personal" />
                </span>,
                type: 'item',
                url: '/management/stafflist',
                icon: icons.IconUserCheck,
            },
            {
                id: 'selectbusinessObj',
                title: 
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Selección Objetivos Empresariales" />
                </span>,
                type: 'item',
                url: '/management/departmentobj/selectBusinessObj',
                icon: icons.IconCheck

            },
            {
                id: 'businessObjDep',
                title: 
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Objetivos empresariales a cumplir" />
                </span>,
                type: 'item',
                url: '/management/departmentobj/businessObjDep',
                icon: icons.IconBuilding

            },
            {
                id: 'selectobjpersprop',
                title: 
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Lista de objetivos personales propuestos"/>
                </span>,
                type: "item",
                url: '/management/departmentObj/acceptObjPersProp',
                icon: icons.IconListDetails
            },
            {
                id: 'dashboarSupervisor',
                title: <FormattedMessage id="Analítica" />,
                type: 'item',
                url: '/dashboard/supervisor',
                icon: icons.IconDeviceAnalytics,
            },
            {
                id: 'evaluacion_desempeno_laboral_supervisor',
                title: (
                <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <FormattedMessage id="Evaluación de Desempeño Laboral"/>
                </span>
                ),
                type: "item",
                url: '/management/evaluacion_desempeno_laboral_supervisor',
                icon: icons.IconFileCheck
            }, 

        ]
}

export default supervisor;