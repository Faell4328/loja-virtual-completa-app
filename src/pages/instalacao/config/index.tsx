/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import { Button, Form, Input, Spin, Upload } from 'antd';
import { UploadOutlined } from "@ant-design/icons";

import { containerFormStyle, formStyle, imageStyle, contentFormStyle, containerButtonStyle } from "../../../styles/instalacao.style";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import { consultApiService } from "../../../service/consultApiService";
import { bodyStyle } from "../../../styles/confirmacao.style";
import { LoadingOutlined } from '@ant-design/icons';

interface FormDataProps{
  name: string;
  file:{
    file: {
      originFileObj: RcFile;
    }
  }
}

export default function Config(){
  const nav = useRouter();
  
  const [robo, setRobo] = useState("/feliz_normal.png");
  const [selectImage, setSelectImage] = useState(false);
  const apiConsulted = useRef(false);

  useEffect(() => {
    async function consultApi(){
      const returnApi = await consultApiService(nav, "GET", "/", null);
      apiConsulted.current = true;
      if(returnApi?.redirect != "/instalacao/config"){
        nav.push("/");
        return;
      }
      return;
    }

    consultApi();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRobo(prev => {
        if(prev === "/feliz_normal.png"){
          setTimeout(() => {
            setRobo("/feliz_normal.png");
          }, 200);
          return "/feliz_normal_piscando.png";
        }
        return prev;
      });
    }, 4000);

    return() => {
      clearInterval(interval);
    }
  }, []);

  function formSubmit(data: FormDataProps){

    const form = new FormData();

    form.append("name", data.name);
    form.append("file", data.file.file.originFileObj);

    consultApiService(nav, "POST", "/instalacao/config", form);
    return;
  }

  function previewImage(file: RcFile){
    const reader = new FileReader();
    reader.onload = (event) => {
      if(event.target?.result){
        const base64: string = (event.target?.result).toString();
        if(base64 !== undefined || base64 !== null){
          setRobo(base64);
        }
      }
    }
    reader.readAsDataURL(file);
    return;
  }

  return(
    <>
      { apiConsulted.current == false ?
        (
          (
          <div style={{ height: "95vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin indicator={<LoadingOutlined spin style={{ fontSize: 70 }} />} />
          </div>
          )
        )
        :
        <div css={bodyStyle}>
          <div style={{ marginBottom: 30, height: "95vh" }}>
            <div css={containerFormStyle}>
              <Form css={formStyle} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
                <label style={selectImage ? { display: "block", textAlign: "center", marginBottom: 10} : { display: "none" }} >Preview da Logo</label>
                <Image width="200" height="200" alt="Imagem do mascote" css={imageStyle} src={robo} />
                <Form.Item label="Insira o nome da loja" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
                  <Input />
                </Form.Item>
                <Form.Item label="Insira a logo da loja" name="file" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
                  <Upload style={{ width: "100%" }} maxCount={1} multiple={ false } beforeUpload={ (file)=>{previewImage(file); setSelectImage(true);} } onRemove={ () => {setRobo("/feliz_normal.png"); setSelectImage(false)} }>
                    <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item css={containerButtonStyle}>
                  <Button style={{ width: 300, padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      }
    </>
  )
}