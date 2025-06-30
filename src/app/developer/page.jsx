import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="bg-[#020C17] text-white -mt-20">
      <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
        <Image
          src={"https://pokiigame.com/_next/static/media/img2.d48ea787.jpg"}
          alt="poster"
          className="rounded-[25px] h-[45vh] object-cover"
          width={1200}
          height={673}
        />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          About Pokki
        </div>
        <p className="text-[18px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          consequatur, obcaecati aliquid ab numquam quia fuga nulla quis velit
          sapiente vero voluptatum fugit corporis similique nesciunt! Numquam
          porro aliquam sunt?
        </p>
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          About Pokki
        </div>
        <p className="text-[18px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          consequatur, obcaecati aliquid ab numquam quia fuga nulla quis velit
          sapiente vero voluptatum fugit corporis similique nesciunt! Numquam
          porro aliquam sunt?
        </p>
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          About Pokki
        </div>
        <p className="text-[18px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          consequatur, obcaecati aliquid ab numquam quia fuga nulla quis velit
          sapiente vero voluptatum fugit corporis similique nesciunt! Numquam
          porro aliquam sunt?
        </p>
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          About Pokki
        </div>
        <p className="text-[18px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
          consequatur, obcaecati aliquid ab numquam quia fuga nulla quis velit
          sapiente vero voluptatum fugit corporis similique nesciunt! Numquam
          porro aliquam sunt?
        </p>
      </div>
    </div>
  );
}
