import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Spin } from 'antd';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { UserProps } from '../interface/user';
import { useStore } from '../service/useStore';
import { ApiProps } from '../interface/returnApi';
import { consultApiService } from '../service/consultApiService';
import { LoadingOutlined } from '@ant-design/icons';

export default function App ({ Component, pageProps }: AppProps){

  const nav = useRouter();
  const userStore: UserProps | "OFF" | null = useStore((state) => state.userStore);
  const setUserStore = useStore((state) => state.setUserStore)

  const [ userState, setUserState ] = useState<UserProps | "OFF" | null >(userStore);
  const apiConsulted = useRef<boolean | null>(false);

  useEffect(() => {

    if(userState == null){
      console.log("Consultou api")
      async function consultApi(){
        try{
          const api: ApiProps | null = await consultApiService(nav, "GET", "/", null);
          if(!api){
            apiConsulted.current = null;
            console.log("Erro ao consultar API (#2)");
            return;
          }
          
          if(api !== undefined && api !== null){
            apiConsulted.current = true;

            const user = api.data as unknown as UserProps;
            setUserState(user);
            setUserStore(user);
            console.log(user);
          }
        }
        catch(error){
          apiConsulted.current = null;
          console.log("Erro ao consultar API (#1) - ", error);
          return;
        }
      }
      consultApi();
    }
  }, [nav]);

  return(
    <>
    <Toaster position="bottom-center" reverseOrder={false} />
    <ConfigProvider>
      { apiConsulted.current == false ?
        (
          (
          <div style={{ height: "95vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin indicator={<LoadingOutlined spin style={{ fontSize: 70 }} />} />
          </div>
          )
        )
        :
        <Component {...pageProps} />
      }
    </ConfigProvider>
    </>
  );
};
