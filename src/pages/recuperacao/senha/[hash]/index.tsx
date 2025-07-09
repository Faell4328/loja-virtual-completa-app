/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { useRouter as useRouterParams } from "next/router";
import { useEffect, useState } from "react"
import { LoadingOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';

import { Button, Form, Result, Spin } from "antd";
import Password from "antd/es/input/Password";
import { ApiProps } from "../../../../interface/returnApi";
import { consultApiService } from "../../../../service/consultApiService";
import { bodyStyle, formStyle } from "../../../../styles/confirmacao.style";

interface FormDataProps{
  password1: string;
  password2: string;
}

export default function RecuperacaoSenha(){
  const nav = useRouter();
  const route = useRouterParams();
  const { hash } = route.query;

  const [ returnApiState, setReturApiState ] = useState(""); 

  useEffect(() => {
    async function consultApi(){
      const apiData = await consultApiService(nav, "GET", `/recuperacao/senha/${hash}`, null);
      if(apiData !== undefined && apiData !== null){
        console.log(apiData);
        if(apiData.error !== null && apiData.error !== "A senha 1 deve ter no mínimo 8 caracteres" && apiData.error !== "As senhas estão diferentes"){
          setReturApiState(apiData?.error as string);
          return;
        }
        else if(apiData.ok !==null){
          setReturApiState(apiData?.ok as string);
          return;
        }
      }
    }
    if(nav && hash){
      consultApi();
    }
  }, [hash])

  async function formSubmit(data: FormDataProps){
    const form = new FormData();

    form.append("password1", data.password1 as string);
    form.append("password2", data.password2 as string);

    const apiData: ApiProps | null = await consultApiService(nav, "PUT", `/recuperacao/senha/${hash}`, form);
    if(apiData !== undefined && apiData !== null){
      if(apiData.error !== null && apiData.error !== "A senha 1 deve ter no mínimo 8 caracteres" && apiData.error !== "As senhas estão diferentes"){
        setReturApiState(apiData?.error as string);
        return;
      }
      else if(apiData.ok !==null){
        setReturApiState(apiData?.ok as string);
        return;
      }
    }
  }
  
  return(
    <div css={bodyStyle}>
      {
        returnApiState == "" &&
        <Form css={formStyle} name="basic" layout="vertical" onFinish={(e: FormDataProps) => formSubmit(e)}>
          <h1 style={{ textAlign: "center" }}>Recuperação de senha</h1>
          <Form.Item label="Senha 1:" name="password1" rules={[{ required: true, message: "Campo obrigatório" }]}>
            <Password />
          </Form.Item>
          <Form.Item label="Senha 2:" name="password2" rules={[{ required: true, message: "Campo obrigatório" }]}>
            <Password />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: "100%", padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
          </Form.Item>
        </Form>
      }
      {
        returnApiState === "Senha alterada" &&
        <div>
          <Result status="success" title="Senha alterada" subTitle="Sua senha foi alterada com sucesso." />
          <Button type="primary" href="/login" style={{ width: "100%" }}>Faça login</Button>
        </div>
      }
      {
        returnApiState === "Token inválido" &&
        <div>
          <Result status="error" title="Token Inválido" subTitle="O token fornecido é inválido." />
          <Button type="primary" href="/recuperacao/senha" style={{ width: "100%" }}>Solicitar novamente</Button>
        </div>
      }
      {
        returnApiState === "Token espirado, foi enviado para seu email um novo link" &&
        <div>
          <Result status="warning" title="Token Expirado" subTitle="O token expirou. Um novo será enviado para seu e-mail." />
        </div>
      }
      {
        returnApiState === "Você excedeu o limite de tentativas, tente novamente em 10 minutos" &&
        <div>
          <Result icon={<LockOutlined />} title="Limite de Tentativas Excedido" subTitle="Você excedeu o número de tentativas. Tente novamente em 10 minutos." />
          <Button type="primary" href="/" style={{ width: "100%" }}>Ir para página home</Button>
        </div>
      }
    </div>
  )
}