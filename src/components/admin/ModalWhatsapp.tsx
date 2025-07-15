/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { LoadingOutlined } from '@ant-design/icons';

import { Modal, Result, Spin } from "antd";
import Image from "next/image";
import { consultApiService } from "../../service/consultApiService";
import toast from "react-hot-toast";
import { UserProps } from "../../interface/user";
import { useStore } from "../../service/useStore";

export default function ModalWhatsapp({ modalOpen, setModalOpen }){
  const nav = useRouter();

  const [ qrCode, setQrCode ] = useState<string>("");
  const [ whatsappConnected, setWhatsappConnected ] = useState<boolean | null>();

  const userStore: UserProps | "OFF" | null = useStore((state) => state.userStore);
  
  useEffect(() => {
    if(userStore == null || userStore == "OFF" || userStore?.role == "USER"){
      return;
    }

    async function consultApi(){
      const apiData = await consultApiService(nav, "GET", "/admin/whatsapp", null);
      console.log("WhatsApp")
      if(apiData !== undefined && apiData !== null){
        if(apiData.data == "Whatsapp não conectado"){
          setWhatsappConnected(false);
          toast.error("WhatsApp não está conectado");
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
    <>
      <Modal title="Whatsapp" open={modalOpen} onOk={ () => setModalOpen(false) } onCancel={ () => setModalOpen(false) } footer={[]}>
        {
          whatsappConnected === true &&
          <div>
            <Result status="success" title="WhatsApp Conectado" />
          </div>
        }
        {
          whatsappConnected === false &&
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Result status="warning" title="WhatsApp não está conectado" subTitle="Leia o código QR Code abaixo com o aplicativo do WhatsApp" />
            { qrCode == "" ? <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }}/>}></Spin> : <Image src={qrCode} alt="QrCode irá aparecer aqui" width={250} height={250} style={{ margin: "auto" }}/> }
          </div>
        }
        {
          whatsappConnected == null &&
          <div>
            <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }}/>}></Spin>
          </div>
        }
      </Modal>
    </>
  )
}