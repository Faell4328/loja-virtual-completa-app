import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Image from "next/image";

import style from "./ProductsHome.module.css";
import Link from "next/link";

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

export default function ProductsHome({ productsOnSale, productsInNew, featuredProducts } ){
  const nav = useRouter();

  return(
    <div>
      {
        productsOnSale !== null &&
        <div>
          <h2 style={{ textAlign: "center" }}>Promoção</h2>
          <div className={style.product_field}>
              {
                productsOnSale?.map((product, indice) => (
                  <div key={indice} style={{  display: "flex", flexDirection: "column", alignItems: "center", padding: 10, margin: 10, border: "1px solid #eee", borderRadius: 20 }}>
                    <div className={style.container_imagem} onClick={() => nav.push(`/produto/${product.id}`)}>
                      <Image fill={true} style={{ objectFit: "contain", marginRight: 20,  borderRadius: 20 }} alt="Imagem do produto" src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} />
                    </div>
                    <h4 key={indice} style={{ textAlign: "center" }}>{product.name}</h4>
                    { product.promotionPrice !==0 ? <p style={{ color: "#090" }}>R$ {product.promotionPrice},00</p> : <p>R$ {product.originalPrice},00</p> }
                  </div>
                ))
              }
          </div>
        </div>
      }


      
      {
        productsInNew !== null &&
        <div>
          <h2 style={{ textAlign: "center" }}>Novidade</h2>
          <div className={style.product_field}>
              {
                  productsInNew?.map((product, indice) => (
                  <div key={indice} style={{  display: "flex", flexDirection: "column", alignItems: "center", padding: 10, margin: 10, border: "1px solid #eee", borderRadius: 20 }}>
                    <div className={style.container_imagem} onClick={() => nav.push(`/produto/${product.id}`)}>
                      <Image fill={true} style={{ objectFit: "contain", marginRight: 20,  borderRadius: 20 }} alt="Imagem do produto" src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} />
                    </div>
                    <h4 key={indice} style={{ textAlign: "center" }}>{product.name}</h4>
                    { product.promotionPrice !==0 ? <p style={{ color: "#090" }}>R$ {product.promotionPrice},00</p> : <p>R$ {product.originalPrice},00</p> }
                  </div>
                  ))
              }
          </div>
        </div>
        }



      {
        featuredProducts !== null &&
        <div>
          <h2 style={{ textAlign: "center" }}>Destaque</h2>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", borderBottom: "1px solid #999" }}>
              {
                featuredProducts?.map((product, indice) => (
                  <div key={indice} style={{  display: "flex", flexDirection: "column", alignItems: "center", padding: 10, margin: 10, border: "1px solid #eee", borderRadius: 20 }}>
                    <div className={style.container_imagem} onClick={() => nav.push(`/produto/${product.id}`)}>
                      <Image fill={true} style={{ objectFit: "contain", marginRight: 20,  borderRadius: 20 }} alt="Imagem do produto" src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} />
                    </div>
                    <h4 key={indice} style={{ textAlign: "center" }}>{product.name}</h4>
                    { product.promotionPrice !==0 ? <p style={{ color: "#090" }}>R$ {product.promotionPrice},00</p> : <p>R$ {product.originalPrice},00</p> }
                  </div>
                ))
            }
          </div>
        </div>
        }
        {
          productsOnSale == null || productsInNew == null || featuredProducts == null &&
          <div style={{ height: "70vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin indicator={<LoadingOutlined spin style={{ fontSize: 70 }} />} />
          </div>
        }
    </div>
  )
}