import { AutoComplete, AutoCompleteProps, Button, Menu, MenuProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { consultApiService } from "../service/consultApiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import ModalCreateProduct from "./admin/ModalCreateProduct";
import ModalCreateCategory from "./admin/ModalCreateCategory";
import Image from "next/image";
import ModalInformationUser from "./userAndAdmin/ModalInformationUser";
import { useStore } from "../service/useStore";
import ModalWhatsapp from "./admin/ModalWhatsapp";
import toast from "react-hot-toast";

import style from "./MenuHome.module.css"

type MenuItem = Required<MenuProps>["items"][number];

interface ProductsProps{
  id: string;
  name: string;
  price: string;
  originalPrice: number,
  promotionPrice: number,
  imagesProduct: {
    imagemUrl: string[]
  }
}

interface CategoryApiProps{
  id: string;
  name: string;
}

export default function MenuHome({ user, updateProductsOnSale, updateProductsInNew, updateFeaturedProducts }){
  const nav = useRouter();
  const categoryApi = useRef<CategoryApiProps[]>([]);
  const setUserStore = useStore((state) => state.setUserStore)

  const [ modalOpenCreateCategory, setModalOpenCreateCategory ] = useState(false);
  const [ modalOpenCreateProduct, setModalOpenCreateProduct ] = useState(false);
  const [ modalOpenWhatsapp, setModalOpenWhatsapp ] = useState(false);
  const [ modalOpenInformationUser, setModalOpenInformationUser ] = useState(false);

  const [ menuItemsCategoryState, setMenuItemsCategoryState ] = useState<MenuItem[]>([]);
  const [ menuItemsSeachState, setMenuItemsSeachState ] = useState<AutoCompleteProps['options']>([]);
  const [ menuItemsUserState, setMenuItemsUserState ] = useState<MenuItem[]>([]);

  const valueAutoCompleteSelected = useRef<{key: string; value: string} | null>(null)
  const valueAutoCompleteTyped = useRef<string>("");
  const [ openAutoComplete, setOpenAutoComplete ] = useState(false);

  async function getInformationCategory(){
    const dataCategories = await consultApiService(nav, "GET", "/categorias", null, null);
    
    if(dataCategories?.data){
      categoryApi.current = dataCategories.data as unknown as CategoryApiProps[];
      const menuCategory = categoryApi.current.map((item, indice) => {
        return { label: (<Link key={indice} href={`/categoria/${item.id}`}>{item.name}</Link>), key: item.id }
      });

      let menuItems: MenuItem[] = [];

      menuItems = [
        {
          label: "Categorias", key: "menu-categorys", children:[
            { type: "group", label: "Categorias" , children: menuCategory}
          ]
        }
      ];

      setMenuItemsCategoryState(menuItems);
    }
  }
  
  async function menuAccountField(){
    if(user == "OFF"){
      const menuItems: MenuItem[] = [
        {
          label: "", key: "menu-account" , icon: <UserOutlined />, children:[
            { type: "group", label: "Conta" , children: [
              { label: (<Link href="/login">Acessar</Link>), key:"1" },
              { label: (<Link href="/cadastrar">Cadastrar</Link>), key:"2" }
            ]}
          ]
        }
      ];
      setMenuItemsUserState(menuItems);
    }
    else if(user?.role == "USER"){
      const menuItems: MenuItem[] = [
        {
          label: "", key: "menu-account", icon: <UserOutlined />, children:[
            { type: "group", label: "Informações" , children: [
              { label: (<div onClick={ () => { setModalOpenInformationUser(true) } }>Alterar Informações Pessoais</div>), key:"1" },
            ]},
            { type: "group", label: "Conta" , children: [
              { label: (<div onClick={ () => { consultApiService(nav, "DELETE", "/deslogar", null, null); setUserStore(null); nav.refresh() } }>Deslogar</div>), key:"2" },
            ]}
          ]
        }
      ];
      setMenuItemsUserState(menuItems);
    }
    else if(user?.role == "ADMIN"){
      const menuItems: MenuItem[] = [
        {
          label: "Conta", key: "menu-account", icon: <UserOutlined />, children:[
            { type: "group", label: "Admin" , children: [
              {
                label: (<div onClick={() => setModalOpenCreateCategory(true)}>Adicionar Categoria</div>), key: "add-category"
              },
              {
                label: (<div onClick={() => setModalOpenCreateProduct(true)}>Adicionar Produto</div>), key: "add-product"
              },
              {
                label: (<div onClick={() => setModalOpenWhatsapp(true)}>WhatsApp</div>), key: "whatsapp"
              },
            ]},
            { type: "group", label: "Informações" , children: [
              { label: (<div onClick={ () => { setModalOpenInformationUser(true) } }>Alterar Informações Pessoais</div>), key:"1" },
            ]},
            { type: "group", label: "Conta" , children: [
              { label: (<div onClick={ () => { consultApiService(nav, "DELETE", "/deslogar", null, null); setUserStore(null); nav.refresh() } }>Deslogar</div>), key:"1" },
            ]}
          ]
        }
      ];
      setMenuItemsUserState(menuItems);
    }
  }

  useEffect(() => {
    if(user == undefined && user == null){
      return;
    }
  
    async function index(){
      getInformationCategory();
      menuAccountField();
    }
  
    index();
  
  }, []);

  async function productSearch(inputValue: string){
    console.log(inputValue);
    const returnApi = await consultApiService(nav, "GET", `/produto/procurar/${inputValue}`, null, null);
    
    if(returnApi && returnApi?.data){
      let products = returnApi.data as unknown as ProductsProps[];
      if(products.length > 0){
        let productsSearch: AutoCompleteProps['options'] = products.map((product, indice) => {
          return { key: product.id, label: (<div style={{ display: "flex", alignItems: "center" }} key={product.name}><Image src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} alt="Imagem do produto" width={50} height={50} style={{ objectFit: "contain", marginRight: 20 }}/><span style={{ overflowWrap: "break-word", whiteSpace: "normal" }}>{product.name}</span></div>), value: product.name }
        })
        setMenuItemsSeachState(productsSearch);
      }
    }
  }

  return(
    <div>
      { user == "OFF" &&
        (
          <div>
            <div style={{ display: "flex", justifyContent: "space", width: "100%", borderBottom: "1px solid #eee" }}>
              <div className={style.menu_category}></div>
              <div style={{ width: "45%", display: "flex", justifyContent: "center" }}>
                <AutoComplete
                  placeholder="Procurar produto"
                  open={openAutoComplete}
                  options={menuItemsSeachState}
                  onSearch={
                    (value) => {
                      if(value!=""){
                        valueAutoCompleteTyped.current = value;
                        valueAutoCompleteSelected.current = null;
                        setOpenAutoComplete(true);
                        productSearch(value);
                      }
                      else{
                        valueAutoCompleteTyped.current = value;
                        valueAutoCompleteSelected.current = null;
                        setOpenAutoComplete(false)}
                      }
                    }
                  onClick={() => valueAutoCompleteTyped.current !== "" && setOpenAutoComplete(true)}
                  onBlur={() => setOpenAutoComplete(false)}
                  onSelect={(value, option: { key: string; value: string }) => { valueAutoCompleteSelected.current = option}}
                  style={{ width: "90%", height: "80%"}}/>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => { (valueAutoCompleteSelected.current == null) ? toast.error("Selecione algum produto antes de pesquisar") : nav.push(`/produto/${valueAutoCompleteSelected.current.key}`) }} style={{ height: "80%" }} />
              </div>
              <Menu mode="horizontal" items={menuItemsUserState} selectable={false} style={{ width: "20%", display: "flex", justifyContent: "center", border: 0 }}/>
            </div>
          </div>
        )
      }
      { user?.role == "USER" &&
        (
          <div>
            <div style={{ display: "flex", justifyContent: "space", width: "100%", borderBottom: "1px solid #eee" }}>
              <div className={style.menu_category}></div>
              <div style={{ width: "45%", display: "flex", justifyContent: "center" }}>
                <AutoComplete
                  placeholder="Procurar produto"
                  open={openAutoComplete}
                  options={menuItemsSeachState}
                  onSearch={
                    (value) => {
                      if(value!=""){
                        valueAutoCompleteTyped.current = value;
                        valueAutoCompleteSelected.current = null;
                        setOpenAutoComplete(true);
                        productSearch(value);
                      }
                      else{
                        valueAutoCompleteTyped.current = value;
                        valueAutoCompleteSelected.current = null;
                        setOpenAutoComplete(false)}
                      }
                    }
                  onClick={() => valueAutoCompleteTyped.current !== "" && setOpenAutoComplete(true)}
                  onBlur={() => setOpenAutoComplete(false)}
                  onSelect={(value, option: { key: string; value: string }) => { valueAutoCompleteSelected.current = option}}
                  style={{ width: "90%", height: "80%"}}/>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => { (valueAutoCompleteSelected.current == null) ? toast.error("Selecione algum produto antes de pesquisar") : nav.push(`/produto/${valueAutoCompleteSelected.current.key}`) }} style={{ height: "80%" }} />
              </div>
              <Menu mode="horizontal" items={menuItemsUserState} selectable={false} style={{ width: "20%", display: "flex", justifyContent: "center", border: 0 }}/>
            </div>
          </div>
        )
      }
      { user?.role == "ADMIN" &&
        (
          <div>
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", borderBottom: "1px solid #eee" }}>
              <div className={style.menu_category}></div>
              <div className={style.menu_search} >
                <AutoComplete
                  placeholder="Procurar produto"
                  open={openAutoComplete}
                  options={menuItemsSeachState}
                  onSearch={
                    (value) => {
                      if(value!=""){
                        valueAutoCompleteTyped.current = value;
                        valueAutoCompleteSelected.current = null;
                        setOpenAutoComplete(true);
                        productSearch(value);
                      }
                      else{
                        valueAutoCompleteTyped.current = value;
                        valueAutoCompleteSelected.current = null;
                        setOpenAutoComplete(false)}
                      }
                    }
                  onClick={() => valueAutoCompleteTyped.current !== "" && setOpenAutoComplete(true)}
                  onBlur={() => setOpenAutoComplete(false)}
                  onSelect={(value, option: { key: string; value: string }) => { valueAutoCompleteSelected.current = option}}
                  style={{ width: "90%", height: "80%"}}/>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => { (valueAutoCompleteSelected.current == null) ? toast.error("Selecione algum produto antes de pesquisar") : nav.push(`/produto/${valueAutoCompleteSelected.current.key}`) }} style={{ height: "80%" }} />
              </div>
              <Menu mode="horizontal" items={menuItemsUserState} selectable={false} style={{ width: "25%", display: "flex", justifyContent: "center", border: 0 }}/>
            </div>
          </div>
        )
      }
      <ModalCreateCategory modalOpen={modalOpenCreateCategory} setModalOpen={setModalOpenCreateCategory} updateCategoryPage={getInformationCategory} />
      <ModalCreateProduct modalOpen={modalOpenCreateProduct} setModalOpen={setModalOpenCreateProduct} categorysApi={categoryApi.current} updateProductsOnSale={updateProductsOnSale} updateProductsInNew={updateProductsInNew} updateFeaturedProducts={updateFeaturedProducts} />
      <ModalWhatsapp modalOpen={modalOpenWhatsapp} setModalOpen={setModalOpenWhatsapp} />
      <ModalInformationUser modalOpen={modalOpenInformationUser} setModalOpen={setModalOpenInformationUser} />
    </div>
  )
}