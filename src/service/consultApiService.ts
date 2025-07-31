import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import toast from 'react-hot-toast';

interface ReturnApiProps{
  redirect: string | null;
  error: string | null;
  ok: string | null;
  data: unknown | null;
}

export async function consultApiService(nav: AppRouterInstance, method: "GET" | "POST" | "PUT" | "DELETE", router: string, isJson: boolean, formData: any){
  let returnApi;

  const headers: HeadersInit = {};

  if(isJson == true){
    headers["Content-Type"] = "application/json";
  }

  const fetchConfig: RequestInit = {
    method,
    headers,
    credentials: "include"
  };

  if(formData !== null){
    fetchConfig.body = formData;
  }

  try{
    returnApi = await fetch(process.env.NEXT_PUBLIC_URL_SERVER+router, fetchConfig);
  }
  catch(error){
    toast.error("Erro ao consultar API (#1)");
    console.log("Erro ao consultar API");
    console.log(error);
    return null;
  }

  if(returnApi == undefined){
    toast.error("Erro ao consultar API (#2)");
    console.log("Erro ao consultar API");
    return null;
  }

  console.log(returnApi);
  const returnApiTrated: ReturnApiProps = await returnApi.json();
  console.log(returnApiTrated);

  if(returnApiTrated.ok != null){
    toast.success(returnApiTrated.ok);
  }
  else if(returnApiTrated.error != null){
    toast.error(returnApiTrated.error);
  }
  if(returnApiTrated.redirect != null){
    nav.push(returnApiTrated.redirect);
  }
  return returnApiTrated;
}