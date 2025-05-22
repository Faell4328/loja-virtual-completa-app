import { useNavigate } from "react-router";
import consultApi from '../../services/consultApi';

export function Login(){
    const nav = useNavigate();

    function logar(formData: FormData){
        consultApi(nav, 'post', '/login', formData);
    }

    return(
        <form action={ logar }>
            <label>Email</label><br />
            <input type='text' name='email' /><br />
            <label>Senha</label><br />
            <input type='password' name='password' /><br />
            <input type='submit' value='Enviar' />
        </form>
    )
}

export function Cadastrar(){
    const nav = useNavigate();

    function cadastrar(formData: FormData){
        consultApi(nav, 'post', '/cadastrar', formData);
    }

    return(
        <form action={ cadastrar }>
            <label>Nome</label><br />
            <input type='text' name='name' /><br />
            <label>Email</label><br />
            <input type='text' name='email' /><br />
            <label>Telefone</label><br />
            <input type='text' name='phone' /><br />
            <label>Senha</label><br />
            <input type='password' name='password' /><br />
            <input type='submit' value='Enviar' />
        </form>
    )
}