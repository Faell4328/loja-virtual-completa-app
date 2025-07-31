/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { Button, Form, Input, InputNumber } from 'antd';

import Link from "next/link";
import { consultApiService } from "../../service/consultApiService";
import { containerButtonStyle, containerFormStyle, contentFormStyle } from "../../styles/instalacao.style";
import { bodyStyle, formStyle } from "../../styles/confirmacao.style";

interface FormDataProps{
  name: string;
  phone: string;
  email: string;
  password: string;
}

export default function Cadastrar(){
  const nav = useRouter();
  function formSubmit(data: FormDataProps){

    const form = {
      "name": data.name,
      "phone": data.phone,
      "email": data.email,
      "password": data.password
    }

    consultApiService(nav, "POST", "/cadastrar", true, JSON.stringify(form));
    return;
  }

  return(
    <div css={ bodyStyle }>
      <div css={containerFormStyle}>
        <Form css={formStyle} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
          <h1 style={{ textAlign: "center" }}>Cadastrar</h1>
          <Form.Item label="Nome:" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ marginTop: 30 }} css={ contentFormStyle } >
            <Input />
          </Form.Item>
          <Form.Item label="Telefone" name="phone" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ width: "100%" }}>
            <InputNumber type="number" controls={false} style={{ width: "100%" }} addonBefore="+55"/>
          </Form.Item>
          <Form.Item label="Email:" name="email" rules={[{ type: "email", message: "Email inválido"}, { required: true, message: "Campo obrigatório" }]} css={ contentFormStyle} >
            <Input />
          </Form.Item>
          <Form.Item label="Senha:" name="password" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
            <Input.Password type="primary" />
          </Form.Item>
          <Form.Item css={ containerButtonStyle }>
            <Button style={{ width: 300, padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
          </Form.Item>
          <Link style={{ display: "block", textAlign: "center" }} href="/login">Fazer Login</Link>
        </Form>
      </div>
    </div>
  )
}