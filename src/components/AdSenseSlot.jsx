"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-7456682660420004";

let scriptPromise = null;
let adLoadedRefs = new Set(); // Track which ad slots have been loaded

export default function AdSenseSlot({
  slot,
  format = "auto",
  layoutKey,
  layout,
  client = DEFAULT_CLIENT,
  className = "",
  style = {},
  placeholderHeight = 0,
  fullWidthResponsive,
  ...rest
}) {
  const containerRef = useRef(null);
  const adLoadedRef = useRef(false);
  const [hasAdContent, setHasAdContent] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Create unique key for this ad slot
    const adKey = `${client}-${slot}`;
    
    // If ad already loaded for this slot, skip
    if (adLoadedRefs.has(adKey) || adLoadedRef.current) {
      return;
    }

    const injectAd = async () => {
      if (typeof window === "undefined" || adLoadedRef.current) return;

      // Mark as loading
      adLoadedRef.current = true;
      adLoadedRefs.add(adKey);

      // Load script if not already loaded
      if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
          const existing = document.querySelector(
            `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}"]`
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
        
        // Small delay to ensure container is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Push ad to AdSense
        if (containerRef.current && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          
          let adDetected = false;
          
          // Set up MutationObserver to detect when ad content is added
          const checkForAd = () => {
            if (containerRef.current && !adDetected) {
              const hasIframe = containerRef.current.querySelector('iframe[src*="googlesyndication"], iframe[src*="doubleclick"]');
              
              if (hasIframe) {
                adDetected = true;
                setHasAdContent(true);
                return true;
              }
            }
            return false;
          };
          
          // Check immediately after a short delay
          setTimeout(() => {
            if (checkForAd()) return;
          }, 500);
          
          // Set up observer to watch for ad content
          const mutationObserver = new MutationObserver(() => {
            if (checkForAd()) {
              mutationObserver.disconnect();
            }
          });
          
          if (containerRef.current) {
            mutationObserver.observe(containerRef.current, {
              childList: true,
              subtree: true,
              attributes: true
            });
          }
          
          // Timeout: if no ad loads in 6 seconds, hide the container
          setTimeout(() => {
            mutationObserver.disconnect();
            if (!adDetected && containerRef.current) {
              // Check one more time
              if (!checkForAd()) {
                // No ad loaded, hide container
                if (containerRef.current) {
                  containerRef.current.style.display = 'none';
                  containerRef.current.style.height = '0';
                  containerRef.current.style.margin = '0';
                  containerRef.current.style.padding = '0';
                  
                  // Hide wrapper as well
                  const wrapper = containerRef.current.closest('.ad-wrapper');
                  if (wrapper) {
                    wrapper.style.display = 'none';
                    wrapper.style.marginTop = '0';
                    wrapper.style.marginBottom = '0';
                  }
                }
              }
            }
          }, 6000);
        }
      } catch (error) {
        console.warn("AdSense script failed to load", error);
        adLoadedRef.current = false;
        adLoadedRefs.delete(adKey);
        // Hide container on error
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
          
          // Hide wrapper as well
          const wrapper = containerRef.current.closest('.ad-wrapper');
          if (wrapper) {
            wrapper.style.display = 'none';
            wrapper.style.marginTop = '0';
            wrapper.style.marginBottom = '0';
          }
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !adLoadedRef.current) {
            observer.disconnect();
            injectAd();
          }
        });
      },
      { threshold: 0.1, rootMargin: "200px" } // Lower threshold and larger margin for better detection
    );

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [client, slot]);

  // Update wrapper visibility when ad content changes
  useEffect(() => {
    if (containerRef.current) {
      const wrapper = containerRef.current.closest('.ad-wrapper');
      if (wrapper) {
        if (hasAdContent) {
          wrapper.style.display = '';
          wrapper.style.marginTop = '';
          wrapper.style.marginBottom = '';
          wrapper.classList.add('my-4');
        } else {
          // Check if ad is actually hidden
          const isHidden = containerRef.current.style.display === 'none' || 
                          window.getComputedStyle(containerRef.current).display === 'none';
          if (isHidden) {
            wrapper.style.display = 'none';
            wrapper.style.marginTop = '0';
            wrapper.style.marginBottom = '0';
            wrapper.classList.remove('my-4');
          }
        }
      }
    }
  }, [hasAdContent]);

  return (
    <ins
      ref={containerRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: hasAdContent ? "block" : "none",
        width: "100%",
        ...style,
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      {...(layout ? { "data-ad-layout": layout } : {})}
      {...(typeof fullWidthResponsive === "boolean"
        ? { "data-full-width-responsive": fullWidthResponsive ? "true" : "false" }
        : {})}
      {...rest}
    />
  );
}


