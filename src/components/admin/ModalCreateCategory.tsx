/** @jsxImportSource @emotion/react */

import { Button, Form, Input, Modal } from "antd";
import { contentFormStyle } from "../../styles/instalacao.style";
import { useRouter } from "next/navigation";
import { ApiProps } from "../../interface/returnApi";
import { consultApiService } from "../../service/consultApiService";
import { useForm } from "antd/es/form/Form";

interface FormDataProps{
  name: string;
}

export default function ModalCreateCategory({ modalOpen, setModalOpen, updateCategoryPage }){
  const nav = useRouter();
  const [formElement] = useForm();

  async function formSubmit(data: FormDataProps){

    const form = {
      "name": data.name
    }

    console.log(JSON.stringify(form));

    const api: ApiProps | null = await consultApiService(nav, "POST", "/admin/categoria", true, JSON.stringify(form));

    if(api !== null && api.ok !== undefined && api.error == undefined){
      formElement.resetFields();
      updateCategoryPage();
    }

    return;
  }

  return(
    <>
      <Modal title="Adicionar Categoria" open={modalOpen} onOk={ () => setModalOpen(false) } onCancel={ () => setModalOpen(false) } footer={[]}>
        <Form form={formElement} style={{ display: "flex", flexDirection: "column", alignItems: "center" }} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
          <Form.Item label="Nome Categoria:" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ marginTop: 30 }} css={ contentFormStyle}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button style={{ width: 300, padding: 20 }} type="primary" htmlType="submit">Salvar Categoria</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}