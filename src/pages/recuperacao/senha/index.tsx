/** @jsxImportSource @emotion/react */

import { Result, Button, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { consultApiService } from '../../../service/consultApiService';
import { ApiProps } from '../../../interface/returnApi';
import { bodyStyle, formStyle } from '../../../styles/confirmacao.style';

interface FormDataProps{
  email: string;
}

export default function RecuperarSenha() {
  const nav = useRouter();

  const [ sendState, setSendState ] = useState(false);

  async function formSubmit(data: FormDataProps){
    const form = new FormData();

    form.append("email", data.email as string);

    const returnApi: ApiProps | null = await consultApiService(nav, "POST", "/recuperacao/senha", form);
    if(returnApi !== null && returnApi?.ok && !returnApi?.error){
      setSendState(true);
    }
    return;
  }

  return (
    <div css={bodyStyle}>
      <Form css={formStyle} name="basic" layout="vertical" onFinish={(e: FormDataProps) => formSubmit(e)}>
      {
        sendState &&
        <Result
          icon={<MailOutlined style={{ color: '#1890ff' }} />}
          title="Verifique seu e-mail"
          subTitle="Enviamos um link para seu e-mail. Clique nele para redefinir sua conta."
        />
      }
      {
        !sendState &&
        <div>
        <h1 style={{ textAlign: "center" }}>Recuperação de senha</h1>
        <p>Adicione o e-mail que você deseja recuperar a senha</p>
        <Form.Item label="Email:" name="email" rules={[{ required: true, message: "Campo obrigatório" }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: "100%", padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
        </Form.Item>
        </div>
      }
      </Form>
    </div>
  );
}
