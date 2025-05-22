import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import consultApi from '../../services/consultApi';

function Confirmacao(){
    const nav = useNavigate();

    function register(formData: FormData){
        consultApi(nav, 'post', '/confirmacao', formData);
    }

    return(
        <>
            <p>Verifique no seu Email</p><br />
            <p>Aguarde um pouco, caso não tenha sido enviado, solicite o reenvio abaixo.</p>
            <form action={register}>
                <label>Informe o email:</label>
                <input type='text' name='email' />
                <input type='submit' value='Enviar' />
            </form>
        </>
    );
}

function ConfirmacaoHash(){
    const nav = useNavigate();
    const { hash } = useParams();

    useEffect(() => {
        consultApi(nav, 'put', `/confirmacao/${hash}`);
    }, [hash])

    return(<p>hash da rota é { hash }</p>);
}

function RequestConfirmacaoHash(){
}

export { Confirmacao, ConfirmacaoHash, RequestConfirmacaoHash };