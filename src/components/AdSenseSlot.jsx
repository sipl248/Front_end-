"use client";

import { useEffect, useRef } from "react";

const DEFAULT_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-7456682660420004";

let scriptPromise = null;

export default function AdSenseSlot({
  slot,
  format = "auto",
  layoutKey,
  client = DEFAULT_CLIENT,
  className = "",
  style = {},
  placeholderHeight = 120,
  fullWidthResponsive,
  ...rest
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            injectAd();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [client, slot]);

  const injectAd = async () => {
    if (typeof window === "undefined") return;

    if (!scriptPromise) {
      scriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(
          `script[src*=\"pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}\"]`
        );

        if (existing) {
          if (existing.getAttribute("data-loaded") === "true") {
            resolve();
          } else {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", reject);
          }
          return;
        }

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        script.crossOrigin = "anonymous";
        script.addEventListener("load", () => {
          script.setAttribute("data-loaded", "true");
          resolve();
        });
        script.addEventListener("error", reject);
        document.head.appendChild(script);
      });
    }

    try {
      await scriptPromise;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn("AdSense script failed to load", error);
    }
  };

  return (
    <ins
      ref={containerRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: "block",
        minHeight: placeholderHeight,
        ...style,
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      {...(typeof fullWidthResponsive === "boolean"
        ? { "data-full-width-responsive": fullWidthResponsive ? "true" : "false" }
        : {})}
      {...rest}
    />
  );
}


