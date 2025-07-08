/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { useRouter } from "next/router"
import { Steps } from "antd";
import { UserAddOutlined, SettingOutlined } from "@ant-design/icons"
import Config from "./config";
import Admin from "./admin";
import { bodyStyle } from "../../../styles/confirmacao.style";
import { stepStyle } from "../../../styles/instalacao.style";

interface ReturnApiProps{
  redirect: string;
}

export default function Instalacao(){
  const nav = useRouter();
  const { option } = nav.query;
  let optionSteps = 0;

  if(option == "config"){
    optionSteps = 1
  }
  else if(option == "admin"){
    optionSteps = 2
  }

  return(
    <div css={bodyStyle}>
      <div style={{ marginBottom: 30 }}>
        <Steps
          css={stepStyle}
          current={optionSteps}
          items={[
            {
              title: "Configuração do sistema",
              description: "Etapa 1",
              icon: <SettingOutlined />,
            },
            {
              title: "Criação de conta admin",
              description: "Etapa 2",
              icon: <UserAddOutlined />
            },
          ]}
        />
      </div>
      <div style={{ height: "100%" }}>
        { optionSteps == 0 && (<h1 style={{ textAlign: "center" }}>Rota inválida</h1>)}
        { optionSteps == 1 && <Config /> }
        { optionSteps == 2 && <Admin /> }
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  try{
    const returnApi = await fetch(process.env.NEXT_PUBLIC_URL_SERVER+"/");
    if(returnApi === null){
      console.log("Erro ao consultar API")
      return{
        redirect: {
          destination: '/',
          permanent: true,
        }
      }
    }

    const returnApiTreated: ReturnApiProps = await returnApi.json();

    if(returnApiTreated.redirect === "/instalacao/config" || returnApiTreated.redirect === "/instalacao/admin"){
      return{
        props: {}
      }
    }
    else{
      return{
        redirect: {
          destination: '/',
          permanent: true,
        }
      }
    }

  }
  catch(error){
    console.log("Erro ao consultar API", error)
    return{
      redirect: {
        destination: '/',
        permanent: true,
      }
    }
  }

}