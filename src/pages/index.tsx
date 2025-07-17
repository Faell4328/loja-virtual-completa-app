import React, { useEffect, useState } from 'react';
import { useStore } from '../service/useStore';
import { UserProps } from '../interface/user';
import MenuHome from '../components/MenuHome';
import ProductsHome from '../components/userAndAdmin/ProductsHome';
import { consultApiService } from '../service/consultApiService';
import { useRouter } from 'next/navigation';

interface ProductProps{
  id: string;
  imagesProduct: [
    {
      imageUrl: string;
    }
  ];
  name: string;
  originalPrice: string;
  promotionPrice: string;
}

export default function Home() {
  const nav = useRouter();

  const userStore: UserProps | "OFF" | null = useStore((state) => state.userStore);

  const [ userState, setUserState ] = useState<UserProps | "OFF" | null >(userStore);

  const [ productsOnSale, setProductsOnSale ] = useState<ProductProps[] | null>(null);
  const [ productsInNew, setProductsInNew] = useState<ProductProps[] | null>(null);
  const [ featuredProducts, setFeaturedProducts] = useState<ProductProps[] | null>(null);

  async function getProductsOnSale(){
    const returnApi = await consultApiService(nav, "GET", "/produtos?session=promocao&page=1", null);
    const productsOnSaleApi: ProductProps[] = returnApi.data as ProductProps[];
    
    if(returnApi && returnApi.data !== undefined && productsOnSaleApi.length > 0){
      setProductsOnSale(productsOnSaleApi);
      return true;
    }
    return false;
  }

  async function getNewProducts(){
    const returnApi = await consultApiService(nav, "GET", "/produtos?session=novidade&page=1", null);
    const productsInNewApi: ProductProps[] = returnApi.data as ProductProps[];
    
    if(returnApi && returnApi.data !== undefined && productsInNewApi.length > 0){
      setProductsInNew(productsInNewApi);
      return true;
    }
    return false;
  }

  async function getFeaturedProducts(){
    const returnApi = await consultApiService(nav, "GET", "/produtos?session=destaque&page=1", null);
    const featuredProductsApi: ProductProps[] = returnApi.data as ProductProps[];
    
    if(returnApi && returnApi.data !== undefined && featuredProductsApi.length >0){
      setFeaturedProducts(featuredProductsApi);
      return true;
    }
    return false;
  }

  useEffect(() => {
    
    async function index(){
      getProductsOnSale();
      getNewProducts();
      getFeaturedProducts();
    }

    index();
  }, [])

  return(
      <>
        <MenuHome updateProductsOnSale={getProductsOnSale} updateProductsInNew={getNewProducts} updateFeaturedProducts={getFeaturedProducts} user={ userState } />
        <ProductsHome productsOnSale={productsOnSale} productsInNew={productsInNew} featuredProducts={featuredProducts} />
      </>
    )
};