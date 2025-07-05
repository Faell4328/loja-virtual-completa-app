import { useRouter } from "next/navigation";
import { useRouter as useRouterParams } from "next/router";
import { useEffect } from "react"

import { consultApiService } from "@/service/consultApiService";
import { container } from "../confirmacao.style";

export default function ConfirmacaoEmail(){
  const nav = useRouter();
  const route = useRouterParams();
  const { hash } = route.query;


  useEffect(() => {
    async function consultApi(){
      consultApiService(nav, "PUT", `/confirmacao/${hash}`, null);
    }
    consultApi();
  }, [hash])
  return(
    <p>{hash}</p>
  )
}