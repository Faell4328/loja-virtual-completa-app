/** @jsxImportSource @emotion/react */

import { Button, Form, Input, InputNumber, MenuProps, Modal, Select, Upload } from "antd";
import { contentFormStyle } from "../styles/instalacao.style";
import { useRouter } from "next/navigation";
import { ApiProps } from "../interface/returnApi";
import { consultApiService } from "../service/consultApiService";
import { RcFile, UploadFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface FormDataProps{
  name: string;
  originalPrice: string;
  promotionPrice: string;
  categoryId: string;
  description?: string;
  options: any;
  quantity: string | string[];
  files:{
    fileList: UploadFile<RcFile>[];
  }
}

interface CategoryApiProps{
  id: string;
  name: string;
}

interface TypeProps{
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  updateProductPage: () => void;
  categorysApi: CategoryApiProps[];
}

export default function ModalCreateProduct({ modalOpen, setModalOpen, updateProductPage, categorysApi }: TypeProps){
  const nav = useRouter();
  const [categorysSelect, setCategorySelect] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    const categorys = categorysApi.map((category) => {
      return { value: category.id, label: category.name }
    });
    setCategorySelect(categorys);
  }, [categorysApi])

  async function formSubmit(data: FormDataProps){

    console.log(data)

    const form = new FormData();

    form.append("name", data.name);
    form.append("originalPrice", data.originalPrice);
    if(data.promotionPrice == undefined){
      form.append("promotionPrice", "0");
    }
    else{
      form.append("promotionPrice", data.promotionPrice);
    }
    form.append("categoryId", data.categoryId);
    form.append("description", data.description);

    if(data.options && data.quantity){
      const option = data.options.map((item) => {
        return item.option;
      })
  
      const quantity = data.options.map((item) => {
        return item.quantity;
      })
      form.append("option", option);
      form.append("quantity", quantity);
    }

    if(data.files){
      const files = data.files.fileList.map((file) => {
        return file.originFileObj;
      })
  
      files.forEach((file) => {
        form.append("files", file)
      });
    }

    const api: ApiProps | null = await consultApiService(nav, "POST", "/admin/produto", form);

    if(api !== null && api.ok !== undefined && api.error == undefined){
      setModalOpen(false);
      updateProductPage();
    }

    return;
  }

  return(
    <>
      <Modal title="Adicionar Produto" open={modalOpen} onOk={ () => setModalOpen(false) } onCancel={ () => setModalOpen(false) } footer={[]} style={{ top: 20, display: "flex", justifyContent: "center" }}>
        <Form style={{ display: "flex", flexDirection: "column", margin: "auto", width: "85%" }} initialValues={{ options: [{ option: '', quantity: '' }] }} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
          <Form.Item label="Nome Produto:" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ marginTop: 30, width: "100%" }} css={ contentFormStyle}>
            <Input />
          </Form.Item>
          <Form.Item label="Valor:" name="originalPrice" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ width: "100%" }} css={ contentFormStyle}>
            <InputNumber style={{ width: "100%" }} addonBefore="R$"/>
          </Form.Item>
          <Form.Item label="Valor promoção:" name="promotionPrice" style={{ width: "100%" }} css={ contentFormStyle}>
            <InputNumber style={{ width: "100%" }} addonBefore="R$"/>
          </Form.Item>
          <Form.Item label="Categoria:" name="categoryId" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ width: "100%" }} css={ contentFormStyle}>
            <Select options={categorysSelect} />
          </Form.Item>
          <Form.Item label="Descrição:" name="description" style={{ width: "100%" }} css={ contentFormStyle}>
            <Input />
          </Form.Item>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <div style={{ width: "100%" }}>
                <h3 style={{ textAlign: 'center', padding: 0, marginTop: 0 }}>Opções</h3>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: '1px solid #eee',
                      width: '100%',
                      borderRadius: 20,
                      padding: 20,
                      boxSizing: 'border-box',
                      marginBottom: 20,
                    }}
                  >

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'option']}
                        label="Opção"
                        style={{ width: '45%' }}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        label="Quantidade"
                        style={{ width: '45%' }}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </div>

                    {
                      key!=0 && 
                      <Button
                        onClick={() => remove(name)}
                        style={{ width: "100%", marginTop: 10, backgroundColor: "#f44", color: "#fff" }}
                      >
                        Remover essa opção
                      </Button>
                    }
                  </div>
                ))}

                <Form.Item>
                  <Button type="primary" onClick={() => add()} block>
                    Adicionar mais opção
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
          <Form.Item label="Adicione imagem(s)" name="files" style={{ width: "100%" }} rules={[{ required: true, message: "Campo obrigatório (mínimo de uma imagem)" }]} css={ contentFormStyle }>
            <Upload style={{ width: "100%" }} listType="picture" multiple={ true }>
              <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button style={{ width: "100%", padding: 20 }} type="primary" htmlType="submit">Salvar Produto</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}