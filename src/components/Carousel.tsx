import React, { useRef, useState } from "react";
import crosBg from "@/assets/images/crosBg (3).png";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// @ts-ignore
export default function App({ first, second, third }) {
  return (
    <>
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={1}
        loop={true}
        // autoplay={{ delay: 150, disableOnInteraction: true }}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="relative">
            <Image src={crosBg} width={600} alt="" className="" />
            <div className="absolute cr-content top-4 left-0 w-3/4">
              <div className="flex items-center justify-around">
                <div className="">
                  <p className="text-white cr-number">1</p>
                  <p className="text-white crPlaces">place</p>
                </div>
                <p className="prizeName mt-3 text-white ">{first}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Image src={crosBg} width={500} alt="" className="" />
            <div className="absolute cr-content top-4 left-0 w-3/4">
              <div className="flex items-center justify-around">
                <div className="">
                  <p className="text-white cr-number">2</p>
                  <p className="text-white crPlaces">place</p>
                </div>
                <p className="prizeName mt-3 text-white ">{second}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Image src={crosBg} width={500} alt="" className="" />
            <div className="absolute cr-content top-4 left-0 w-3/4">
              <div className="flex items-center justify-around">
                <div className="">
                  <p className="text-white cr-number">3</p>
                  <p className="text-white crPlaces">place</p>
                </div>
                <p className="prizeName mt-3 text-white ">{third}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
