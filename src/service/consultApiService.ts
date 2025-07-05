import toast from 'react-hot-toast';

interface ReturnApiProps{
  redirect: string | null;
  error: string | null;
  ok: string | null;
  data: any | null;
}

export async function consultApiService(nav: any, method: "GET" | "POST" | "PUT" | "DELETE", router: string, formData: FormData | null){
  let returnApi;
  try{
    returnApi = await fetch(process.env.NEXT_PUBLIC_URL_SERVER+router,
      {
        method,
        body: formData,
        credentials: "include"
      }
    );
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
    console.log("Entrou no sucesso");
  }
  if(returnApiTrated.error != null){
    toast.error(returnApiTrated.error);
  }
  if(returnApiTrated.redirect != null){
    nav.push(returnApiTrated.redirect);
  }
  if(returnApiTrated.data != null){
    return returnApiTrated;
  }
}