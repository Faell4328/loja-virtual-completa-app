import React, {useEffect} from 'react';
import { Button } from 'antd';
import { consultApiService } from '@/service/consultApiService';
import { useRouter } from 'next/navigation';


export default function Home() {
  const nav = useRouter();

  useEffect(() => {
    async function consultApi(){
      consultApiService(nav, "GET", "/", null);
    }
    consultApi();
  }, [])

  return(
    <div className="App">
      <Button type="primary">Button</Button>
    </div>
  )
};