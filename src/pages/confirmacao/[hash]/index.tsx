/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { useRouter as useRouterParams } from "next/router";
import { useEffect, useState } from "react"
import { LoadingOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';

import { Button, Result, Spin } from "antd";
import { consultApiService } from "../../../service/consultApiService";
import { bodyStyle } from "../../../styles/confirmacao.style";

export default function ConfirmacaoEmail(){
  const nav = useRouter();
  const route = useRouterParams();
  const { hash } = route.query;

  const [ returnApi, setReturApi ] = useState(""); 
  
  useEffect(() => {
    async function consultApi(){
      const apiData = await consultApiService(nav, "PUT", `/confirmacao/${hash}`, null);
      if(apiData !== undefined && apiData !== null){
        console.log(apiData);
        if(apiData.error == null){
          setReturApi(apiData?.ok as string);
        }
        else{
          setReturApi(apiData?.error as string);
        }
      }
    }
    if(nav && hash){
      consultApi();
    }
  }, [nav, hash])
  return(
    <div css={bodyStyle}>
      { returnApi === "Email válidado" && <div><Result status="success" title="Conta Verificada" subTitle="Sua conta foi verificada com sucesso." /><Button type="primary" href="/" style={{ width: "100%" }}>Ir para página home</Button></div>}
      { returnApi === "Token inválido" && <Result status="error" title="Token Inválido" subTitle="O token fornecido é inválido." /> }
      { returnApi === "Token expirado" && <Result status="warning" title="Token Expirado" subTitle="O token expirou. Um novo será enviado para seu e-mail." /> }
      { returnApi === "Você excedeu o limite de tentativas, tente novamente em 10 minutos" && <Result icon={<LockOutlined />} title="Limite de Tentativas Excedido" subTitle="Você excedeu o número de tentativas. Tente novamente em 10 minutos." /> }
      { returnApi == "" && <div><Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }}/>}></Spin></div> }
    </div>
  )
}