"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function AdsterraAd() {
  useEffect(() => {
    // fallback: force-load script in browser if it fails to auto-load
    const script = document.createElement("script");
    script.src =
      "//www.highperformanceformat.com/33c38de2503eaee4251a5962d435100d/invoke.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center my-4">
      {/* ✅ The div where the ad will be injected */}
      <div id="container-33c38de2503eaee4251a5962d435100d" />

      {/* ✅ Config required by Adsterra */}
      <Script id="adsterra-config" strategy="afterInteractive">
        {`
          atOptions = {
            'key': '33c38de2503eaee4251a5962d435100d',
            'format': 'iframe',
            'height': 300,
            'width': 160,
            'params': {}
          };
        `}
      </Script>
    </div>
  );
}
