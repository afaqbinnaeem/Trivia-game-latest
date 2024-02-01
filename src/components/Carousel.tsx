import React, { useRef, useState } from "react";
import crosBg from "@/assets/images/crosBg.png";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// @ts-ignore
export default function App({ first, second, third }) {
  return (
    <>
      <Swiper
        slidesPerView={"auto"}
        // spaceBetween={10}
        loop={true}
        // autoplay={{ delay: 150, disableOnInteraction: true }}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="relative">
            <Image src={crosBg} width={500} alt="" className="" />
            <div className="absolute cr-content top-3 left-3 w-3/4">
              <div className="flex items-center justify-around">
                <p className="text-white cr-number">1</p>
                <p className="prizeName text-white ">{first}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Image src={crosBg} width={500} alt="" className="" />
            <div className="absolute cr-content top-3 left-3 w-3/4">
              <div className="flex items-center justify-around">
                <p className="text-white cr-number">2</p>
                <p className="prizeName text-white ">{second}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Image src={crosBg} width={500} alt="" className="" />
            <div className="absolute cr-content top-3 left-3 w-3/4">
              <div className="flex items-center justify-around">
                <p className="text-white cr-number">3</p>
                <p className="prizeName text-white ">{third}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
