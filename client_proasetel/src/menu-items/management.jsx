import { FormattedMessage } from 'react-intl';
import { jwtDecode } from 'jwt-decode';
import useAuth from 'hooks/useAuth';



// assets
import { IconUserCheck, IconCalendar, IconBuilding, IconTarget } from '@tabler/icons-react';

// Mapeo de iconos
const icons = {
    IconUserCheck,
    IconCalendar,
    IconBuilding,
    IconTarget
};


const token = window.localStorage.getItem('serviceToken');
let userRole = null;

if (token) {
    try {
        const decodedToken = jwtDecode(token);
        userRole = decodedToken.rol; 
        // Asegúrate de que el payload del token tenga la propiedad "role"
    } catch (error) {
        console.error('Error decodificando el token:', error);
    }
}


const managementList = {
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
            breadcrumbs: false,
            roles: ['admin', 'supervisor']
        },
        {
            id: 'calendar',
            title: <FormattedMessage id="Calendario" />,
            type: 'item',
            url: '/management/calendar',
            icon: icons.IconCalendar,
            roles: ['admin', 'supervisor']
        },
        {
            id: 'department',
            title: <FormattedMessage id="Departamentos" />,
            type: 'item',
            url: '/management/department',
            icon: icons.IconBuilding,
            roles: ['admin', 'supervisor']
        },
        {
            id: 'businessObj',
            title: <FormattedMessage id="Objetivos Empresariales" />,
            type: 'item',
            url: '/management/businessobj',
            icon: icons.IconTarget,
            roles: ['admin']
        },
        {
            id: 'selectbusinessObj',
            title: <FormattedMessage id="Selección Objetivos Empresariales" />,
            type: 'item',
            url: '/management/departmentobj/selectBusinessObj',
            icon: icons.IconTarget,
            roles: ['supervisor']
        },
        {
            id: 'businessObjDep',
            title: <FormattedMessage id="Objetivos a cumplir" />,
            type: 'item',
            url: '/management/departmentobj/businessObjDep',
            icon: icons.IconTarget,
            roles: ['supervisor']
        },
        {
            id: 'staffgoals',
            title: <FormattedMessage id="Selección Objetivos Personales" />,
            type: "item",
            url: '/evaluated-staff/staff-goals/businessobj',
            icon: icons.IconTarget,
            roles: ['empleado']
        },
        {
            id: 'staffgoalsper',
            title: <FormattedMessage id="Objetivos Personales" />,
            type: "item",
            url: '/evaluated-staff/staff-goals/personalobj',
            icon: icons.IconTarget,
            roles: ['empleado']
        },
        {
            id: 'staffgoalperprop',
            title: <FormattedMessage id="Objetivos Personales propuestos" />,
            type: "item",
            url: '/evaluated-staff/staff-goals/personalobjprop',
            icon: icons.IconTarget,
            roles: ['empleado']
        },
        {
            id: 'selectobjpersprop',
            title: <FormattedMessage id="Lista de objetivos personales propuestos" />,
            type: "item",
            url: '/management/departmentObj/acceptObjPersProp',
            icon: icons.IconTarget,
            roles: ['empleado']
        }
    ]
};

// Filtrado dinámico de opciones del menú según el rol del usuario
const management = {
    ...managementList,
    children: managementList.children.filter(item => item.roles.includes(userRole))
};

export default management;

