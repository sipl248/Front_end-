"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Script from "next/script";
import React from "react";
const AdsterraAd = dynamic(() => import("@/components/AdsterraAd"), {
  ssr: false, // ✅ Disable SSR so React doesn’t break the DOM injected by script
});

export default function page() {
  return (
    <div className="bg-[#020C17] text-[#abb7c4] -mt-20">
      <div className="game-detail">
        <AdsterraAd />
      </div>
      <div className="py-20  px-[20.2rem]  max-lg:px-5 media_resp  max-md:px-0">
        <Image
          src={"https://pokiigame.com/_next/static/media/img3.6d832745.jpg"}
          alt="poster"
          className="rounded-[25px] h-[45vh] object-cover"
          width={1200}
          height={673}
        />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1>About Pokii</h1>
        </div>
        <div className="text-[18px]">
          <p className="mb-2">
            Welcome to pokiifuns.com, web based gaming platform! With over 1000+
            games accross 25+ categories we provide exllent gaming experience to
            users.
          </p>
          <p className="mb-2">
            At pokiifuns.com, we understand the power of gaming to create
            memorable experiences and forge connections between people. Whether
            you{"'"}re a fan of cars or bike racing, adventure games, actionable
            and thrilling games, we{"'"}ve covered everything for you.
          </p>
        </div>
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h2>Our Mission</h2>
          <p className="text-[18px] text-[#abb7c4] font-light mb-2">
            Our mission is to provide smooth gaming experience where users can
            instant play to all our games without downloads, login, popups or
            other distractions.
          </p>
          <p className="text-[18px] text-[#abb7c4] font-light mb-2">
            We pride ourselves on delivering a seamless and user-friendly gaming
            experience. Our website is designed with intuitive navigation and
            responsive interfaces, ensuring that you can dive into your favorite
            games with just a few clicks. We also prioritize your safety and
            security, implementing robust measures to protect your personal
            information and provide a safe environment for all users.
          </p>
          <p className="text-[18px] text-[#abb7c4] font-light">
            Pokiifuns Game is more than just a gaming platform; it{"'"}s a
            vibrant community. Join our growing community of gamers, where you
            can connect with like-minded individuals, share your achievements,
            and participate in lively discussions. Engage in friendly
            competitions, collaborate with fellow players, or simply find a
            place to relax and have fun.
          </p>
        </div>

        <div className="mt-8 font-semibold text-[32px] text-[#4280bf]">
          <h2 className="mb-2">Have any issue?</h2>

          <div className="text-[18px] text-[#abb7c4] font-light">
            <p className="mb-2">
              Our team of passionate people is dedicated to providing you with
              exceptional customer support. If you ever encounter any issues or
              have any questions, our support team is here to assist you every
              step of the way. We value your feedback and constantly strive to
              improve our platform based on your suggestions and needs.
            </p>
            <p className="mb-2">
              So, whether you{"'"}re seeking an adrenaline rush, a mental
              challenge, or simply a momentary escape, pokiifuns.com is your
              go-to destination. Prepare to embark on unforgettable gaming
              adventures and unlock a world of limitless possibilities. Join us
              today and let the games begin!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
