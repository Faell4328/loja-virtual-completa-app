/** @jsxImportSource @emotion/react */

import { Button, Form, Input, InputNumber, MenuProps, Modal, Radio, Select, Upload } from "antd";
import { contentFormStyle } from "../../styles/instalacao.style";
import { useRouter } from "next/navigation";
import { ApiProps } from "../../interface/returnApi";
import { consultApiService } from "../../service/consultApiService";
import { RcFile, UploadFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { UserProps } from "../../interface/user";
import { useStore } from "../../service/useStore";
import TextArea from "antd/es/input/TextArea";

interface FormDataProps{
  name: string;
  originalPrice: string;
  promotionPrice: string;
  categoryId: string;
  description?: string;
  homeSession: string;
  options: any;
  quantitys: string | string[];
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
  categorysApi: CategoryApiProps[];
  updateProductsOnSale: () => void;
  updateProductsInNew: () => void;
  updateFeaturedProducts: () => void;
}

export default function ModalCreateProduct({ modalOpen, setModalOpen, categorysApi, updateProductsOnSale, updateProductsInNew, updateFeaturedProducts }: TypeProps){
  const nav = useRouter();
  const [categorysSelect, setCategorySelect] = useState<{ value: string, label: string }[]>([]);
  const [formElement] = useForm();

  const userStore: UserProps | "OFF" | null = useStore((state) => state.userStore);

  useEffect(() => {
    if(userStore == null ||  userStore == "OFF"){
      return;
    }

    const categorys = categorysApi.map((category) => {
      return { value: category.id, label: category.name }
    });
    setCategorySelect(categorys);
  }, [categorysApi])

  async function formSubmit(data: FormDataProps){

    const form = new FormData();
    const { name, originalPrice, promotionPrice, categoryId, description, homeSession, options, quantitys } = formElement.getFieldsValue();

    (name) && form.append("name", name);
    (originalPrice) && form.append("originalPrice", originalPrice);
    if(promotionPrice == undefined){
      form.append("promotionPrice", "0");
    }
    else{
      form.append("promotionPrice", promotionPrice);
    }
    (categoryId) && form.append("categoryId", categoryId);
    (description) && form.append("description", description);
    (homeSession) && form.append("homeSession", homeSession);

    
    options.map((item) => {
      if(item.options){
        form.append("option", item.options);
      }
    })

    options.map((item) => {
      if(item.quantitys){
        form.append("quantity", item.quantitys);
      }
    })

    if(data.files){
      const files = data.files.fileList.map((file) => {
        return file.originFileObj;
      })
  
      files.forEach((file) => {
        form.append("files", file)
      });
    }

    const api: ApiProps | null = await consultApiService(nav, "POST", "/admin/produto", false, form);

    if(api !== null && api.ok !== undefined && api.error == undefined){
      formElement.resetFields();
    }

    if(homeSession == "PROMOTION"){
      updateProductsOnSale()
    }
    else if(homeSession == "NEW"){
      updateProductsInNew()
    }
    else if(homeSession == "HIGHLIGHTS"){
      updateFeaturedProducts()
    }

    return;
  }

  return(
    <>
      <Modal title="Adicionar Produto" open={modalOpen} onOk={ () => setModalOpen(false) } onCancel={ () => setModalOpen(false) } footer={[]} style={{ top: 20, display: "flex", justifyContent: "center" }}>
        <Form form={formElement} style={{ display: "flex", flexDirection: "column", margin: "auto", width: "85%" }} initialValues={{ options: [{ option: '', quantity: '' }] }} name="basic" layout="vertical" onFinish={(e) => formSubmit(e)}>
          <Form.Item label="Nome Produto:" name="name" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ marginTop: 30, width: "100%" }} css={ contentFormStyle}>
            <Input />
          </Form.Item>
          <Form.Item label="Valor:" name="originalPrice" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ width: "100%" }} css={ contentFormStyle}>
            <InputNumber type="number" controls={false} style={{ width: "100%" }} addonBefore="R$"/>
          </Form.Item>
          <Form.Item label="Valor promoção:" name="promotionPrice" style={{ width: "100%" }} css={ contentFormStyle}>
            <InputNumber type="number" controls={false} style={{ width: "100%" }} addonBefore="R$"/>
          </Form.Item>
          <Form.Item label="Categoria:" name="categoryId" rules={[{ required: true, message: "Campo obrigatório" }]} style={{ width: "100%" }} css={ contentFormStyle}>
            <Select options={categorysSelect} />
          </Form.Item>
          <Form.Item label="Descrição:" name="description" style={{ width: "100%" }} css={ contentFormStyle}>
            <TextArea />
          </Form.Item>
          <Form.Item label="Onde será exibido na página home" name="homeSession" rules={[{ required: true, message: "Campo obrigatório" }]}>
            <Radio.Group style={{ display: "flex", justifyContent: "space-between" }}>
              <Radio value="PROMOTION">Promoção</Radio>
              <Radio value="NEW">Novo</Radio>
              <Radio value="HIGHLIGHTS">Destaques</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <div style={{ width: "100%" }}>
                <h3 style={{ textAlign: 'center', padding: 0, marginTop: 0 }}>Opções</h3>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ border: '1px solid #eee', width: '100%', borderRadius: 20, padding: 20, boxSizing: 'border-box', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Form.Item {...restField} name={[name, 'options']} label="Opção" style={{ width: '45%' }}>
                        <Input />
                      </Form.Item>

                      <Form.Item {...restField} name={[name, 'quantitys']} label="Quantidade" style={{ width: '45%' }} >
                        <Input type="number" />
                      </Form.Item>
                    </div>

                    {
                      key!=0 && 
                      <Button onClick={() => remove(name)} style={{ width: "100%", marginTop: 10, backgroundColor: "#f44", color: "#fff" }}>
                        Remover essa opção
                      </Button>
                    }
                  </div>
                ))}

                <Form.Item>
                  <Button type="default" style={{ backgroundColor: "#777", color: "#fff" }} onClick={() => add()} block>
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