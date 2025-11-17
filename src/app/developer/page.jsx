import Image from "next/image";
import AnimatedPoster from "@/components/AnimatedPoster";
import React from "react";
import Script from "next/script";
export const metadata = {
  title: "Developer with Pokiifuns | Publish Free Games on Pokiifuns",
  description:
    "Publish your free games on Pokiifuns! Share web games, browser games, and no-download fun games online. Reach players looking for new and cool free games",
};
export default function page() {
  return (
    <div className="bg-[#020C17] text-[#abb7c4] -mt-20 max-md:px-4">
      <div className="py-20  px-[20.2rem] media_resp   max-lg:px-5  max-md:px-0">
        <AnimatedPoster className="h-[45vh]" title="DEVELOPERS" />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>Developers - pokiifuns</h1>
        </div>
          {/* Google Ad 1 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
          crossOrigin="anonymous"
        />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-7456682660420004"
          data-ad-slot="3556369143"
        ></ins>
        <Script id="ads-1">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
        <div className="text-[18px]">
          <p className="h-auto">
            pokiifuns is a top game development studio dedicated to making fun
            and interesting gaming experiences. In addition to creating games,
            we also have expertise in gaming apps and responsive game design,
            which ensures seamless platform integration.
            <br />
            <br />
            Content creators on the pokiifuns platform have unparalleled control
            over their works. Posting, publishing, tracking, and monetizing
            content is made simple by our user-friendly interface. But what
            really sets us apart are the vibrant community and large number of
            visitors to pokiifuns.com, which give creators unparalleled
            visibility and audience access.
            <br />
            <br />
            Imagine having the ease to bring your creations to a global
            audience, monetize your labor of love, and increase traffic to your
            games.
            <br />
            <br />
            Developers can make a profitable business out of their passion for
            games with the aid of our platform.
          </p>
        </div>

        {/* Google Ad 2 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
          crossOrigin="anonymous"
        />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-7456682660420004"
          data-ad-slot="8542878619"
        ></ins>
        <Script id="ads-2">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>

        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h2>Contact Us and Join Now</h2>
          <p className="text-[18px] text-[#abb7c4] font-light mt-2">
            help.pokiifuns@gmail.com
          </p>
        </div>

          {/* Google Ad 3 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
          crossOrigin="anonymous"
        />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-7456682660420004"
          data-ad-slot="4823125458"
        ></ins>
        <Script id="ads-3">{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
      </div>
    </div>
  );
}
