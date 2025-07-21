"use client";
import { useEffect, useRef } from "react";

export default function AdBanner({
  keyId,
  width = 160,
  height = 300,
  format = "iframe",
  className = "",
}) {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");

      conf.innerHTML = `atOptions = ${JSON.stringify({
        key: keyId,
        format,
        height,
        width,
        params: {},
      })};`;

      script.type = "text/javascript";
      script.async = true;
      script.src = `//www.highperformanceformat.com/${keyId}/invoke.js`;

      bannerRef.current.appendChild(conf);
      bannerRef.current.appendChild(script);
    }
  }, [keyId, width, height, format]);

  return (
    <div
      ref={bannerRef}
      className={`mx-auto  ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
