import { AutoComplete, AutoCompleteProps, Button, Menu, MenuProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { consultApiService } from "../service/consultApiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import ModalCreateCategory from "./modalCreateCategory";
import ModalCreateProduct from "./modalCreateProduct";

type MenuItem = Required<MenuProps>["items"][number];

interface ProductsProps{
  id: string;
  name: string;
  price: string;
  originalPrice: number,
  promotionPrice: number,
  imagesProduct: [{ imagemUrl: string }]
}

interface CategoryApiProps{
  id: string;
  name: string;
}

export default function MenuHome({ user }){
  const nav = useRouter();
  const categoryApi = useRef<CategoryApiProps[]>([]);

  const [modalOpenCreateCategory, setModalOpenCreateCategory] = useState(false);
  const [modalOpenCreateProduct, setModalOpenCreateProduct] = useState(false);

  const [ menuItemsCategoryState, setMenuItemsCategoryState ] = useState<MenuItem[]>([]);
  const [ menuItemsSeachState, setMenuItemsSeachState ] = useState<AutoCompleteProps['options']>([]);
  const [ menuItemsUserState, setMenuItemsUserState ] = useState<MenuItem[]>([]);

  async function getInformationCategory(){
    const dataCategories = await consultApiService(nav, "GET", "/categorias", null);
    
    if(dataCategories?.data){
      categoryApi.current = dataCategories.data as unknown as CategoryApiProps[];
      const menuCategory = categoryApi.current.map((item) => {
        return { label: (<Link href={`/categoria/${item.id}`}>{item.name}</Link>), key: item.id }
      });

      let menuItems: MenuItem[] = [];

      if(user.role == "ADMIN"){
        menuItems = [
          {
            label: "Categorias", key: "menu-categorys", children:[
              { type: "group", label: "Admin" , children: [
                {
                  label: (<div onClick={() => setModalOpenCreateCategory(true)}>Adicionar Categoria</div>), key: "add-category"
                },
                {
                  label: (<div onClick={() => setModalOpenCreateProduct(true)}>Adicionar Produto</div>), key: "add-product"
                },
              ]},
              { type: "group", label: "Categorias" , children: menuCategory}
            ]
          }
        ];
      }
      else{
        menuItems = [
          {
            label: "Categorias", key: "menu-categorys", children:[
              { type: "group", label: "categorias" , children: menuCategory}
            ]
          }
        ];
      }

      setMenuItemsCategoryState(menuItems);
    }
    else{
      let menuItems: MenuItem[] = [];
      if(user.role == "ADMIN"){
        menuItems = [
          {
            label: (<Link href="/categorias">Categorias</Link>), key: "menu-categorys", children:[
              { type: "group", label: "Admin" , children: [
                {
                  label: (<div onClick={() => setModalOpenCreateCategory(true)}>Adicionar Categoria</div>), key: "add-category"
                },
                {
                  label: (<div onClick={() => setModalOpenCreateProduct(true)}>Adicionar Produto</div>), key: "add-product"
                },
              ]}
            ]
          }
        ];
      }
      setMenuItemsCategoryState(menuItems);
    }
  }

  async function menuSearchField(){
    const returnApi = await consultApiService(nav, "GET", "/produtos", null);
    
    if(returnApi && returnApi?.data){
      let products = returnApi.data as unknown as ProductsProps[];
      if(products.length > 0){
        let productsSearch: AutoCompleteProps['options'] = products.map((product) => {
          return { key: product.id, label: product.name, value: product.name }
        })
        setMenuItemsSeachState(productsSearch);
      }
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
            { type: "group", label: "Conta" , children: [
              { label: (<div onClick={ () => { consultApiService(nav, "PUT", "/deslogar", null); nav.refresh() } }>Deslogar</div>), key:"1" },
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
            { type: "group", label: "Conta" , children: [
              { label: (<div onClick={ () => { consultApiService(nav, "PUT", "/deslogar", null); nav.refresh() } }>Deslogar</div>), key:"1" },
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
      menuSearchField();
      menuAccountField();
    }
  
    index();
  
  }, []);

  return(
    <div>
      { user == "OFF" &&
        (
          <div>
            <div style={{ display: "flex", justifyContent: "space", width: "100%", borderBottom: "1px solid #eee" }}>
              <Menu mode="horizontal" items={menuItemsCategoryState} style={{ width: "30%", display: "flex", justifyContent: "center", border: 0 }}/>
              <div style={{ width: "50%", display: "flex", justifyContent: "center" }}>
                <AutoComplete placeholder="Procurar produto" options={menuItemsSeachState} onSelect={() => {return "teste"}} filterOption={(inputValue, option) => { const label = option?.label;  if (typeof label === 'string') {return label.toLowerCase().includes(inputValue.toLowerCase());}return false;}}  style={{ width: "90%", height: "80%"}}/>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => console.log("Clicou para pesquisar")} style={{ height: "80%" }} />
              </div>
              <Menu mode="horizontal" items={menuItemsUserState} style={{ width: "20%", display: "flex", justifyContent: "center", border: 0 }}/>
            </div>
            <p>Sua role é OFF</p>
          </div>
        )
      }
      { user?.role == "USER" &&
        (
          <div>
            <div style={{ display: "flex", justifyContent: "space", width: "100%", borderBottom: "1px solid #eee" }}>
              <Menu mode="horizontal" items={menuItemsCategoryState} style={{ width: "30%", display: "flex", justifyContent: "center", border: 0 }}/>
              <div style={{ width: "50%", display: "flex", justifyContent: "center" }}>
                <AutoComplete placeholder="Procurar produto" options={menuItemsSeachState} onSelect={() => {return "teste"}} filterOption={(inputValue, option) => { const label = option?.label;  if (typeof label === 'string') {return label.toLowerCase().includes(inputValue.toLowerCase());}return false;}}  style={{ width: "90%", height: "80%"}}/>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => console.log("Clicou para pesquisar")} style={{ height: "80%" }} />
              </div>
              <Menu mode="horizontal" items={menuItemsUserState} style={{ width: "20%", display: "flex", justifyContent: "center", border: 0 }}/>
            </div>
            <p>Sua role é User</p>
          </div>
        )
      }
      { user?.role == "ADMIN" &&
        (
          <div>
            <div style={{ display: "flex", justifyContent: "space", width: "100%", borderBottom: "1px solid #eee" }}>
              <Menu mode="horizontal" items={menuItemsCategoryState} style={{ width: "30%", display: "flex", justifyContent: "center", border: 0 }}/>
              <div style={{ width: "45%", display: "flex", justifyContent: "center" }}>
                <AutoComplete placeholder="Procurar produto" options={menuItemsSeachState} onSelect={() => {return "teste"}} filterOption={(inputValue, option) => { const label = option?.label;  if (typeof label === 'string') {return label.toLowerCase().includes(inputValue.toLowerCase());}return false;}}  style={{ width: "90%", height: "80%"}}/>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => console.log("Clicou para pesquisar")} style={{ height: "80%" }} />
              </div>
              <Menu mode="horizontal" items={menuItemsUserState} style={{ width: "25%", display: "flex", justifyContent: "center", border: 0 }}/>
            </div>
            <p>Sua role é Admin</p>
          </div>
        )
      }
    <ModalCreateCategory modalOpen={modalOpenCreateCategory} setModalOpen={setModalOpenCreateCategory} updateCategoryPage={getInformationCategory} />
    <ModalCreateProduct modalOpen={modalOpenCreateProduct} setModalOpen={setModalOpenCreateProduct} updateProductPage={menuSearchField} categorysApi={categoryApi.current} />
    </div>
  )
}