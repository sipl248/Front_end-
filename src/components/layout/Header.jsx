"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
// import {usepathname} from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/aboutus" },
    { label: "DEVELOPER", href: "/developer" },
    { label: "AFFILIATES", href: "/affiliates" },
    { label: "CONTACT US", href: "/contactus" },
  ];

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[rgb(2,12,23)] border-b border-[#ffffff1c]"
          : "bg-transparent"
      }`}
    >
      <div className="max-lg:flex items-center justify-between max-lg:py-[12px] py-[16px] max-lg:px-[14px] max-lg:pe-5 ">
        <div className="flex items-center justify-between px-80 w-full max-lg:px-0">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Image
              src="https://pokiigame.com/_next/static/media/mainlogo.e390ad58.svg"
              height={40}
              width={60}
              alt="Logo"
              className="w-[60px] h-[40px] max-lg:h-[34px] cursor-pointer"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="flex font-semibold items-center gap-10 max-md:hidden text-[16px]">
            <ul className="capitalize flex items-center gap-10 text-[#abb7c4]">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <IoSearch fontSize={20} />
              </li>
            </ul>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full bg-[#020c17] z-40 flex flex-col items-center border-t border-[#222c36] shadow-lg">
          <div className="w-full flex justify-end px-6 pt-4 pb-2">
            <button
              className="text-white text-2xl focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>
          <ul className="flex flex-col items-center gap-2 w-full pb-4">
            {navLinks.map((link) => (
              <li key={link.label} className="w-full text-center">
                <Link
                  href={link.href}
                  className="block py-2 text-base font-semibold text-[#abb7c4] hover:text-[#dcf836] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
