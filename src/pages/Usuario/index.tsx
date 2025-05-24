import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import consultApi from '../../services/consultApi';

interface InformacoesAddressProps{
    description: string;
    street: string;
    number: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    complement: string | undefined;
}

interface InformacoesUsuarioProps{
    name: string;
    phone: string;
    address: InformacoesAddressProps | undefined;
}

export function InformacoesUsuario(){
    const nav = useNavigate();
    const [ informacoesUsuario, setInformacoesUsuario ] = useState<InformacoesUsuarioProps>({ name: '', phone: '', address: { description: '', street: '', number: '', neighborhood: '', zipCode: '', city: '', state: '', complement: '' }});

    function atualizarInformacaoState(elementoFormulario: HTMLInputElement){
        if(elementoFormulario.name == 'name'){
            setInformacoesUsuario(prev => ({
                ...prev!, name: elementoFormulario.value
            }))
        }
        else if(elementoFormulario.name == 'phone'){
            setInformacoesUsuario(prev => ({
                ...prev!, phone: elementoFormulario.value
            }))
        }
        else if(elementoFormulario.name == 'description'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, description: elementoFormulario.value }
            }))
        }
        else if(elementoFormulario.name == 'street'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, street: elementoFormulario.value }
            }))
        }
        else if(elementoFormulario.name == 'number'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, number: elementoFormulario.value }
            }))
        }
        else if(elementoFormulario.name == 'neighborhood'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, neighborhood: elementoFormulario.value }
            }))
        }
        else if(elementoFormulario.name == 'zipCode'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, zipCode: elementoFormulario.value }
            }))
            if(elementoFormulario.value.length == 8){
                consultarCep(elementoFormulario.value);
            }
        }
        else if(elementoFormulario.name == 'city'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, city: elementoFormulario.value }
            }))
        }
        else if(elementoFormulario.name == 'state'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, state: elementoFormulario.value }
            }))
        }
        else if(elementoFormulario.name == 'complement'){
            setInformacoesUsuario(prev => ({
                ...prev!, address: { ...prev!.address!, complement: elementoFormulario.value }
            }))
        }
    }

    function atualizarInformacaoApi(formData: FormData){
        const formularioAjustado = new FormData();
        const name = formData.get('name');
        const phone = formData.get('phone');
        const description = formData.get('description');
        const street = formData.get('street');
        const number = formData.get('number');
        const neighborhood = formData.get('neighborhood');
        const zipCode = formData.get('zipCode');
        const city = formData.get('city');
        const state = formData.get('state');
        const complement = formData.get('complement');

        (name !== '' && name !== null) && formularioAjustado.append('name', name);
        (phone !== '' && phone !== null) && formularioAjustado.append('phone', phone);
        (description !== '' && description !== null) && formularioAjustado.append('description', description);
        (street !== '' && street !== null) && formularioAjustado.append('street', street);
        (number !== '' && number !== null) && formularioAjustado.append('number', number);
        (neighborhood !== '' && neighborhood !== null) && formularioAjustado.append('neighborhood', neighborhood);
        (zipCode !== '' && zipCode !== null) && formularioAjustado.append('zipCode', zipCode);
        (city !== '' && city !== null) && formularioAjustado.append('city', city);
        (state !== '' && state !== null) && formularioAjustado.append('state', state);
        (complement !== '' && complement !== null) && formularioAjustado.append('complement', complement);

        consultApi(nav, 'put', '/usuario', formularioAjustado);
    }

    function deletarInformacoesEndereco(){
        window.confirm('Você deseja realmente apagar seu endereço?') && consultApi(nav, 'delete', '/usuario/endereco')
        setInformacoesUsuario({ name: '', phone: '', address: { description: '', street: '', number: '', neighborhood: '', zipCode: '', city: '', state: '', complement: '' }});
        consultar();
    }

    async function consultar(){
        let retorno = await consultApi(nav, 'get', '/usuario')
        retorno = retorno.data;
        if(retorno.address == undefined){
            setInformacoesUsuario(prev => ({ ...prev!, name: retorno.name, phone: retorno.phone }));
        }
        else{
            if(retorno.address.complement == null ){
                retorno.address.complement = '';
            }
            setInformacoesUsuario(retorno);
        }
    }

    async function consultarCep(cep: string){
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((response: any) => response.json())
            .then((data: any) => {
                if(data.error == undefined){
                    console.log(data);
                    const { logradouro:street, bairro: neighborhood, localidade: city, uf: state } = data;
                    setInformacoesUsuario(prev => ({
                        ...prev!, address: { ...prev!.address!, street, neighborhood, city, state }
                    }))
                }
            })

    }

    useEffect(() => {
        consultar();
    }, []);

    return(
        <>
            { informacoesUsuario && 
                <div>
                    <form action={ atualizarInformacaoApi }>
                        <b>Informações pessoais</b><br /><br />
                        <label>Nome do usuário</label><br />
                        <input type='text' name='name' value={ informacoesUsuario.name } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Telefone</label><br />
                        <input type='text' name='phone' value={ informacoesUsuario.phone } onChange={ (e) => atualizarInformacaoState(e.target) }/><br /><br />
                        <b>Endereço</b><br />
                        <label>Descrição</label><br />
                        <input type='text' name='description' placeholder='Casa Principal' value={ informacoesUsuario.address?.description } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>CEP</label><br />
                        <input type='text' name='zipCode' value={ informacoesUsuario.address?.zipCode } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Rua</label><br />
                        <input type='text' name='street' value={ informacoesUsuario.address?.street } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Número</label><br />
                        <input type='text' name='number' value={ informacoesUsuario.address?.number } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Bairro</label><br />
                        <input type='text' name='neighborhood' value={ informacoesUsuario.address?.neighborhood } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Cidade</label><br />
                        <input type='text' name='city' value={ informacoesUsuario.address?.city } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Estado</label><br />
                        <input type='text' name='state' value={ informacoesUsuario.address?.state } onChange={ (e) => atualizarInformacaoState(e.target) }/><br />
                        <label>Complemento</label><br />
                        <input type='text' name='complement' value={ informacoesUsuario.address?.complement } onChange={ (e) => atualizarInformacaoState(e.target) } /><br /><br />
                        <input type='submit' value='Enviar' />
                    </form>
                    <button onClick={ deletarInformacoesEndereco }>Deletar Informações de endereço</button>
                </div>
            }
        </>
    )

}