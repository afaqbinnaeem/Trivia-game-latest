import React from "react";
import crosBg from "@/assets/images/crosBg.png";
import Image from "next/image";

interface CarouselProps {
  first: string;
  second: string;
  third: string;
}

const Carousel: React.FC<CarouselProps> = ({ first, second, third }) => {
  return (
    <>
      <div className="slider">
        <div className="slide-track">
          {[first, second, third].map((prize, index) => (
            <div key={index} className="slide relative">
              <Image src={crosBg} alt="" className="object-cover w-full h-full" />
              <div className="absolute crContent">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="crHeading mb-0">{index + 1}</h1>
                    <p className="crPlaces">Places</p>
                  </div>

                  <div className="crLeftDiv ps-5">
                    <h3 className="crfryer mb-4">{prize}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Carousel;
