import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import consultApi from "../../services/consultApi";

function ListarUsers(){
    const [ user, setUser ] = useState<any>([]);
    const nav = useNavigate();

    async function consultar(){
        const retorno = await consultApi(nav, 'get', '/admin/users');
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
                        <p>Usuário id: { usuario.id }</p>
                        <p>Nome do usuário: { usuario.name }</p>
                        <p>Email do usuário: { usuario.email }</p>
                    </div>
                ))
            }
        </div>
    )

}

export { ListarUsers }