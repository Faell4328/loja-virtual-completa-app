import { useRouter } from "next/navigation";
import { Card, Divider, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Image from "next/image";

import Meta from "antd/es/card/Meta";
import Link from "next/link";

import style from "./ProductsHome.module.css";
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
          <div style={{ WebkitTapHighlightColor: 'transparent' }} className={style.product_field}>
              {
                productsOnSale.map((product, indice) => (
                    <Card
                      key={indice}
                      hoverable
                      className={style.container_imagem}
                      onClick={() => nav.push(`/produto/${product.id}`)}
                      style={{ textAlign: "center", whiteSpace: "wrap", overflow: "visible" }}
                      cover={<img style={{ objectFit: "contain" }}alt="Imagem do produto" src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} />}
                      >
                        <Meta title={<span style={{ textAlign: "center", textWrap: "wrap" }}>{product.name}</span>} description={ product.promotionPrice !==0 ? <p style={{ color: "#090", textAlign: "center" }}>R$ {product.promotionPrice},00</p> : <p style={{ textAlign: "center" }}>R$ {product.originalPrice},00</p> } />
                    </Card>
                ))
              }
          </div>
          {
            productsOnSale.length == 5 &&
            <p style={{ textAlign: "center" }}>
              <Link href="#">Ver mais produtos</Link>
            </p>
          }
            <Divider />
        </div>
      }
      {
        productsInNew !== null &&
        <div>
          <h2 style={{ textAlign: "center" }}>Novidade</h2>
          <div style={{ WebkitTapHighlightColor: 'transparent' }} className={style.product_field}>
              {
                productsInNew.map((product, indice) => (
                    <Card
                      key={indice}
                      hoverable
                      className={style.container_imagem}
                      onClick={() => nav.push(`/produto/${product.id}`)}
                      style={{ textAlign: "center", whiteSpace: "wrap", overflow: "visible" }}
                      cover={<img style={{ objectFit: "contain" }}alt="Imagem do produto" src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} />}
                      >
                        <Meta title={<span style={{ textAlign: "center", textWrap: "wrap" }}>{product.name}</span>} description={ product.promotionPrice !==0 ? <p style={{ color: "#090", textAlign: "center" }}>R$ {product.promotionPrice},00</p> : <p style={{ textAlign: "center" }}>R$ {product.originalPrice},00</p> } />
                    </Card>
                ))
              }
          </div>
          {
            productsInNew.length == 5 &&
            <p style={{ textAlign: "center" }}>
              <Link href="#">Ver mais produtos</Link>
            </p>
          }
            <Divider />
        </div>
      }
      {
        featuredProducts !== null &&
        <div>
          <h2 style={{ textAlign: "center" }}>Destaque</h2>
          <div style={{ WebkitTapHighlightColor: 'transparent' }} className={style.product_field}>
              {
                featuredProducts.map((product, indice) => (
                    <Card
                      key={indice}
                      hoverable
                      className={style.container_imagem}
                      onClick={() => nav.push(`/produto/${product.id}`)}
                      style={{ textAlign: "center", whiteSpace: "wrap", overflow: "visible" }}
                      cover={<img style={{ objectFit: "contain" }}alt="Imagem do produto" src={process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[0].imageUrl} />}
                      >
                        <Meta title={<span style={{ textAlign: "center", textWrap: "wrap" }}>{product.name}</span>} description={ product.promotionPrice !==0 ? <p style={{ color: "#090", textAlign: "center" }}>R$ {product.promotionPrice},00</p> : <p style={{ textAlign: "center" }}>R$ {product.originalPrice},00</p> } />
                    </Card>
                ))
              }
          </div>
          {
            featuredProducts.length == 5 &&
            <p style={{ textAlign: "center" }}>
              <Link href="#">Ver mais produtos</Link>
            </p>
          }
            <Divider />
        </div>
      }
      {
        productsOnSale == null && productsInNew == null && featuredProducts == null &&
        <div style={{ height: "70vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 70 }} />} />
        </div>
      }
    </div>
  )
}