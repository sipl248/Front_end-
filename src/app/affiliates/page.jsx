import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="bg-[#020C17]  text-[#abb7c4] -mt-20">
      <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
        <Image
          src={"https://pokiigame.com/_next/static/media/img1.84a82450.jpg"}
          alt="poster"
          className="rounded-[25px] h-[45vh] object-cover"
          width={1200}
          height={673}
        />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>Affiliate Program for Pokii Game</h1>
        </div>
        <div className="text-[18px]">
          <p className="mb-2">
            We welcomes web and mobile app developers to drive traffic to our
            website and start earning money through your traffic.
          </p>
          <p className="mb-2">
            We are biggest library of HTML5 games, optimized for both desktop
            and mobile devices. You can easily choose a few games or set up your
            own gaming portal as you wish. We are working hard to make sure all
            your demands are met – especially in terms of content and marketing.
            We strive to make sure our partners get the best possible results
          </p>
        </div>
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>Contact Us and Join our affiliate program</h1>
          <p className="text-[18px] text-[#abb7c4] font-light">
            help.pokiigame@gmail.com
          </p>
        </div>

        <div className="mt-8 font-semibold text-[32px] text-[#4280bf]">
          <h1 className="mb-2">About Pokii Game</h1>

          <div className="text-[18px] text-[#abb7c4] font-light">
            <p className="mb-2">
              PokiiGame has a team of 25 people working on our gaming platform.
              Our mission is simple - to create a browser-gaming platform that
              works seamlessly for users around the world, and rewards
              developers both big and small.
            </p>
            <p className="mb-2">
              Our games are playable on desktop, tablet and mobile so you can
              enjoy them at school, at home or on the road. Every month millions
              of gamers from all over the world play their favorite games on
              ThopGames. Our goal is to create the ultimate online playground.
              Free and open to all.
            </p>
            <p className="mb-2">
              We{"’"}re a team of makers, techies, adventurers {"–"} and some
              gamers too. We{"’"}re kids of all ages, and love what we do.
            </p>
            <p className="mb-2">
              Just load up your favorite games instantly in your web browser and
              enjoy the experience.
            </p>
            <p className="mb-2">
              You can play our games on desktop mobile devices. That includes
              everything from desktop PCs, laptops, and Chromebooks, to the
              latest smartphones and tablets from Apple and Android.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
