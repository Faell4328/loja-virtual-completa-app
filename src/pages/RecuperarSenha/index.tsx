import { useNavigate } from 'react-router';

import consultApi from '../../services/consultApi';

export function SolicitarRecuperarSenha(){
    const nav = useNavigate();

    function soliciarRedefinicaoSenha(formData: FormData){
        consultApi(nav, 'post', '/recuperacao/senha', formData)
    }

    return(
        <div>
            <form action={soliciarRedefinicaoSenha}>
                <label>Coloque o email que deseja solicitar a redefinição de senha:</label><br />
                <input type='email' name='email' /><br /><br />
                <input type='submit' value='Enviar' />
            </form>
        </div>
    )
}

import { useParams } from 'react-router';

export function RecuperarSenha(){
    const nav = useNavigate();
    const { hash } = useParams();

    function redefinirSenha(formData: FormData){
        consultApi(nav, 'put', `/recuperacao/senha/${hash}`, formData)
    }

    return(
        <div>
            <form action={redefinirSenha}>
                <label>Coloque a senha 1</label><br />
                <input type='password' name='password1' /><br />
                <label>Coloque a senha 2</label><br />
                <input type='password' name='password2' /><br /><br />
                <input type='submit' value='Enviar' />
            </form>
        </div>
    )
}