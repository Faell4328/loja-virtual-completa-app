/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { Button, Form, Input } from 'antd';

import Link from "next/link";
import { useStore } from "../../service/useStore";
import { ApiProps } from "../../interface/returnApi";
import { consultApiService } from "../../service/consultApiService";
import { UserProps } from "../../interface/user";
import { bodyStyle, formStyle } from "../../styles/confirmacao.style";
import { containerButtonStyle, containerFormStyle, contentFormStyle } from "../../styles/instalacao.style";

interface FormDataProps{
  email: string;
  password: string;
}

export default function Login(){
  const nav = useRouter();
  const setUserStore = useStore((state) => state.setUserStore)

  async function formSubmit(data: FormDataProps){

    const form = {
      "email": data.email,
      "password": data.password
    }

    const api: ApiProps | null = await consultApiService(nav, "POST", "/login", true, JSON.stringify(form));

    if(api !== null && api.data !== undefined && api.data !== null){
      setUserStore(api.data as unknown as UserProps);
    }

    return;
  }

  return(
    <div css={ bodyStyle }>
      <div css={containerFormStyle}>
        <Form css={formStyle} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
          <h1 style={{ textAlign: "center" }}>Login</h1>
          <Form.Item label="Email:" name="email" rules={[{ type: "email", message: "Email inválido"}, { required: true, message: "Campo obrigatório" }]} style={{ marginTop: 30 }} css={ contentFormStyle} >
            <Input />
          </Form.Item>
          <Form.Item label="Senha:" name="password" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
            <Input.Password type="primary" />
          </Form.Item>
          <Form.Item css={ containerButtonStyle }>
            <Button style={{ width: 300, padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
          </Form.Item>
          <Link style={{ display: "block", textAlign: "center", marginBottom: 10 }} href="/recuperacao/senha">Esqueceu a senha?</Link>
          <Link style={{ display: "block", textAlign: "center" }} href="/cadastrar">Se cadastrar</Link>
        </Form>
      </div>
    </div>
  )
}