import { useRouter } from 'next/navigation';
import { useRouter as useRouterParams } from "next/router";
import { useEffect, useState } from "react";
import { consultApiService } from "../../../service/consultApiService";
import { LoadingOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Carousel, Image as AntdImage, Space, Spin, Form, Radio, Button } from 'antd';

import style from './index.module.css';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/pagination'

interface ProductProps{
  name: string;
  originalPrice: number;
  promotionPrice?: number;
  category: {
    id: string;
    name: string;
  };
  description?: string;
  option?: {
      id: string;
      option: string;
      quantity: number;
    }[];
  imagesProduct: {
      id: string;
      imageUrl: string;
    }[];
}

export default function Product(){
  const nav = useRouter();
  const route = useRouterParams();
  const { id } = route.query;
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  
  const [infoProduct, setInfoProduct] = useState<ProductProps | null>(null);
  const [imagesProduct, setImagesProduct] = useState<string[] | null>(null);

  useEffect(() => {
    async function consultApi(){
      try{
        const returnApi = await consultApiService(nav, "GET", `/produto/${id}`, null);

        if(returnApi ==null && returnApi.data == undefined){
          console.error("Erro ao consultar API #2");
          return;
        }

        const product: ProductProps = returnApi.data as ProductProps;
        let images = [];
        for(var cont=0; cont < product.imagesProduct.length; cont++){
          images.push(process.env.NEXT_PUBLIC_URL_SERVER+"/files/product/"+product.imagesProduct[cont].imageUrl);
        }
        setImagesProduct(images);
        setInfoProduct(product);
      }
      catch(error){
        console.error("Erro ao consultar API #1");
        return;
      }
    }
    if(nav && id){
      consultApi();
    }
  }, [nav, id]);

  return(
    <Form>
      {
        infoProduct !== null &&
        <div className={style.sessionProduct}>
          <div className={style.sessionImage}>
            <Swiper
              modules={[Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              spaceBetween={10}
              className="main-swiper"
            >
              {imagesProduct.map((src, i) => (
                <SwiperSlide key={i} style={{ display:"flex", justifyContent: "center" }}>
                  <AntdImage
                    preview={{
                      toolbarRender: (
                        _,
                        {
                          transform: { scale },
                          actions: { onZoomOut, onZoomIn, onReset },
                        }
                      ) => (
                        <Space
                          size="middle"
                          style={{
                            background: 'rgba(0,0,0,0.45)',
                            borderRadius: 10,
                          }}
                        >
                          <ZoomOutOutlined
                            style={{ color: '#fff', fontSize: 18, padding: 20}}
                            disabled={scale <= 1}
                            onClick={onZoomOut}
                          />
                          <ZoomInOutlined
                            style={{ color: '#fff', fontSize: 18, padding: 20}}
                            disabled={scale >= 50}
                            onClick={onZoomIn}
                          />
                        </Space>
                      ),
                      minScale: 1,
                      maxScale: 50,
                    }}
                    width={350}
                    height={450}
                    style={{ objectFit: "contain" }}
                    alt="Imagem do produto"
                    src={src} />
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              modules={[Thumbs, FreeMode, Pagination]}
              pagination={true}
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={imagesProduct.length >= 4 ? 4 : imagesProduct.length}
              freeMode
              watchSlidesProgress
              className="thumbs-swiper"
              style={{ marginTop: 10 }}
            >
              {imagesProduct.map((src, i) => (
                <SwiperSlide key={i} style={{ cursor: 'pointer' }}>
                  <img style={{ objectFit:"contain", width: "100%", height: "100%" }} src={src} alt={`Thumb ${i}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div>
            <h2>{infoProduct.name}</h2>
            {
              infoProduct.promotionPrice == 0 ?
              <h3>R$ {infoProduct.originalPrice},00</h3> :
              <h3 style={{ color: "#090" }}>R$ {infoProduct.promotionPrice},00</h3>
            }
            { infoProduct.category !== null &&
              <p><b>Categoria: </b>{infoProduct.category.name}</p>
            }
            { infoProduct.description !== null &&
              <p><b>Descrição: </b>{infoProduct.description}</p>
            }
            <br />
            {
              (infoProduct.option !== null && infoProduct.option.length !== 0) ?
              <Form.Item name="option">
                <Radio.Group>
                  {
                    infoProduct.option.map((element) => (
                      <Radio.Button value={element.id}>{element.option}</Radio.Button>
                    ))
                  }
                </Radio.Group>
                </Form.Item>:
                <div>
                  <h3>Produto sem estoque</h3><br />
                </div>
            }
            <Form.Item>
              <Button disabled={(infoProduct.option == null || infoProduct.option.length==0)} style={{ width: "100%", padding: 20 }} type="primary" htmlType="submit">Adicionar</Button>
            </Form.Item>
          </div>
        </div>
      }
      {
        infoProduct == null &&
        <div style={{ height: "70vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 70 }} />} />
        </div>
      }
    </Form>
  )
}