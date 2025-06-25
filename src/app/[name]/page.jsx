import Games from "@/components/Games";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <>
      <div className="min-h-screen -mt-20 text-white bg-[url(https://pokiigame.com/_next/static/media/footer.5bdee055.jpg)] h-auto bg-no-repeat bg-fixed">
        <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
          <div className="flex justify-between items-center sm:border-transparent  max-md:flex-col max-lg:gap-10 max-xl:gap-4 max-sm:!gap-0 relative">
            <Image
              src={"https://pokiigame.com/images/logos/feed-the-frog.jpg"}
              alt="background-poster"
              className="absolute inset-0 w-full h-[580px]  object-cover  rounded-[20px] max-sm:rounded-none"
              width={600}
              height={600}
            />
            <div
              className="absolute top-0 left-0 w-full h-[580px] rounded-[20px] max-sm:rounded-none"
              style={{ backgroundColor: " rgba(0, 0, 0, 0.5)" }}
            ></div>

            <div className="w-full py-28 max-md:py-5 max-sm:!pt-[0.5rem] max-sm:!pb-[0.30rem] flex justify-center items-center flex-col z-10">
              <div className="text-[60px] max-md:text-[32px] text-[#fff] font-semibold max-sm:mb-[4px] mb-[15px] text-center">
                FEED THE FROG
              </div>
              <Image
                src={"https://pokiigame.com/images/logos/feed-the-frog.jpg"}
                alt="background-poster"
                className="w-[200px] h-[200px] max-md:h-[160px] max-md:w-[160px] max-sm:h-[130px] max-sm:w-[150px] max-xs:w-[155px] max-xs:h-[155px] max-xxs:h-[140px] max-xxs:w-[140px] rounded-[20px] opacity-100"
                width={172}
                height={172}
              />
              <Link
                href={"#"}
                className="bg-[#DCF836] hover:bg-red-700 hover:text-white w-fit text-center max-sm:w-[80%] mt-6 sm:mt-4 text-black font-bold py-[13px] cursor-pointer px-[40px] !mx-10 rounded-[60px]  transition-transform duration-700 ease-in-out transform hover:-translate-y-2"
              >
                PLAY GAME
              </Link>
            </div>
          </div>
          {/* html */}
          <div className="text-white  max-lg:px-5 text-lg text-justify pt-6 max-md:pt-80 max-sm:80 leading-relaxed ">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti
              ipsum molestias maiores nihil, nulla tempore eum cum deserunt in,
              ratione itaque! Fuga veniam, sint inventore eum doloribus soluta
              eius similique.
            </p>
            <p className="mt-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti
              ipsum molestias maiores nihil, nulla tempore eum cum deserunt in,
              ratione itaque! Fuga veniam, sint inventore eum doloribus soluta
              eius similique.
            </p>
            <p className="mt-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti
              ipsum molestias maiores nihil, nulla tempore eum cum deserunt in,
              ratione itaque! Fuga veniam, sint inventore eum doloribus soluta
              eius similique.
            </p>
            <p className="mt-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti
              ipsum molestias maiores nihil, nulla tempore eum cum deserunt in,
              ratione itaque! Fuga veniam, sint inventore eum doloribus soluta
              eius similique.
            </p>
            <p className="mt-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti
              ipsum molestias maiores nihil, nulla tempore eum cum deserunt in,
              ratione itaque! Fuga veniam, sint inventore eum doloribus soluta
              eius similique.
            </p>
            <p className="mt-5">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti
              ipsum molestias maiores nihil, nulla tempore eum cum deserunt in,
              ratione itaque! Fuga veniam, sint inventore eum doloribus soluta
              eius similique.
            </p>
          </div>

          <div className="flex justify-start items-center flex-wrap gap-3 mt-10 max-lg:px-5">
            <div className="border border-solid border-white hover:border-[#dcf836] hover:text-[#dcf836] px-4 py-1 rounded-[15px]">
              Frog Game
            </div>
            <div className="border border-solid border-white hover:border-[#dcf836] hover:text-[#dcf836] px-4 py-1 rounded-[15px]">
              Frog Game
            </div>
            <div className="border border-solid border-white hover:border-[#dcf836] hover:text-[#dcf836] px-4 py-1 rounded-[15px]">
              Frog Game
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#020C17]">
        <Games />
      </div>
    </>
  );
}
