"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaGamepad, FaSearch } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header
      className=" sticky top-0 z-50"
      style={{ backgroundColor: "rgb(2, 12, 23)" }}
    >
      <div className="max-lg:flex items-center justify-between max-lg:py-[12px] py-[16px] max-lg:px-[14px] max-lg:pe-5 ">
        <div className="flex items-center justify-between px-80  w-full  max-lg:px-0">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Image
              src={
                "https://pokiigame.com/_next/static/media/mainlogo.e390ad58.svg"
              }
              height={40}
              width={60}
              alt="Logo"
              className="w-[60px] h-[40px] max-lg:h-[34px]  cursor-pointer"
            />
          </div>

          {/* Search and Actions */}
          <div className="flex font-semibold items-center gap-10 max-md:hidden text-[16px]">
            <ul className="capitalize  flex items-center gap-10 text-[#abb7c4]">
              <li>HOME</li>
              <li>ABOUT US</li>
              <li>DEVELOPER</li>
              <li>AFFILIATES</li>
              <li>CONTACT US</li>
              <li>
                <IoSearch fontSize={20} />
              </li>
            </ul>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-xl p-3 border-b border-gray-800/30">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-xl pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700/30 placeholder-gray-400"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
