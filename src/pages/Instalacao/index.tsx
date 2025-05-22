import { useNavigate } from "react-router";

import consultApi  from "../../services/consultApi";

function ConfigSystem(){
    const nav = useNavigate();

    function registrar(formData: FormData){
        console.log(formData)
        consultApi(nav, 'post', '/instalacao/config', formData);
    }

    return(
        <form action={registrar}>
            <label>Nome</label><br />
            <input type='text' name='name' /><br /><br />
            <label>Arquivo</label><br />
            <input type='file' name='file' /><br /><br /><br />
            <input type='submit' value='Enviar' />
        </form>
    )
};

function CreateUserAdmin(){
    const nav = useNavigate();

    function registrar(formData: FormData){
        console.log(formData)
        consultApi(nav, 'post', '/instalacao/admin', formData);
    }

    return(
        <form action={registrar}>
            <label>Nome</label><br />
            <input type='text' name='name' /><br /><br />
            <label>Telefone</label><br />
            <input type='text' name='phone' /><br /><br />
            <label>Email</label><br />
            <input type='text' name='email' /><br /><br />
            <label>senha</label><br />
            <input type='password' name='password' /><br /><br /><br />
            <input type='submit' value='Enviar' />
        </form>
    )
};

export { ConfigSystem, CreateUserAdmin };