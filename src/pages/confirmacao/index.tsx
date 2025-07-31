/** @jsxImportSource @emotion/react */

import { Result, Button, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { bodyStyle, formStyle } from "../../styles/confirmacao.style";
import { useRouter } from "next/navigation";
import { consultApiService } from '../../service/consultApiService';

interface FormDataProps{
  email: string;
}

export default function EmailConfirmation() {
  const nav = useRouter();

  function formSubmit(data: FormDataProps){

    const form = {
      "email": data.email
    }

    consultApiService(nav, "POST", "/confirmacao", true, JSON.stringify(form));
    return;
  }

  return (
    <div css={bodyStyle}>
      <Result
        icon={<MailOutlined style={{ color: '#1890ff' }} />}
        title="Verifique seu e-mail"
        subTitle="Enviamos um link de ativação para seu e-mail. Clique nele para ativar sua conta."
      />
      <Form css={formStyle} name="basic" layout="vertical" onFinish={(e: FormDataProps) => formSubmit(e)}>
        <h3>Não recebeu o e-mail? Informe seu endereço abaixo para reenviarmos.</h3>
        <Form.Item label="Email:" name="email" rules={[{ required: true, message: "Campo obrigatório" }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: "100%", padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
