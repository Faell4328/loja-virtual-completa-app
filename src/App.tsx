import { createBrowserRouter } from 'react-router';

import Layout from './Layout';
import Home from './pages/Home';
import { ConfigSystem, CreateUserAdmin } from './pages/Instalacao';
import { Confirmacao, ConfirmacaoHash } from './pages/Confirmacao';
import { ListarUsuarios, ListarUsuarioEspecifico } from './pages/Admin';
import Whatsapp from './pages/Whatsapp';
import { Cadastrar, Login } from './pages/LoginCadastro';
import { InformacoesUsuario } from './pages/Usuario';
import { RecuperarSenha, SolicitarRecuperarSenha } from './pages/RecuperarSenha';

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
                path: '/admin/whatsapp',
                element: <Whatsapp />
            },
            {
                path: '/admin/users',
                element: <ListarUsuarios />
            },
            {
                path: '/admin/user/:hash',
                element: <ListarUsuarioEspecifico />
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
                path: '/confirmacao',
                element: <Confirmacao />
            },
            {
                path: '/confirmacao/:hash',
                element: <ConfirmacaoHash />
            },
            {
                path: '/recuperacao/senha',
                element: <SolicitarRecuperarSenha />
            },
            {
                path: '/recuperacao/senha/:hash',
                element: <RecuperarSenha />
            }
        ]
    }
]);

export { router };