import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication2/Login2')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication2/Register2')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/authentication2/ForgotPassword2')));
const AuthResetPassword = Loadable(lazy(() => import('views/pages/authentication/authentication2/ResetPassword2')));
const AuthCheckMail = Loadable(lazy(() => import('views/pages/authentication/authentication2/CheckMail2')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/',
            element: <AuthLogin />
        },
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        },
        {
            path: '/forgot',
            element: <AuthForgotPassword />
        },
        {
            path: '/reset-password/:id',
            element: <AuthResetPassword />
        },
        {
            path: '/check-mail',
            element: <AuthCheckMail />
        }
    ]
};

export default LoginRoutes;
