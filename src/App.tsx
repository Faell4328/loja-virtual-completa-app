import { createBrowserRouter } from 'react-router';

import Layout from './Layout';
import Home from './pages/Home';
import { ConfigSystem, CreateUserAdmin } from './pages/Instalacao';
import { Confirmacao, ConfirmacaoHash } from './pages/Confirmacao';
import { ListarUsers } from './pages/Admin';
import Whatsapp from './pages/Whatsapp';
import { Cadastrar, Login } from './pages/Sistema';
import { InformacoesUsuario } from './pages/Usuario';

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/instalacao/config',
                element: <ConfigSystem />
            },
            {
                path: '/instalacao/admin',
                element: <CreateUserAdmin />
            },
            {
                path: '/confirmacao',
                element: <Confirmacao />
            },
            {
                path: '/admin/whatsapp',
                element: <Whatsapp />
            },
            {
                path: '/admin/users',
                element: <ListarUsers />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/cadastrar',
                element: <Cadastrar />
            },
            {
                path: '/usuario',
                element: <InformacoesUsuario />
            },
            {
                path: '/confirmacao/:hash',
                element: <ConfirmacaoHash />
            }
        ]
    }
]);

export { router };