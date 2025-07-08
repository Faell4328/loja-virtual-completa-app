import React, {useEffect, useState} from 'react';
import { AutoComplete, AutoCompleteProps, Button, Input, Menu, MenuProps, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { AppstoreOutlined, LoadingOutlined, MailOutlined, SearchOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useStore } from '../service/useStore';
import { UserProps } from '../interface/user';
import { consultApiService } from '../service/consultApiService';
import { ApiProps } from '../interface/returnApi';

type MenuItem = Required<MenuProps>["items"][number];

interface ProductsProps{
  id: string;
  name: string;
  price: string;
  originalPrice: number,
  promotionPrice: number,
  imagesProduct: [{ imagemUrl: string }]
}


export default function Home() {
  const nav = useRouter();
  const userStore: UserProps | "OFF" | null = useStore ((state) => state.userStore);
  const setUserStore = useStore((state) => state.setUserStore)

  const [ userState, setUserState ] = useState<UserProps | "OFF" | null >(userStore);
  const [ menuItemsCategoryState, setMenuItemsCategoryState ] = useState<MenuItem[]>([]);
  const [ menuItemsSeachState, setMenuItemsSeachState ] = useState<AutoCompleteProps['options']>([]);
  const [ menuItemsUserState, setMenuItemsUserState ] = useState<MenuItem[]>([]);

  useEffect(() => {
    if(userState == undefined && userState == null){
      return;
    }

    async function getInformationCategory(){
      const dataCategories = await consultApiService(nav, "GET", "/categorias", null);
      
      if(dataCategories?.data){
        const category: { id: string, name: string }[] = dataCategories.data as unknown as { id: string, name: string }[];
        const menuCategory = category.map((item) => {
          return { label: (<Link href={`/categoria/${item.id}`}>{item.name}</Link>), key: item.id }
        });

        const menuItems: MenuItem[] = [
          {
            label: (<Link href="/categorias">Categorias</Link>), key: "menu-categorys", children:[
              { type: "group", label: "categorias" , children: menuCategory}
            ]
          }
        ];
        
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
      if(userState == "OFF"){
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
      else if(userState?.role == "USER"){
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
      else if(userState?.role == "ADMIN"){
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

    async function index(){
      getInformationCategory();
      menuSearchField();
      menuAccountField();
    }

    index();

  }, [userState])

  useEffect(() => {

    if(userState == null){
      console.log("Consultou api")
      async function consultApi(){
        try{
          const api: ApiProps | null = await consultApiService(nav, "GET", "/", null);
          if(!api){
            console.log("Erro ao consultar API (#2)");
            return;
          }
  
          
          if(api !== undefined && api !== null){
            const user = api.data as unknown as UserProps;
            setUserState(user);
            setUserStore(user);
            console.log(user);
          }
        }
        catch(error){
          console.log("Erro ao consultar API (#1) - ", error);
          return;
        }
      }
      consultApi();
    }
  }, [nav]);

  return(
    <div>
      { userState == null &&
        (
          (
          <div style={{ height: "95vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin indicator={<LoadingOutlined spin style={{ fontSize: 70 }} />} />
          </div>
          )
        )
      }
      { userState !== null && userState == "OFF" &&
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
      { userState !== null && userState !== "OFF" && userState?.role == "USER" &&
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
      { userState !== null && userState !== "OFF" && userState?.role == "ADMIN" &&
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
            <p>Sua role é Admin</p>
          </div>
        )
      }
    </div>
    )
};