import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="bg-[#020C17] text-[#abb7c4] -mt-20">
      <div className="py-20  px-[20.2rem] media_resp   max-lg:px-5  max-md:px-0">
        <Image
          src={"https://pokiigame.com/_next/static/media/img2.d48ea787.jpg"}
          alt="poster"
          className="rounded-[25px] h-[45vh] object-cover"
          width={1200}
          height={673}
        />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>Developers - pokiifuns</h1>
        </div>
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
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h2>Contact Us and Join Now</h2>
          <p className="text-[18px] text-[#abb7c4] font-light mt-2">
            help.pokiifuns@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
