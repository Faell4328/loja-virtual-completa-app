import { toast } from "react-toastify";
import { type NavigateFunction } from "react-router";
import api from "./api";

async function verifyApi(nav: NavigateFunction, response: any) {
    if(response.error){
        toast.error(response.error);
    }
    if(response.ok){
        toast.success(response.ok);
    }
    if(response.redirect){
        nav(response.redirect);
    }
}

export default async function consultApi(nav: NavigateFunction, method: 'get' | 'post' | 'put' | 'delete', url: string, conteudo: object | null = null) {
    try {
        if(method === 'get'){
            const response = await api.get(url, { withCredentials: true });
            await verifyApi(nav, response.data);
            return response.data;
        }
        else if(method === 'post'){
            const response = await api.post(url, conteudo, { headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true });
            await verifyApi(nav, response.data);
            return response.data;
        }
        else if(method === 'put'){
            const response = await api.put(url, conteudo, { headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true });
            await verifyApi(nav, response.data);
            return response.data;
        }
        else if(method === 'delete'){
            const response = await api.delete(url, { withCredentials: true } );
            await verifyApi(nav, response.data);
            return response.data;
        }
    }
    catch (error: any) {
        console.error('Erro na consultApi:', error);
        throw error;
    }
}