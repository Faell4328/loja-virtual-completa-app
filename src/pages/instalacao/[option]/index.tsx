/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router"
import { Steps } from "antd";
import { UserAddOutlined, SettingOutlined } from "@ant-design/icons"
import Config from "./config";
import Admin from "./admin";
import { consultApiService } from "@/service/consultApiService";

export default function Instalacao(){
  const nav = useRouter();
  const { option } = nav.query;
  let optionSteps = 0;

  if(option == "config"){
    optionSteps = 0
  }
  else if(option == "admin"){
    optionSteps = 1
  }

  return(
    <>
      <Steps
        css={css`@media(max-width: 575px){ align-items: center }`}
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
      { optionSteps == 0 && <Config /> }
      { optionSteps == 1 && <Admin /> }
    </>
  )
}

export const getServerSideProps = async () => {
  let returnApi:any = await fetch(process.env.NEXT_PUBLIC_URL_SERVER+"/");
  try{
    if(returnApi === null){
      console.log("Erro ao consultar API")
      return{
        redirect: {
          destination: '/',
          permanent: true,
        }
      }
    }

    returnApi = await returnApi.json();

    if(returnApi.redirect === "/instalacao/config" || returnApi.redirect === "/instalacao/admin"){
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
    console.log("Erro ao consultar API")
    return{
      redirect: {
        destination: '/',
        permanent: true,
      }
    }
  }

}