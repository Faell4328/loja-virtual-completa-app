/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react"
import { Button, Form, Input, Upload } from 'antd';
import { UploadOutlined } from "@ant-design/icons";

import  { consultApiService } from "@/service/consultApiService";
import { containerFormStyle, formStyle, imageStyle, contentFormStyle } from "./instalacao.style";
import { RcFile } from "antd/es/upload";

export default function Config(){
  const nav = useRouter();

  const [robo, setRobo] = useState("/feliz_normal.png");
  const [selectImage, setSelectImage] = useState(false);

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
  }, [])

  function formSubmit(data: any){

    const form = new FormData();

    form.append("name", data.name as string)
    form.append("file", data.file.file.originFileObj)

    consultApiService(nav, "POST", "/instalacao/config", form);
    return;
  }

  function previewImage(file: RcFile){
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const base64: any = event.target?.result;
      setRobo(base64);
    }

    reader.readAsDataURL(file);
    return;
  }

  return(
    <div css={containerFormStyle}>
      <Form css={formStyle} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
        <label style={selectImage ? { display: "block", textAlign: "center", marginBottom: 30} : { display: "none" }} >Preview</label>
        <img css={imageStyle} src={robo} />
        <Form.Item label="Insira o nome da loja" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
          <Input />
        </Form.Item>
        <Form.Item label="Insira a logo da loja" name="file" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
          <Upload style={{ width: "100%" }} maxCount={1} multiple={ false } beforeUpload={ (file)=>{previewImage(file); setSelectImage(true);} } onRemove={ () => {setRobo("/feliz_normal.png"); setSelectImage(false)} }>
            <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item css={ containerFormStyle }>
          <Button style={{ width: 300, padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
        </Form.Item>
      </Form>
    </div>
  )
}