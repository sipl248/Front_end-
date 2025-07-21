"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function AdsterraAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//www.highperformanceformat.com/33c38de2503eaee4251a5962d435100d/invoke.js";
    script.async = true;
    document.getElementById("adsterra-slot")?.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center my-4">
      <div
        id="adsterra-slot"
        className="w-[160px] h-[300px] border border-gray-600"
      />
    </div>
  );
}
