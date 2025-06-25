import Image from "next/image";
import Link from "next/link";

export default function Games() {
  return (
    <div className="pt-20">
      <div className="text-white text-[36px] max-sm:text-[26px] font-semibold justify-between  items-center text-center  pt-5">
        PLAY YOUR FAVORITE GAME
      </div>

      <div className="grid grid-cols-6 max-lg:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-2  place-items-center gap-1 pt-8 pb-8  px-[20.2rem]  max-lg:px-5">
        {[...Array(36)].map((item, index) => {
          return (
            <Link
              href={`/${index + 1}`}
              key={index}
              className="relative overflow-hidden border-4 border-transparent rounded-[20px] transform transition-transform hover:border-4 hover:border-[#DCF836] duration-500  w-full h-full"
            >
              <Image
                width={136}
                height={136}
                alt="game-poster"
                className="w-full"
                src={"https://pokiigame.com/images/logos/feed-the-frog.jpg"}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
