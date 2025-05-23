import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router';

import consultApi from "../../services/consultApi";


export default function Home() {
    const [ role, setRole ] = useState(null);
    const nav = useNavigate();

    async function atualizarRole(){
        let retorno = await consultApi(nav, 'get', '/', null);
        retorno = retorno.data;
        setRole(retorno);
    }

    async function deslogar(){
        consultApi(nav, 'put', '/deslogar', null);
        setRole(null);
    }

    useEffect(() => {
        atualizarRole();
    }, [consultApi]);

    return(
        <div>
            <p>Home</p>
            {
                (!role) && 
                <div>
                    <Link to='/login'>Logar</Link><br />
                    <Link to='/cadastrar'>Cadastrar</Link><br />
                </div>
            }

            {
                role &&
                <div>
                    <p>Você está logado</p>
                    <button onClick={ deslogar }>Deslogar</button>
                </div>

            }
            {

                (role && role == 'USER') && 
                <div>
                    <Link to='/usuario'>Informações do usuário</Link><br />
                </div>
            }
            {
                (role && role == 'ADMIN') && 
                <div>
                    <Link to='/admin/users'>Listar usuários</Link><br />
                    <Link to='/admin/whatsapp'>Conectar Whatsapp</Link>
                </div>
            }
        </div>
    )
}
