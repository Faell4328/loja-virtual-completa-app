/** @jsxImportSource @emotion/react */

import { useRouter } from "next/navigation";
import {  useEffect,useState } from "react"
import { Button, Form, Input } from 'antd';

import { containerFormStyle, formStyle, imageStyle, contentFormStyle, containerButtonStyle } from "../../../styles/instalacao.style";
import Image from "next/image";
import { consultApiService } from "../../../service/consultApiService";

interface FormDataProps{
  name: string;
  phone: string;
  email: string;
  password: string;
}

export default function Admin(){
  const nav = useRouter();

  const [robo, setRobo] = useState("/feliz_normal.png")

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

  function formSubmit(data: FormDataProps){

    const form = new FormData();

    form.append("name", data.name);
    form.append("phone", data.phone);
    form.append("email", data.email);
    form.append("password", data.password);

    consultApiService(nav, "POST", "/instalacao/admin", form);
    return;
  }

  return(
    <div css={containerFormStyle}>
      <Form css={formStyle} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
        <Image width="200" height="200" alt="Imagem do Mascote" css={imageStyle} src={robo} />
        <Form.Item label="Nome:" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle} >
          <Input />
        </Form.Item>
        <Form.Item label="Telefone:" name="phone" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
          <Input />
        </Form.Item>
        <Form.Item label="Email:" name="email" rules={[{ type: "email", message: "Email inválido"}, { required: true, message: "Campo obrigatório" }]} css={ contentFormStyle} >
          <Input />
        </Form.Item>
        <Form.Item label="Senha:" name="password" rules={[{ required: true, message: "Campo obrigatório" }]} css={ contentFormStyle }>
          <Input.Password type="primary" onFocus={ () => setRobo("/feliz_tampando_olho.png") } onBlur={ () => setRobo("/feliz_normal.png") }/>
        </Form.Item>
        <Form.Item css={containerButtonStyle}>
          <Button style={{ width: 300, padding: 20 }} type="primary" htmlType="submit">Enviar</Button>
        </Form.Item>
      </Form>
    </div>
  )
}