import React, {useEffect, useState} from 'react';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { LoadingOutlined } from '@ant-design/icons';
import { useStore } from '../service/useStore';
import { UserProps } from '../interface/user';
import { consultApiService } from '../service/consultApiService';
import { ApiProps } from '../interface/returnApi';
import MenuHome from '../components/menuHome';
import ModalCreateCategory from '../components/modalCreateCategory';

export default function Home() {
  const nav = useRouter();
  const userStore: UserProps | "OFF" | null = useStore ((state) => state.userStore);
  const setUserStore = useStore((state) => state.setUserStore)

  const [ userState, setUserState ] = useState<UserProps | "OFF" | null >(userStore);

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
      {
        userState !== null &&
        <MenuHome user={ userState } />
      }
    </div>
    )
};