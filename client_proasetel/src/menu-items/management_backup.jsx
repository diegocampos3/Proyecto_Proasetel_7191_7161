// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconClipboardCheck,
    IconFileSettings
} from '@tabler/icons-react';

// constant
const icons = {
    IconClipboardCheck,
    IconFileSettings
};

// ==============================|| MENU ITEMS - MANAGEMENT ||============================== //

const management = {
    id: 'management',
    title: <FormattedMessage id="gestion" />,
    icon: icons.IconUserCheck,
    type: 'group',
    children: [
        {
            id: 'formularios',
            title: <FormattedMessage id="Formularios" />,
            type: 'item',
            url: '/management/formularios',
            icon: icons.IconClipboardCheck,
            breadcrumbs: false
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
            breadcrumbs: false
        }
    ]
};

export default management;
