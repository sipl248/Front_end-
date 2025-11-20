"use client";
import Image from "next/image";
import AnimatedPoster from "@/components/AnimatedPoster";
import React, { useState } from "react";
import axios from "axios";
import Script from "next/script";

export default function Contactus() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}contact/submit`,
        form
      );
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020C17] text-white -mt-20 max-md:px-4">
      <div className="py-20 px-[20.2rem] media_resp  max-lg:px-10 max-md:px-4">
        <AnimatedPoster className="h-[45vh] max-md:h-[35vh]" title="CONTACT SUPPORT" />
        <div className="mt-8 mb-2 font-semibold text-[32px] text-[#4280bf]">
          <h1 className="mb-3">Contact US</h1>
          <div className="text-[18px] text-[#abb7c4] font-light">
            <p className="mb-5">help.pokiifuns@gmail.com</p>
          </div>
        </div>
        {/* Google Ad 1 */}
         <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="autorelaxed"
              data-ad-client="ca-pub-7456682660420004"
              data-ad-slot="3556369143"
            />
            <Script id="ads-about" strategy="afterInteractive">
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>

        <div className="font-semibold text-[32px] text-[#4280bf]">
          <h2 className="mb-3">Copy Right Issue</h2>
          <p className="text-[18px] text-[#abb7c4] font-light mb-2">
            We own the Intellectual Property Rights (IPR) to a large number of
            the games on pokiifuns.com{"'"} sites, and for certain games, we
            requested and obtained licenses from the copyright holders known to
            us. For some games, we could not find any copyright information, or,
            due to general use on the internet, this information can no longer
            be obtained.
          </p>
          <p className="text-[18px] text-[#abb7c4] font-light mb-2">
            Some games may be used under special conditions, considering a
            number of prerequisite constraints. These prerequisite constraints
            are, as far as we could determine, met by pokiifuns.
          </p>
          <p className="text-[18px] text-[#abb7c4] font-light mb-2">
            We do not change anything in the source code of the games. For
            example, credit holders, brand names, or references to websites
            remain unchanged. If any copyright or other IPR that you may have is
            possibly being infringed by/on Pokkifuns sites, please inform us
            immediately, thereby providing us with the following:
          </p>
          <ol
            type="i"
            style={{ padding: "8px", margin: "4px", listStyle: "inside" }}
          >
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              the electronic or physical signature of the owner of the IPR or
              the person authorized to act on the owner{"'"}s behalf;
            </li>
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              a description of the IP Right that has been infringed, and a
              description of the infringing activity;
            </li>
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              the location where the unauthorized copy of the copyrighted work
              exists (for example, the URL of the pokiifuns website where it is
              posted, or the name of the book in which it has been published,
              or, in case of a registered brand name, an excerpt of such
              register evidencing the registry);
            </li>
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              a copy of a license in which you are granted the right to use and
              to protect such IPR (if you are not the owner of the IPR);
            </li>
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              the identification of the URL or other specific location on this
              site where the material that you claim is infringing is located;
              this information must be specific enough to enable us to locate
              such material;
            </li>
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              your name and full contact details; and
            </li>
            <li className="text-[18px] text-[#abb7c4] font-light mb-2">
              a statement by you that you have a sincere and honest belief that
              the disputed use is not authorized by the copyright owner, its
              agent, or the law.
            </li>
          </ol>

          <p className="text-[18px] text-[#abb7c4] font-light mb-2 mt-2">
            Send above details at help.pokiifuns@gmail.com. We will review it
            and will start taking action on it as soon as possible. We will
            reply you on any of the query within 7 days.
          </p>
        </div>
          {/* Google Ad 2 */}
        <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="autorelaxed"
              data-ad-client="ca-pub-7456682660420004"
              data-ad-slot="3556369143"
            />
            <Script id="ads-instructions" strategy="afterInteractive">
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>

        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-[#0f2133] p-3 mb-2"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              required
              type="text"
              placeholder="Your Email"
              className="w-full bg-[#0f2133] p-3 mb-2"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-[#0f2133] p-3 mb-2"
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />
            <textarea
              required
              rows="6"
              cols="100"
              className="w-full bg-[#0f2133] p-3 mb-2"
              placeholder="Your Message"
              name="message"
              value={form.message}
              onChange={handleChange}
            ></textarea>
            <button
              type="submit"
              className="text-white cursor-pointer bg-[#dd003f] rounded-[20px] px-[25px] py-[11px] font-[600] text-[14px]"
              disabled={loading}
            >
              {loading ? <span>Loading...</span> : <span>Submit</span>}
            </button>
            {success && <div className="text-green-500 mt-2">{success}</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </div>

        {/* Google Ad 3 */}
         <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7456682660420004"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-format="fluid"
            data-ad-layout-key="-gx-5+29-24-33"
            data-ad-client="ca-pub-7456682660420004"
            data-ad-slot="6963570616"
          />
          <Script id="ads-tags" strategy="afterInteractive">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
      </div>
    </div>
  );
}
