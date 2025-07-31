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
      const apiData = await consultApiService(nav, "GET", "/admin/whatsapp", false, null);
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
    obterQrCode();
  }, []);

  function obterQrCode(){
    fetchEventSource('http://192.168.100.117:5000/admin/whatsapp/qr', {
      headers: {
        Authorization: 'Bearer token_aqui'
      },
      withCredentials: true,
      onMessage: (data, eventType) => {
        console.log(`Evento: ${eventType}`);
        console.log(`Dados recebidos: ${data}`);

        if (data === '"Pronto"') {
          setWhatsappConnected(true);
        } else {
          setQrCode(data); // base64
        }
      },
      onError: (err) => {
        console.error('Erro no SSE:', err);
      }
    });
  }

  // function obterQrCode(){
  //   const eventSource = new EventSource(process.env.NEXT_PUBLIC_URL_SERVER+"/admin/whatsapp/qr");
  //   eventSource.onmessage = (event) => {
  //     if(event.data.toString() === '"Pronto"'){
  //       setWhatsappConnected(true);
  //       return;
  //     }
  //     try{
  //       const imageBase64 = event.data;
  //       setQrCode(imageBase64);
  //     }
  //     catch(error){
  //       console.error('Erro: '+ error);
  //     }
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error('Erro: '+ error);
  //     eventSource.close();
  //   }

  //   return () => {
  //     eventSource.close();
  //   }
  // }

  function fetchEventSource(url: string, options){
    console.log("Chamou o obter qr code");
    fetch(process.env.NEXT_PUBLIC_URL_SERVER+"/admin/whatsapp/qr", { method: "GET", credentials: "include" })
      .then(async response => {
        // Verifica se a resposta foi ok e tem corpo (stream)
        if (!response.ok || !response.body) {
          // Se não, lança erro para cair no catch
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        // Obtém um leitor da stream de resposta (ReadableStreamDefaultReader)
        const reader = response.body.getReader();

        // Usamos TextDecoder para converter bytes em string UTF-8
        const decoder = new TextDecoder('utf-8');

        // Buffer para acumular os dados recebidos até formar linhas completas
        let buffer = '';

        // Loop infinito para ler dados da stream conforme chegam
        while (true) {
          // Lê o próximo chunk da stream (await porque é assíncrono)
          const { value, done } = await reader.read();

          // Se chegou ao fim da stream, sai do loop
          if (done) break;

          // Decodifica os bytes do chunk para string e adiciona no buffer
          buffer += decoder.decode(value, { stream: true });

          // Divide o buffer em linhas pelo caractere \n
          let lines = buffer.split('\n');

          // Remove a última linha do array e mantém no buffer (pode ser linha incompleta)
          buffer = lines.pop() || '';

          // Variáveis para armazenar o tipo do evento e os dados lidos
          let eventType = 'message';  // Padrão SSE: evento 'message'
          let data = '';

          // Itera por cada linha para interpretar o formato SSE
          for (const line of lines) {
            const trimmed = line.trim();  // Remove espaços no início/fim

            // Linha vazia indica final de um evento SSE
            if (trimmed === '') {
              // Se já temos dados acumulados, disparar callback onMessage
              if (data) {
                options.onMessage(data.trim(), eventType);
                data = '';          // Reseta dados para próximo evento
                eventType = 'message';  // Reseta tipo do evento
              }
              continue;  // Pula para próxima linha
            }

            // Linha que define o tipo do evento SSE (ex: event: custom)
            if (trimmed.startsWith('event:')) {
              eventType = trimmed.slice(6).trim();  // Extrai o valor depois de 'event:'
            }
            // Linha que adiciona dados ao evento SSE (pode ter múltiplas linhas data:)
            else if (trimmed.startsWith('data:')) {
              data += trimmed.slice(5).trim() + '\n';  // Acumula dados (inclui nova linha)
            }
            // Outras linhas ignoradas (podem ser comments ou outras diretivas SSE)
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
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