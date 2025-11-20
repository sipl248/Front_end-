import Image from "next/image";
import AnimatedPoster from "@/components/AnimatedPoster";
import React from "react";
import Script from "next/script";
export const metadata = {
  title: "Join Pokiifuns Affiliates | Promote Fun Online Games & Earn",
  description:
    "Become a Pokiifuns affiliate! Promote fun online games, browser games, and free games to play without download—and earn while users enjoy web games for free.",
};
export default function page() {
  return (
    <div className="bg-[#020C17] text-[#abb7c4] -mt-20 max-md:px-4">
      <div className="py-20 px-[20.2rem] max-2xl:px-25 max-xl:px-12 max-lg:px-8 max-md:px-4">
        <AnimatedPoster className="h-[45vh] max-md:h-[35vh]" title="AFFILIATES" />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf] max-md:text-2xl">
          <h1>Affiliate Program for Pokiifuns Game</h1>
        </div>
        <div className="text-[18px]">
          <p className="text-[18px] max-md:text-base space-y-3">
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
         {/* Google Ad 1 */}
         <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="autorelaxed"
              data-ad-client="ca-pub-7456682660420004"
              data-ad-slot="3556369143"
            />
            <Script id="ads-about" strategy="lazyOnload">
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
       
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h2>Contact Us and Join our affiliate program</h2>
          <p className="text-[18px] text-[#abb7c4] font-light">
            help.pokiifuns@gmail.com
          </p>
        </div>

        {/* Google Ad 2 */}
        <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="autorelaxed"
              data-ad-client="ca-pub-7456682660420004"
              data-ad-slot="3556369143"
            />
            <Script id="ads-instructions" strategy="lazyOnload">
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>

        <div className="mt-8 font-semibold text-[32px] text-[#4280bf]">
          <h2 className="mb-2">About Pokiifuns Game</h2>

          <div className="text-[18px] text-[#abb7c4] font-light">
            <p className="mb-2">
              pokiifuns has a team of 25 people working on our gaming platform.
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

        {/* Google Ad 3 */}
           <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-format="fluid"
            data-ad-layout-key="-gx-5+29-24-33"
            data-ad-client="ca-pub-7456682660420004"
            data-ad-slot="6963570616"
          />
          <Script id="ads-tags" strategy="lazyOnload">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
      </div>
    </div>
  );
}
