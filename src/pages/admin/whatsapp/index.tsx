/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { useRouter as useRouterParams } from "next/router";
import { useEffect, useState } from "react"
import { LoadingOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';

import { Button, Result, Spin } from "antd";
import { consultApiService } from "../../../service/consultApiService";
import { bodyStyle } from "../../../styles/confirmacao.style";
import Image from "next/image";

export default function WhatsApp(){
  const nav = useRouter();

  const [ qrCode, setQrCode ] = useState<string>("");
  const [ whatsappConnected, setWhatsappConnected ] = useState<boolean | null>();
  
  useEffect(() => {
    async function consultApi(){
      const apiData = await consultApiService(nav, "GET", "/admin/whatsapp", null);
      console.log("WhatsApp")
      if(apiData !== undefined && apiData !== null){
        if(apiData.data == "Whatsapp não conectado"){
          setWhatsappConnected(false);
        }
        else if(apiData.data == "Whatsapp conectado"){
          setWhatsappConnected(true);
        }
      }
    }

    consultApi();
    obterQrCode()
  }, []);

  function obterQrCode(){
    const eventSource = new EventSource(process.env.NEXT_PUBLIC_URL_SERVER+"/admin/whatsapp/qr");
    eventSource.onmessage = (event) => {
      if(event.data.toString() === '"Pronto"'){
        setWhatsappConnected(true);
        return;
      }
      try{
        const imageBase64 = event.data;
        setQrCode(imageBase64);
      }
      catch(error){
        console.error('Erro: '+ error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro: '+ error);
      eventSource.close();
    }

    return () => {
      eventSource.close();
    }
  }

  return(
    <div css={bodyStyle}>
      {
        whatsappConnected === true &&
        <div>
          <Result status="success" title="WhatsApp Conectado" />
          <Button type="primary" href="/" style={{ width: "100%" }}>Ir para página home</Button>
        </div>
      }
      {
        whatsappConnected === false &&
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Result status="warning" title="WhatsApp não está conectado" subTitle="Leia o código QR Code abaixo com o WhatsApp" />
          { qrCode == "" ? <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }}/>}></Spin> : <Image src={qrCode} alt="QrCode irá aparecer aqui" width={250} height={250} style={{ margin: "auto" }}/> }
        </div>
      }
      {
        whatsappConnected == null &&
        <div>
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }}/>}></Spin>
        </div>
      }
    </div>
  )
}