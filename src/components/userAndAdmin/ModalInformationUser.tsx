/** @jsxImportSource @emotion/react */

import { Button, Form, Input, InputNumber, MenuProps, Modal, Select, Upload } from "antd";
import { useRouter } from "next/navigation";
import { RcFile, UploadFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { consultApiService } from "../../service/consultApiService";
import { contentFormStyle } from "../../styles/instalacao.style";
import { UserProps } from "../../interface/user";
import { useStore } from "../../service/useStore";

interface userInformationApiProps{
  name: string;
  phone: string;
  address?: {
    description: string;
    street: string;
    number: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    complement?: string;
  }
}

interface FormDataProps{
  name: string;
  phone: string;
  description?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  complement?: string;
}

interface TypeProps{
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export default function ModalCreateProduct({ modalOpen, setModalOpen }: TypeProps){
  const nav = useRouter();
  const [ requiredAddressField, setRequiredAddressField ] = useState(false);
  const [ formElement ] = useForm();
  
  const userStore: UserProps | "OFF" | null = useStore((state) => state.userStore);

  useEffect(() => {
    if(userStore == null || userStore == "OFF"){
      return;
    }

    async function consultApi(){
      const returnApi = await consultApiService(nav, "GET", "/usuario", null, null);

      if(returnApi == null || returnApi?.data == null){
        console.error("Erro ao consultar os dados pessoais");
        return;
      }

      const userInformation: userInformationApiProps = returnApi.data as userInformationApiProps;

      if(userInformation?.name && userInformation?.phone){
        const { name, phone } = userInformation;

        (name) && formElement.setFieldValue("name", name);
        (phone) && formElement.setFieldValue("phone", phone);
      }

      if(userInformation?.address){
        setRequiredAddressField(true);
        const { description, zipCode, street, number, neighborhood, city, state, complement } = userInformation.address;
        (description) && formElement.setFieldValue("description", description);
        (zipCode) && formElement.setFieldValue("zipCode", zipCode);
        (street) && formElement.setFieldValue("street", street);
        (number) && formElement.setFieldValue("number", number);
        (neighborhood) && formElement.setFieldValue("neighborhood", neighborhood);
        (city) && formElement.setFieldValue("city", city);
        (state) && formElement.setFieldValue("state", state);
        (complement) && formElement.setFieldValue("complement", complement);
      }
    }

    consultApi();
  }, []);

  async function consultCep(cep: string){
    try{
      if(cep.toString().length !== 8){
        return;
      }

      const returnConsult = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

      if(returnConsult == null){
        console.error("Não é possível consultar API do CEP (#2)");
        return;
      }

      const address = await returnConsult.json();
      console.log(address);

      formElement.setFieldValue("street", address.logradouro);
      formElement.setFieldValue("neighborhood", address.bairro);
      formElement.setFieldValue("city", address.localidade);
      formElement.setFieldValue("state", address.uf);
    }
    catch(error){
      console.error("Não é possível consultar API do CEP (#1)");
      return;
    }
  }

  function applicationControlAddress(allFieldAddress){
    const { description, street, number, neighborhood, zipCode, state, city } = allFieldAddress;

    const address = [ description, street, number, neighborhood, zipCode, state, city ];
    
    const allNoUndefined = address.filter(item => {
      return item == undefined || item == ""
    });

    console.log(allNoUndefined.length);
    
    if( allNoUndefined.length !== 7 ){
      setRequiredAddressField(true);
    }
    else{
      setRequiredAddressField(false);
      
      formElement.setFields([
        { name: 'description', errors: [] },
        { name: 'zipCode', errors: [] },
        { name: 'street', errors: [] },
        { name: 'number', errors: [] },
        { name: 'neighborhood', errors: [] },
        { name: 'city', errors: [] },
        { name: 'state', errors: [] },
      ]);
    }
  }

  async function formSubmit(data: FormDataProps){

    let form = {};

    if(requiredAddressField){
      const { name, phone, description, zipCode, street, number, neighborhood, city, state, complement } = formElement.getFieldsValue();
      form = {
        "name": name,
        "phone": phone,
        "description": description,
        "zipCode": zipCode,
        "street": street,
        "number": number,
        "neighborhood": neighborhood,
        "city": city,
        "state": state,
        "complement": complement
      }
    }
    else{
      const { name, phone } = formElement.getFieldsValue();
      form = {
        "name": name,
        "phoe": phone,
      }
    }

    console.log("Valor de form é: ")
    console.log(form);

    consultApiService(nav, "PUT", "/usuario", true, JSON.stringify(form));
  }

  return(
    <Modal title="Atualizar Informações" open={modalOpen} onOk={ () => setModalOpen(false) } onCancel={ () => setModalOpen(false) } footer={[]} style={{ top: 20, display: "flex", justifyContent: "center" }}>
        <Form form={formElement} style={{ display: "flex", flexDirection: "column", margin: "auto", width: "80%" }} name="basic" layout="vertical" onValuesChange={(current, all) => applicationControlAddress(all)} onFinish={(e) => formSubmit(e)}>
          <Form.Item label="Nome:" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ marginTop: 30, width: "100%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Telefone" name="phone" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <InputNumber type="number" controls={false} style={{ width: "100%" }} addonBefore="+55"/>
          </Form.Item>
          <Form.Item label="Descrição:" name="description" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <Input placeholder="Casa branca da esquina" />
          </Form.Item>
          <Form.Item label="CEP:" name="zipCode" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <InputNumber type="number" controls={false} style={{ width: "100%" }} onChange={(cep: string) => consultCep(cep)}/>
          </Form.Item>
          <Form.Item label="Rua:" name="street" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Número:" name="number" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <Input style={{ width: "100%" }}/>
          </Form.Item>
          <Form.Item label="Bairro:" name="neighborhood" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <Input />
          </Form.Item>
          <div style={{ width: "100%" }}>
              <div style={{ display: 'grid', gridTemplateColumns: "repeat(2, 1fr)" }}>
                <Form.Item label="Cidade" name="city" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: '90%' }}>
                  <Input />
                </Form.Item>
                <Form.Item label="Estado" name="state" rules={[{ required: requiredAddressField, message: "Campo obrigatório" }]} style={{ width: '90%', marginInlineStart: "10%" }}>
                  <Input />
                </Form.Item>
              </div>
          </div>
          <Form.Item label="Complemento:" name="complement" style={{ width: "100%" }}>
            <Input placeholder="Entregar entre às 13 horas até 15 horas" />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: "100%", padding: 20 }} type="primary" htmlType="submit">Salvar Produto</Button>
          </Form.Item>
        </Form>
    </Modal>
  )
}