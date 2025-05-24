import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router";

import consultApi from "../../services/consultApi";

function ListarUsuarios(){
    const [ user, setUser ] = useState<any>([]);
    const nav = useNavigate();

    async function consultar(){
        const retorno = await consultApi(nav, 'get', '/admin/usuarios');
        setUser(retorno.data);
    }

    useEffect(() => {
        consultar();
    }, []);

    return(
        <div>
            <p>Listar usuários</p>
            {
                user && 
                user.map((usuario: any) => (
                    <div key={ usuario.id } style={{border: '1px solid #000'}}>
                        <p>Nome do usuário: { usuario.name }</p>
                        <p>Email do usuário: { usuario.email }</p>
                        <p>Permissão do usuário: { usuario.role }</p>
                        <p>Status do usuário: { usuario.status }</p>
                        <Link to={`/admin/user/${usuario.id}`}>Mais informações</Link>
                    </div>
                ))
            }
        </div>
    )

}

function ListarUsuarioEspecifico(){
    const [ user, setUser ] = useState<any>([]);
    const { hash } = useParams();
    const nav = useNavigate();

    async function consultar(){
        const retorno = await consultApi(nav, 'get', `/admin/usuario/${hash}`);
        setUser(retorno.data);
    }

    useEffect(() => {
        consultar();
    }, []);

    return(
        <div>
            {
                user && 
                <div>
                    <p><b>Informações de { user.name }</b></p>
                    <p>Usuário id: { user.id }</p>
                    <p>Email do usuário: { user.email }</p>
                    <p>Telefone do usuário: { user.phone }</p>
                    <p>Permissão do usuário: { user.role }</p>
                    <p>Status do usuário: { user.status }</p>
                    {
                        user.address !== undefined ?
                        <div>
                            <p><b>Endereço</b></p>
                            <p>Descrição: { user.address.description}</p>
                            <p>{ user.address.street }</p>
                            <p>Número: { user.address.number }</p>
                            <p>CEP: { user.address.zipCode }</p>
                            <p>Bairro: { user.address.neighborhood }</p>
                            <p>Cidade: { user.address.city }</p>
                            <p>Estado: { user.address.state }</p>
                            <p>Complemento: { user.address.complement || 'Sem complemento' }</p>
                        </div>:
                        <p><b>Usuário sem endereço cadastrado</b></p>
                    }
                </div>
            }
        </div>
    )

}

export { ListarUsuarios, ListarUsuarioEspecifico }