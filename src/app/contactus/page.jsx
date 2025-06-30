import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="bg-[#020C17] text-white -mt-20">
      <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
        <Image
          src={"https://pokiigame.com/_next/static/media/contact.833d1c6a.jpg"}
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
        <div className="mt-4">
          <form>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-[#0f2133] p-3 mb-2"
              required=""
              name="name"
            />
            <input
              required=""
              type="text"
              placeholder="Your Email"
              className="w-full bg-[#0f2133] p-3 mb-2"
              name="email"
            />
            <textarea
              required=""
              rows="6"
              cols="100"
              className="w-full bg-[#0f2133] p-3 mb-2"
              placeholder="Your Message"
              name="message"
            ></textarea>
            <button
              type="submit"
              className="text-white bg-[#dd003f] rounded-[20px] px-[25px] py-[11px] font-[600] text-[14px]"
            >
              <span>Submit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
