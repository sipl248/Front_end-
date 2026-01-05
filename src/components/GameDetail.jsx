"use client";
import Image from "next/image";
import AdSenseSlot from "@/components/AdSenseSlot";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function GameDetail({ gameDetails, name }) {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [gameError, setGameError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const iframeRef = useRef(null);
  const modalContainerRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const modalOpenRef = useRef(false);

  const prefersLandscape = useMemo(() => {
    const w = Number(gameDetails?.width) || 0;
    const h = Number(gameDetails?.height) || 0;
    if (w && h) return w > h;
    const cat = (gameDetails?.category || "").toLowerCase();
    return ["racing", "sports", "arcade"].some(k => cat.includes(k));
  }, [gameDetails]);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== 'undefined') {
        const isPortraitMode = window.innerHeight > window.innerWidth;
        const isMobileDevice = window.innerWidth < 768;
        setIsPortrait(isPortraitMode);
        setIsMobile(isMobileDevice);
        
        // If game prefers landscape and we're in portrait, try to lock orientation
        if (prefersLandscape && isPortraitMode && isMobileDevice && showIframe) {
          setTimeout(() => {
            try {
              if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
              }
            } catch {}
          }, 100);
        }
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    // Also listen for device orientation changes
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onResize);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', onResize);
      }
    };
  }, [prefersLandscape, showIframe]);
  const router = useRouter();
  const hiddenAdsRef = useRef([]);
  const observerRef = useRef(null);

  const handleCloseModal = React.useCallback(() => {
    modalOpenRef.current = false; // Update ref when closing
    setShowIframe(false);
    setIframeLoaded(false);
    setGameReady(false);
    setNeedsTap(false);
    setGameError(null);
  }, []);

  // Listen for console errors to catch gamepad/permissions issues
  const handleConsoleError = React.useCallback((event) => {
    const error = event.detail || event.error || event.message || '';
    const errorString = typeof error === 'string' ? error : error?.toString() || '';
    const stackString = error?.stack || '';
    const fullError = (errorString + ' ' + stackString).toLowerCase();
    
    // Suppress non-critical errors that don't affect gameplay
    if (errorString || stackString) {
      // Handle Unity WebGL mobile warnings - allow user to continue
      if (fullError.includes('unity webgl') && fullError.includes('not currently supported on mobiles')) {
        return; // Don't show error, let user continue
      }
      
      // CRITICAL: Suppress ALL gamepad permission errors - these are completely non-blocking
      if (fullError.includes('gamepad') || 
          fullError.includes('getgamepads') ||
          fullError.includes('access to the feature "gamepad"') ||
          fullError.includes('permissions policy') && fullError.includes('gamepad') ||
          fullError.includes('securityerror') && fullError.includes('gamepad') ||
          fullError.includes('_emscripten_get_num_gamepads') ||
          fullError.includes('failed to execute') && fullError.includes('gamepad')) {
        // Gamepad errors are completely non-critical - games work perfectly without gamepad
        // Prevent error from showing in console
        event.preventDefault?.();
        event.stopPropagation?.();
        return; // Completely suppress these errors
      }
      
      // Suppress shader warnings - Unity specific, non-blocking
      if (fullError.includes('shader unsupported') || 
          (fullError.includes('shader') && fullError.includes('standard'))) {
        return; // Shader warnings don't block gameplay
      }
      
      // Suppress ad loader errors - non-critical
      if (fullError.includes('adsloaderpromise') || 
          fullError.includes('adsloader') ||
          fullError.includes('ad loader')) {
        return; // Ad errors don't affect gameplay
      }
      
      // Suppress UnityLoader.js errors related to gamepad
      if (fullError.includes('unityloader') && fullError.includes('gamepad')) {
        event.preventDefault?.();
        event.stopPropagation?.();
        return;
      }
      
      // Handle other SecurityErrors (only non-gamepad ones)
      if (fullError.includes('securityerror') && 
          !fullError.includes('gamepad') &&
          !fullError.includes('getgamepads')) {
        // Only show non-gamepad SecurityErrors
        console.warn('Game error caught:', errorString);
        if (!fullError.includes('gamepad')) {
          setGameError('Game encountered an error. Please try again.');
        }
      }
    }
  }, []);

  React.useEffect(() => {
    if (showIframe) {
      modalOpenRef.current = true; // Track modal state
      document.body.classList.add('overflow-hidden');
      document.body.classList.add('modal-open');
      setGameError(null); // Reset error state when opening
      // Auto-activate on mobile - don't show tap overlay, games should play directly
      try {
        const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        // Don't show tap overlay - games should play directly
        setNeedsTap(false);
        // Auto-activate immediately on mobile
        if (isMobile && isTouch) {
          setTimeout(() => {
            try {
              const iframe = iframeRef.current;
              if (iframe) {
                iframe.focus();
                iframe.contentWindow?.focus?.();
              }
            } catch {}
          }, 100);
        }
      } catch { setNeedsTap(false); }

      // Handle browser back button - push state when modal opens
      if (typeof window !== 'undefined') {
        // Push a state to history so back button closes modal instead of navigating away
        // Only push if we don't already have a modal state
        if (!window.history.state?.modalOpen) {
          window.history.pushState({ modalOpen: true }, '', window.location.href);
        }
        
        // Listen for popstate (back button)
        const handlePopState = () => {
          // Only close modal if it's actually open (check ref for current state)
          if (modalOpenRef.current) {
            // Close modal instead of navigating away
            handleCloseModal();
          }
        };
        
        window.addEventListener('popstate', handlePopState);
        
        // Store cleanup in a way we can access it
        window._gameModalPopStateHandler = handlePopState;
      }

      // Set up error listeners - CRITICAL: Suppress gamepad errors globally
      const errorHandler = (event) => {
        const error = event.error || event.reason || event.message || '';
        const errorString = typeof error === 'string' ? error : error?.toString() || '';
        const stackString = error?.stack || '';
        const fullError = (errorString + ' ' + stackString).toLowerCase();
        
        // Completely suppress gamepad errors
        if (fullError.includes('gamepad') || 
            fullError.includes('getgamepads') ||
            fullError.includes('access to the feature "gamepad"') ||
            fullError.includes('_emscripten_get_num_gamepads') ||
            (fullError.includes('securityerror') && fullError.includes('gamepad'))) {
          event.preventDefault?.();
          event.stopPropagation?.();
          event.stopImmediatePropagation?.();
          return false; // Prevent error from propagating
        }
        
        // Call original handler for other errors
        handleConsoleError(event);
      };
      
      window.addEventListener('error', errorHandler, true); // Use capture phase
      window.addEventListener('unhandledrejection', errorHandler, true);
      
      // Also override console.error to suppress gamepad errors
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const errorMsg = args.join(' ').toLowerCase();
        if (errorMsg.includes('gamepad') || 
            errorMsg.includes('getgamepads') ||
            errorMsg.includes('access to the feature "gamepad"') ||
            errorMsg.includes('_emscripten_get_num_gamepads')) {
          // Suppress gamepad errors in console
          return;
        }
        originalConsoleError.apply(console, args);
      };
      
      // Store original for cleanup
      window._originalConsoleError = originalConsoleError;
      window._gameErrorHandler = errorHandler;

      // Mobile touch event forwarding for cross-origin content
      if (isMobile) {
        // Ensure iframe gets focus and can receive touch events
        const activateIframe = () => {
          try {
            const iframe = iframeRef.current;
            if (iframe) {
              // Focus the iframe to enable user activation
              iframe.focus();
              
              // Try to focus the content window
              try {
                iframe.contentWindow?.focus();
              } catch (e) {
                // Cross-origin restriction, that's okay
              }
              
              // Ensure pointer events are enabled
              iframe.style.pointerEvents = 'auto';
              iframe.style.touchAction = 'auto';
            }
          } catch {}
        };

        const handleTouchStart = (e) => {
          try {
            const iframe = iframeRef.current;
            if (iframe) {
              const rect = iframe.getBoundingClientRect();
              const touch = e.touches[0] || e.changedTouches[0];
              if (touch && rect.left <= touch.clientX && touch.clientX <= rect.right && 
                  rect.top <= touch.clientY && touch.clientY <= rect.bottom) {
                // Activate iframe on first touch
                activateIframe();
                
                // CRITICAL: Forward touch to iframe content for click handling
                try {
                  if (iframe.contentDocument) {
                    const doc = iframe.contentDocument;
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;
                    
                    // Find element at touch point
                    const elementAtPoint = doc.elementFromPoint(x, y);
                    if (elementAtPoint) {
                      // Trigger mousedown immediately
                      const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        view: iframe.contentWindow
                      });
                      elementAtPoint.dispatchEvent(mouseDown);
                    }
                  }
                } catch {}
                
                // Don't prevent default to allow iframe to handle the event
                // The iframe needs to receive the actual touch event
              }
            }
          } catch {}
        };

        const handleTouchEnd = (e) => {
          try {
            const iframe = iframeRef.current;
            if (iframe) {
              activateIframe();
              
              // CRITICAL: Forward touch end to iframe content for click handling
              try {
                const rect = iframe.getBoundingClientRect();
                const touch = e.changedTouches[0] || e.touches[0];
                if (touch && iframe.contentDocument) {
                  const doc = iframe.contentDocument;
                  const x = touch.clientX - rect.left;
                  const y = touch.clientY - rect.top;
                  
                  // Find element at touch point
                  const elementAtPoint = doc.elementFromPoint(x, y);
                  if (elementAtPoint) {
                    // Trigger mouseup and click
                    const mouseUp = new MouseEvent('mouseup', {
                      bubbles: true,
                      cancelable: true,
                      clientX: touch.clientX,
                      clientY: touch.clientY,
                      view: iframe.contentWindow
                    });
                    const click = new MouseEvent('click', {
                      bubbles: true,
                      cancelable: true,
                      clientX: touch.clientX,
                      clientY: touch.clientY,
                      view: iframe.contentWindow
                    });
                    
                    elementAtPoint.dispatchEvent(mouseUp);
                    setTimeout(() => {
                      elementAtPoint.dispatchEvent(click);
                      // Also try direct click method
                      try {
                        if (elementAtPoint.click) {
                          elementAtPoint.click();
                        }
                      } catch {}
                    }, 10);
                  }
                }
              } catch {}
            }
          } catch {}
        };

        const handleClickEvent = (e) => {
          try {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              const rect = iframe.getBoundingClientRect();
              if (rect.left <= e.clientX && e.clientX <= rect.right && 
                  rect.top <= e.clientY && e.clientY <= rect.bottom) {
                activateIframe();
              }
            }
          } catch {}
        };

        // Add event listeners with capture phase to ensure they fire
        document.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
        document.addEventListener('touchmove', handleTouchStart, { passive: true, capture: true });
        document.addEventListener('click', handleClickEvent, { passive: true, capture: true });
        
        // Also activate on modal open
        setTimeout(activateIframe, 100);
        setTimeout(activateIframe, 500);
        
        return () => {
          document.removeEventListener('touchstart', handleTouchStart, { capture: true });
          document.removeEventListener('touchend', handleTouchEnd, { capture: true });
          document.removeEventListener('touchmove', handleTouchStart, { capture: true });
          document.removeEventListener('click', handleClickEvent, { capture: true });
        };
      }

      // Preconnect to the game host to speed up loading
      try {
        const u = new URL(gameDetails?.url || '#');
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `${u.protocol}//${u.host}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      } catch (_) {}

      // Hide any existing ad layers and keep hiding newly injected ones while modal is open
      const adSelectors = [
        'ins.adsbygoogle', '.adsbygoogle', '[id^="aswift_"]', '[id*="google_ads"]',
        'iframe[src*="googlesyndication"]', 'iframe[src*="doubleclick"]', 'iframe[src*="/ads"]',
        'div[style*="z-index: 2147483647"]', 'body > ins[style*="position: fixed"]',
      ];
      const hideExistingAds = () => {
        const nodes = document.querySelectorAll(adSelectors.join(','));
        hiddenAdsRef.current = [];
        nodes.forEach(node => {
          const el = node;
          const prev = el.style.display;
          hiddenAdsRef.current.push({ el, prev });
          el.style.display = 'none';
        });
      };
      hideExistingAds();

      observerRef.current = new MutationObserver(mutations => {
        for (const m of mutations) {
          m.addedNodes?.forEach(n => {
            if (!(n instanceof HTMLElement)) return;
            if (adSelectors.some(sel => n.matches?.(sel)) || n.querySelector?.(adSelectors.join(','))) {
              try {
                if (n instanceof HTMLElement) n.style.display = 'none';
                n.querySelectorAll?.('*').forEach(c => { if (c instanceof HTMLElement) c.style.display = 'none'; });
              } catch {}
            }
          });
        }
      });
      observerRef.current.observe(document.body, { childList: true, subtree: true });

      // Try to lock to landscape for landscape-first games on supported browsers
      const lockLandscape = async () => {
        try {
          if (prefersLandscape && isMobile) {
            // Try multiple methods for landscape lock
            if (screen.orientation && screen.orientation.lock) {
              try {
                await screen.orientation.lock('landscape');
              } catch (e) {
                // If lock fails, try unlock first then lock
                try {
                  await screen.orientation.unlock();
                  await screen.orientation.lock('landscape');
                } catch {}
              }
            }
            // Also try legacy method
            if (screen.lockOrientation) {
              try {
                screen.lockOrientation('landscape');
              } catch {}
            }
            if (screen.mozLockOrientation) {
              try {
                screen.mozLockOrientation('landscape');
              } catch {}
            }
            if (screen.msLockOrientation) {
              try {
                screen.msLockOrientation('landscape');
              } catch {}
            }
          }
        } catch {}
      };
      
      // Lock landscape immediately if needed - CRITICAL for mobile gameplay
      if (prefersLandscape && isMobile) {
        // Try multiple times to ensure landscape lock
        lockLandscape();
        setTimeout(lockLandscape, 300);
        setTimeout(lockLandscape, 600);
        setTimeout(lockLandscape, 1000);
        setTimeout(lockLandscape, 2000);
        
        // Also try on orientation change
        const handleOrientationChange = () => {
          if (isPortrait && showIframe) {
            lockLandscape();
          }
        };
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Store cleanup
        if (!window._landscapeLockHandler) {
          window._landscapeLockHandler = handleOrientationChange;
        }
      }
    } else {
      modalOpenRef.current = false; // Update ref when modal closes
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('modal-open');
      
      // Restore body styles (especially for mobile)
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
      document.body.style.webkitOverflowScrolling = '';
      document.body.style.willChange = '';
      document.body.style.transform = '';
      
      // restore hidden ads if any
      hiddenAdsRef.current.forEach(({ el, prev }) => { try { el.style.display = prev; } catch {} });
      hiddenAdsRef.current = [];
      observerRef.current?.disconnect?.();
      
      // Clean up mobile touch interval
      if (iframeRef.current?._touchInterval) {
        clearInterval(iframeRef.current._touchInterval);
        iframeRef.current._touchInterval = null;
      }
      
      // Clean up iframe touch handlers
      if (iframeRef.current?._touchHandlers) {
        try {
          const iframe = iframeRef.current;
          const handler = iframe._touchHandlers;
          iframe.removeEventListener('touchstart', handler);
          iframe.removeEventListener('touchend', handler);
          iframe.removeEventListener('touchmove', handler);
          iframe._touchHandlers = null;
        } catch {}
      }
      
      // Clean up dialog observer
      if (iframeRef.current?._dialogObserver) {
        iframeRef.current._dialogObserver.disconnect();
        iframeRef.current._dialogObserver = null;
      }
      
      // Clean up popstate listener
      if (typeof window !== 'undefined' && window._gameModalPopStateHandler) {
        window.removeEventListener('popstate', window._gameModalPopStateHandler);
        delete window._gameModalPopStateHandler;
      }
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('modal-open');
      
      // Restore body styles
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
      document.body.style.webkitOverflowScrolling = '';
      document.body.style.willChange = '';
      document.body.style.transform = '';
      
      hiddenAdsRef.current.forEach(({ el, prev }) => { try { el.style.display = prev; } catch {} });
      hiddenAdsRef.current = [];
      observerRef.current?.disconnect?.();
      // Clean up error listeners
      // Clean up error listeners
      if (window._gameErrorHandler) {
        window.removeEventListener('error', window._gameErrorHandler, true);
        window.removeEventListener('unhandledrejection', window._gameErrorHandler, true);
        delete window._gameErrorHandler;
      }
      
      // Restore original console.error
      if (window._originalConsoleError) {
        console.error = window._originalConsoleError;
        delete window._originalConsoleError;
      }
      
      // Clean up popstate listener
      if (typeof window !== 'undefined' && window._gameModalPopStateHandler) {
        window.removeEventListener('popstate', window._gameModalPopStateHandler);
        delete window._gameModalPopStateHandler;
      }
      
      // Clean up landscape lock handler
      if (typeof window !== 'undefined' && window._landscapeLockHandler) {
        window.removeEventListener('orientationchange', window._landscapeLockHandler);
        delete window._landscapeLockHandler;
      }
      
      // Unlock orientation when modal closes
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch {}
      
      // Clean up dialog observer
      if (iframeRef.current?._dialogObserver) {
        iframeRef.current._dialogObserver.disconnect();
        iframeRef.current._dialogObserver = null;
      }
      
      // Clean up touch interval
      if (iframeRef.current?._touchInterval) {
        clearInterval(iframeRef.current._touchInterval);
        iframeRef.current._touchInterval = null;
      }
    };
  }, [showIframe, handleCloseModal]);

  return (
    <div
      className={`min-h-screen -mt-20 text-white bg-[url(https://pokiigame.com/_next/static/media/footer.5bdee055.jpg)] h-auto bg-no-repeat bg-fixed overflow-x-hidden`}
    >
      <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
        <div className="relative flex justify-between items-center sm:border-transparent  max-md:flex-col max-lg:gap-10 max-xl:gap-4 max-sm:!gap-0">
          {gameDetails?.isCustom ? (
            <img
              src={gameDetails?.thumb || gameDetails?.poster || "/assets/pokii_game.webp"}
              alt="background-poster"
              className="absolute inset-0 w-full h-[580px] max-xl:h-[520px] max-lg:h-[460px] max-md:h-[360px] max-sm:h-[300px] object-cover rounded-[20px] max-sm:rounded-none"
              onError={(e) => {
                e.target.src = "/assets/pokii_game.webp";
              }}
            />
          ) : (
            <Image
              src={gameDetails?.thumb || gameDetails?.poster || "/assets/pokii_game.webp"}
              alt="background-poster"
              className="absolute inset-0 w-full h-[580px] max-xl:h-[520px] max-lg:h-[460px] max-md:h-[360px] max-sm:h-[300px] object-cover rounded-[20px] max-sm:rounded-none"
              width={600}
              height={600}
              onError={(e) => {
                e.target.src = "/assets/pokii_game.webp";
              }}
            />
          )}
          <div className="absolute inset-0 h-[580px] max-xl:h-[520px] max-lg:h-[460px] max-md:h-[360px] max-sm:h-[300px] rounded-[20px] max-sm:rounded-none bg-[linear-gradient(180deg,rgba(2,12,23,0.2)_0%,rgba(2,12,23,0.75)_55%,rgba(2,12,23,0.95)_100%)]"></div>

          <div className="relative z-[5] w-full py-24 max-md:py-6 flex justify-center items-center flex-col">
            <h1 className="text-[56px] max-xl:text-[44px] max-md:text-[32px] font-extrabold text-center tracking-wide mb-3">
              <span className="bg-gradient-to-r from-[#DCF836] via-white to-[#DCF836] bg-clip-text text-transparent" style={{ backgroundSize: '200% 200%', animation: 'shine 6s linear infinite' }}>
              {gameDetails?.title || name}
              </span>
            </h1>
            <div className="rounded-[22px] border border-[rgba(220,248,54,0.25)] bg-[rgba(7,18,28,0.55)] backdrop-blur-md p-4 flex flex-col items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {gameDetails?.isCustom ? (
              <img
                src={gameDetails?.thumb || gameDetails?.poster || "/assets/pokii_game.webp"}
                alt="game-poster"
                className="w-[200px] h-[200px] max-md:h-[160px] max-md:w-[160px] max-sm:h-[130px] max-sm:w-[150px] rounded-[16px] transition-transform duration-500 will-change-transform hover:rotate-1 hover:scale-[1.02]"
                onError={(e) => {
                  e.target.src = "/assets/pokii_game.webp";
                }}
              />
            ) : (
              <Image
                src={gameDetails?.thumb || gameDetails?.poster || "/assets/pokii_game.webp"}
                alt="game-poster"
                className="w-[200px] h-[200px] max-md:h-[160px] max-md:w-[160px] max-sm:h-[130px] max-sm:w-[150px] rounded-[16px] transition-transform duration-500 will-change-transform hover:rotate-1 hover:scale-[1.02]"
                width={200}
                height={200}
                onError={(e) => {
                  e.target.src = "/assets/pokii_game.webp";
                }}
              />
            )}
            <button
              onClick={() => setShowIframe(true)}
                className="relative px-8 py-3 rounded-[60px] font-semibold bg-[#DCF836] text-black hover:bg-[#c4e030] transition-colors cursor-pointer"
            >
              PLAY GAME
                <span className="absolute inset-0 rounded-[60px]" style={{ boxShadow: '0 0 0 0 rgba(220,248,54,0.35)', animation: 'ring 2.4s ease-in-out infinite' }} />
            </button>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-0">
              <span className="absolute left-[12%] top-[20%] w-2 h-2 rounded-full bg-[#DCF836] opacity-70" style={{ animation: 'float1 8s ease-in-out infinite' }} />
              <span className="absolute right-[18%] top-[30%] w-2 h-2 rounded-full bg-[#7db3ff] opacity-70" style={{ animation: 'float2 10s ease-in-out infinite' }} />
              <span className="absolute left-[45%] bottom-[18%] w-2 h-2 rounded-full bg-white opacity-70" style={{ animation: 'float3 9s ease-in-out infinite' }} />
            </div>
            {/* Iframe Modal */}
            {showIframe && (
              <div className="fixed top-0 left-0 z-[9999] w-full h-full bg-black/90 backdrop-blur-sm flex justify-center items-center game-modal-container" style={{ pointerEvents: 'auto', touchAction: 'auto' }}>
                <div ref={modalContainerRef} className="relative w-[100%] h-[100%] max-w-full" style={{ pointerEvents: 'auto', touchAction: 'auto' }}>
                  {/* ambient theme orbs removed in modal to prevent overlap during gameplay */}

                  {/* bottom-left glow logo - smaller on mobile */}
                  <div className="pointer-events-none absolute left-2 bottom-2 md:left-3 md:bottom-3 z-[30] flex items-center gap-1 md:gap-2">
                    <Image 
                      src="/assets/pokii_game.webp" 
                      alt="Pokiifuns" 
                      width={56} 
                      height={36} 
                      className="h-5 w-auto md:h-9 rounded-md shadow-[0_0_20px_rgba(220,248,54,0.45)] animate-[glowPulse_2.2s_ease-in-out_infinite]" 
                    />
                  </div>

                  {/* top-left horizontal site tag (hidden on mobile) */}
                  <div className="hidden md:block pointer-events-none absolute left-3 top-3 z-[30]">
                    <div className="px-3 py-1 rounded-full border border-[#DCF836] text-[#DCF836] text-xs font-semibold tracking-wider bg-[rgba(7,18,28,0.45)] shadow-[0_0_16px_rgba(220,248,54,0.35)] animate-[tagSlideIn_650ms_ease-out_1,tagFloat_6s_ease-in-out_infinite_800ms]">
                      Pokiifuns.com
                    </div>
                  </div>

                  {/* Loading overlay */}
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center gap-4">
                      <div className="w-[200px] h-[10px] rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-1/3 bg-[#DCF836] animate-[barSlide_1.2s_linear_infinite]" />
                      </div>
                      <div className="text-white/80 text-sm">
                        {isMobile ? 'Loading game...' : 'Loading game…'}
                      </div>
                    </div>
                  )}

                  {/* Rotate guidance - only show briefly, then auto-hide to allow gameplay */}
                  {prefersLandscape && isPortrait && isMobile && !iframeLoaded && (
                    <div className="absolute inset-0 z-[25] flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm text-white text-center px-6">
                      <div className="text-lg font-semibold text-[#DCF836]">Rotate to Landscape</div>
                      <div className="text-white/80 text-sm max-w-sm">This game plays best in landscape mode</div>
                      <button
                        onClick={async () => {
                          try {
                            if (screen.orientation && screen.orientation.lock) {
                              await screen.orientation.lock('landscape');
                            } else if (screen.lockOrientation) {
                              screen.lockOrientation('landscape');
                            }
                          } catch (e) {
                            // Silently fail
                          }
                        }}
                        className="px-4 py-2 rounded-full bg-[#DCF836] text-black text-xs font-semibold active:scale-95 mt-2"
                      >
                        Rotate Now
                      </button>
                    </div>
                  )}

                  <iframe
                    key={`game-${retryCount}`}
                    ref={iframeRef}
                    src={(() => {
                      // Handle custom games vs API games
                      if (gameDetails?.isCustom) {
                        // Custom games: use the URL directly (should be /games/{folder}/index.html)
                        return gameDetails?.url || "#";
                      } else {
                        // API games: use the provided URL
                        return gameDetails?.url || "#";
                      }
                    })()}
                    className={`relative z-[10] w-full h-full rounded-none ${isMobile ? 'mobile-game-iframe' : ''} smooth-game-iframe ${prefersLandscape && isPortrait && isMobile ? 'landscape-rotate' : ''}`}
                    allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; microphone; camera; picture-in-picture; xr-spatial-tracking; payment; geolocation"
                    allowFullScreen
                    loading="eager"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    playsInline
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation allow-pointer-lock allow-downloads allow-modals"
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: '#000',
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      WebkitTransform: 'translateZ(0)',
                      isolation: 'isolate',
                      contain: 'layout style paint',
                      // CRITICAL: Ensure touch events work on mobile
                      touchAction: 'auto',
                      WebkitTouchCallout: 'none',
                      pointerEvents: 'auto',
                      // Prevent text selection during gameplay
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      // Optimize for mobile
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    onLoad={() => {
                      setIframeLoaded(true);
                      setGameError(null);
                      setGameReady(true);
                      setNeedsTap(false); // Hide any tap overlay - games play directly
                      
                      // Immediate mobile activation - CRITICAL for smooth gameplay
                      if (isMobile) {
                        // Multiple immediate activation attempts
                        const activateMobile = () => {
                          try {
                            const iframe = iframeRef.current;
                            if (iframe) {
                              // Focus iframe
                              iframe.focus();
                              try {
                                iframe.contentWindow?.focus?.();
                              } catch {}
                              
                              // Ensure touch events are enabled
                              iframe.style.pointerEvents = 'auto';
                              iframe.style.touchAction = 'auto';
                              
                              // Force activation
                              try {
                                iframe.click();
                              } catch {}
                            }
                          } catch {}
                        };
                        
                        // Try immediately and multiple times
                        activateMobile();
                        setTimeout(activateMobile, 50);
                        setTimeout(activateMobile, 100);
                        setTimeout(activateMobile, 200);
                        setTimeout(activateMobile, 500);
                      }
                      
                      // Performance optimizations for smoother gameplay
                      try {
                        const iframe = iframeRef.current;
                        if (iframe) {
                          // Force hardware acceleration
                          iframe.style.transform = 'translate3d(0, 0, 0)';
                          iframe.style.webkitTransform = 'translate3d(0, 0, 0)';
                          iframe.style.willChange = 'transform';
                          iframe.style.backfaceVisibility = 'hidden';
                          iframe.style.webkitBackfaceVisibility = 'hidden';
                          iframe.style.isolation = 'isolate';
                          
                          // Optimize rendering
                          iframe.style.imageRendering = 'optimizeSpeed';
                          iframe.style.textRendering = 'optimizeSpeed';
                          
                          // Prevent layout shifts
                          iframe.style.contain = 'layout style paint';
                        }
                      } catch {}
                      
                      // Performance optimizations for all devices
                      try {
                        // Optimize document rendering
                        document.body.style.willChange = 'auto';
                        document.body.style.transform = 'translateZ(0)';
                        
                        // Reduce repaints
                        const style = document.createElement('style');
                        style.textContent = `
                          * {
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            text-rendering: optimizeSpeed;
                          }
                        `;
                        document.head.appendChild(style);
                      } catch {}
                      
                      // Mobile-specific optimizations
                      if (isMobile) {
                        // Prevent scroll bounce on iOS
                        document.body.style.overscrollBehavior = 'none';
                        document.body.style.webkitOverflowScrolling = 'touch';
                        document.body.style.position = 'fixed';
                        document.body.style.width = '100%';
                        document.body.style.height = '100%';
                        
                        // Optimize touch handling - CRITICAL: Allow touch events to pass through
                        try {
                          const iframe = iframeRef.current;
                          if (iframe) {
                            // CRITICAL FIX: Use 'auto' instead of 'manipulation' to allow all touch gestures
                            iframe.style.setProperty('touch-action', 'auto', 'important');
                            iframe.style.setProperty('-webkit-touch-callout', 'none', 'important');
                            iframe.style.setProperty('-webkit-user-select', 'none', 'important');
                            iframe.style.setProperty('user-select', 'none', 'important');
                            iframe.style.setProperty('-webkit-tap-highlight-color', 'transparent', 'important');
                            
                            // CRITICAL: Ensure pointer events are enabled
                            iframe.style.setProperty('pointer-events', 'auto', 'important');
                            
                            // Force GPU acceleration for smooth gameplay
                            iframe.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
                            iframe.style.setProperty('-webkit-transform', 'translate3d(0, 0, 0)', 'important');
                            iframe.style.setProperty('will-change', 'transform', 'important');
                            
                            // Optimize for smooth rendering
                            iframe.style.setProperty('image-rendering', 'optimizeSpeed', 'important');
                            iframe.style.setProperty('backface-visibility', 'hidden', 'important');
                            iframe.style.setProperty('-webkit-backface-visibility', 'hidden', 'important');
                            
                            // Focus the iframe to enable user activation - multiple attempts for reliability
                            const focusAttempts = [50, 100, 200, 500, 1000];
                            focusAttempts.forEach((delay) => {
                              setTimeout(() => {
                                try {
                                  iframe.focus();
                                  iframe.contentWindow?.focus?.();
                                  // Also try clicking to activate on first attempt
                                  if (delay === 100) {
                                    try {
                                      iframe.click();
                                    } catch {}
                                  }
                                } catch {}
                              }, delay);
                            });
                            
                            // If landscape game, try to lock orientation - multiple attempts for mobile
                            if (prefersLandscape && isMobile) {
                              const lockAttempts = [200, 500, 1000, 2000];
                              lockAttempts.forEach((delay) => {
                                setTimeout(() => {
                                  try {
                                    if (screen.orientation && screen.orientation.lock) {
                                      screen.orientation.lock('landscape').catch(() => {});
                                    } else if (screen.lockOrientation) {
                                      screen.lockOrientation('landscape');
                                    } else if (screen.mozLockOrientation) {
                                      screen.mozLockOrientation('landscape');
                                    }
                                  } catch {}
                                }, delay);
                              });
                            }
                          }
                        } catch {}
                        
                        // CRITICAL: Ensure all interactive elements are touchable and clickable
                        const makeElementsTouchable = () => {
                          try {
                            const iframe = iframeRef.current;
                            if (iframe && iframe.contentDocument) {
                              const doc = iframe.contentDocument;
                              
                              // CRITICAL: Enable ALL elements for clicks - especially canvas and game elements
                              const allElements = doc.querySelectorAll('*');
                              allElements.forEach(el => {
                                el.style.pointerEvents = 'auto';
                                el.style.touchAction = 'auto'; // CRITICAL: 'auto' for games, not 'manipulation'
                                el.style.webkitTouchCallout = 'auto';
                                el.style.webkitUserSelect = 'auto';
                                el.style.userSelect = 'auto';
                                
                                // CRITICAL: Remove any pointer-events: none
                                const computedStyle = window.getComputedStyle(el);
                                if (el.style.pointerEvents === 'none' || computedStyle.pointerEvents === 'none') {
                                  el.style.pointerEvents = 'auto';
                                }
                                
                                // CRITICAL: Enable click events on all elements - AGGRESSIVE approach
                                try {
                                  // Add click event listener if not already present
                                  if (!el._clickEnabled) {
                                    el._clickEnabled = true;
                                    
                                    // Enable touch to click conversion - multiple methods
                                    el.addEventListener('touchstart', (e) => {
                                      // Don't prevent default - let game handle it
                                      el._touchStart = true;
                                      el._touchX = e.touches[0].clientX;
                                      el._touchY = e.touches[0].clientY;
                                      
                                      // Also trigger mousedown immediately
                                      try {
                                        const mouseDown = new MouseEvent('mousedown', {
                                          bubbles: true,
                                          cancelable: true,
                                          view: window,
                                          clientX: el._touchX,
                                          clientY: el._touchY
                                        });
                                        el.dispatchEvent(mouseDown);
                                      } catch {}
                                    }, { passive: true });
                                    
                                    el.addEventListener('touchmove', (e) => {
                                      if (el._touchStart) {
                                        el._touchX = e.touches[0].clientX;
                                        el._touchY = e.touches[0].clientY;
                                        
                                        // Trigger mousemove
                                        try {
                                          const mouseMove = new MouseEvent('mousemove', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: window,
                                            clientX: el._touchX,
                                            clientY: el._touchY
                                          });
                                          el.dispatchEvent(mouseMove);
                                        } catch {}
                                      }
                                    }, { passive: true });
                                    
                                    el.addEventListener('touchend', (e) => {
                                      if (el._touchStart) {
                                        el._touchStart = false;
                                        
                                        // Convert touch to click - AGGRESSIVE multiple methods
                                        try {
                                          const touch = e.changedTouches[0];
                                          const clientX = touch.clientX;
                                          const clientY = touch.clientY;
                                          
                                          // Method 1: MouseEvent click
                                          const clickEvent = new MouseEvent('click', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: window,
                                            detail: 1,
                                            clientX: clientX,
                                            clientY: clientY
                                          });
                                          
                                          // Method 2: MouseEvent mousedown + mouseup + click sequence
                                          const mouseDown = new MouseEvent('mousedown', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: window,
                                            clientX: clientX,
                                            clientY: clientY
                                          });
                                          const mouseUp = new MouseEvent('mouseup', {
                                            bubbles: true,
                                            cancelable: true,
                                            view: window,
                                            clientX: clientX,
                                            clientY: clientY
                                          });
                                          
                                          // Dispatch all events
                                          el.dispatchEvent(mouseDown);
                                          setTimeout(() => {
                                            el.dispatchEvent(mouseUp);
                                            el.dispatchEvent(clickEvent);
                                            
                                            // Method 3: Direct click if available
                                            if (el.click) {
                                              try {
                                                el.click();
                                              } catch {}
                                            }
                                          }, 10);
                                        } catch {}
                                      }
                                    }, { passive: true });
                                  }
                                } catch {}
                              });
                              
                              // CRITICAL: Specifically enable canvas elements for games
                              const gameCanvasElements = doc.querySelectorAll('canvas');
                              gameCanvasElements.forEach(canvas => {
                                canvas.style.pointerEvents = 'auto';
                                canvas.style.touchAction = 'auto';
                                canvas.style.cursor = 'pointer';
                                
                                // Enable touch events on canvas
                                try {
                                  if (!canvas._gameClickEnabled) {
                                    canvas._gameClickEnabled = true;
                                    
                                    canvas.addEventListener('touchstart', (e) => {
                                      canvas._touchActive = true;
                                      // Also trigger mousedown
                                      const mouseDown = new MouseEvent('mousedown', {
                                        bubbles: true,
                                        cancelable: true,
                                        clientX: e.touches[0].clientX,
                                        clientY: e.touches[0].clientY
                                      });
                                      canvas.dispatchEvent(mouseDown);
                                    }, { passive: true });
                                    
                                    canvas.addEventListener('touchmove', (e) => {
                                      if (canvas._touchActive) {
                                        // Trigger mousemove
                                        const mouseMove = new MouseEvent('mousemove', {
                                          bubbles: true,
                                          cancelable: true,
                                          clientX: e.touches[0].clientX,
                                          clientY: e.touches[0].clientY
                                        });
                                        canvas.dispatchEvent(mouseMove);
                                      }
                                    }, { passive: true });
                                    
                                    canvas.addEventListener('touchend', (e) => {
                                      if (canvas._touchActive) {
                                        canvas._touchActive = false;
                                        // Trigger mouseup and click
                                        const mouseUp = new MouseEvent('mouseup', {
                                          bubbles: true,
                                          cancelable: true,
                                          clientX: e.changedTouches[0].clientX,
                                          clientY: e.changedTouches[0].clientY
                                        });
                                        const click = new MouseEvent('click', {
                                          bubbles: true,
                                          cancelable: true,
                                          clientX: e.changedTouches[0].clientX,
                                          clientY: e.changedTouches[0].clientY
                                        });
                                        canvas.dispatchEvent(mouseUp);
                                        setTimeout(() => canvas.dispatchEvent(click), 10);
                                      }
                                    }, { passive: true });
                                  }
                                } catch {}
                              });
                              
                              // CRITICAL: Specifically target buttons and clickable elements - especially SKIP button
                              const clickableElements = doc.querySelectorAll('button, [role="button"], a, input, select, textarea, [onclick], div[style*="cursor: pointer"], div[style*="cursor:pointer"], canvas, [class*="game"], [id*="game"], [class*="skip"], [id*="skip"], [class*="button"], [class*="btn"], div[class*="ad"], div[class*="overlay"]');
                              clickableElements.forEach(btn => {
                                btn.style.pointerEvents = 'auto';
                                btn.style.touchAction = 'auto'; // CRITICAL: 'auto' for games
                                btn.style.webkitTouchCallout = 'auto';
                                btn.style.minHeight = '48px'; // Larger for mobile
                                btn.style.minWidth = '48px';
                                btn.style.cursor = 'pointer';
                                btn.style.zIndex = '99999'; // Ensure on top
                                btn.style.position = 'relative';
                                
                                // Add padding if it's a button
                                if (btn.tagName === 'BUTTON' || btn.getAttribute('role') === 'button' || btn.classList.toString().toLowerCase().includes('skip') || btn.classList.toString().toLowerCase().includes('button')) {
                                  if (!btn.style.padding || btn.style.padding === '0px') {
                                    btn.style.padding = '12px 16px';
                                  }
                                }
                                
                                // Force enable touch events on buttons
                                try {
                                  btn.addEventListener('touchstart', (e) => {
                                    // Don't stop propagation - let it bubble to iframe
                                    e.stopImmediatePropagation = () => {}; // Allow event to continue
                                  }, { passive: true, capture: false });
                                  btn.addEventListener('touchend', (e) => {
                                    // Trigger click on touchend for better mobile response
                                    try {
                                      if (btn.click) {
                                        btn.click();
                                      }
                                    } catch {}
                                  }, { passive: true, capture: false });
                                } catch {}
                              });
                              
                              // CRITICAL: Specifically target SKIP button and ad overlay buttons - AGGRESSIVE approach
                              // Find all possible skip buttons by class, id, and text content
                              const allPossibleButtons = doc.querySelectorAll('button, [role="button"], div[onclick], span[onclick], a, [class*="button"], [class*="btn"], [class*="skip"], [id*="skip"], div[style*="cursor"], span[style*="cursor"], div, span, p, h1, h2, h3, h4, h5, h6');
                              allPossibleButtons.forEach(btn => {
                                const text = (btn.textContent || btn.innerText || btn.value || '').toUpperCase().trim();
                                const className = (btn.className || '').toLowerCase();
                                const id = (btn.id || '').toLowerCase();
                                
                                // Check if it's a skip/close button
                                if (text.includes('SKIP') || text.includes('CLOSE') || text === 'X' || 
                                    className.includes('skip') || id.includes('skip') ||
                                    className.includes('close') || id.includes('close')) {
                                  // Make it highly clickable
                                  btn.style.pointerEvents = 'auto';
                                  btn.style.touchAction = 'auto';
                                  btn.style.cursor = 'pointer';
                                  btn.style.zIndex = '99999';
                                  btn.style.position = 'relative';
                                  btn.style.minHeight = '48px';
                                  btn.style.minWidth = '48px';
                                  btn.style.padding = '12px 16px';
                                  btn.style.fontSize = '16px';
                                  btn.style.fontWeight = 'bold';
                                  btn.style.display = 'block';
                                  btn.style.visibility = 'visible';
                                  btn.style.opacity = '1';
                                  
                                  // Remove any pointer-events: none
                                  if (btn.style.pointerEvents === 'none' || window.getComputedStyle(btn).pointerEvents === 'none') {
                                    btn.style.pointerEvents = 'auto';
                                  }
                                  
                                  // CRITICAL: Force click on touch - multiple aggressive methods
                                  try {
                                    // Remove old listeners if any
                                    if (btn._skipClickHandler) {
                                      btn.removeEventListener('touchend', btn._skipClickHandler);
                                    }
                                    
                                    const handleTouch = (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.stopImmediatePropagation();
                                      
                                      // Try ALL click methods aggressively
                                      try {
                                        // Method 1: Direct click
                                        if (btn.click) {
                                          btn.click();
                                        }
                                        
                                        // Method 2: onclick handler
                                        if (btn.onclick) {
                                          btn.onclick(e);
                                        }
                                        
                                        // Method 3: MouseEvent click
                                        const clickEvent = new MouseEvent('click', { 
                                          bubbles: true, 
                                          cancelable: true, 
                                          view: window,
                                          detail: 1
                                        });
                                        btn.dispatchEvent(clickEvent);
                                        
                                        // Method 4: MouseEvent mousedown + mouseup + click sequence
                                        const mouseDown = new MouseEvent('mousedown', {
                                          bubbles: true,
                                          cancelable: true,
                                          view: window
                                        });
                                        const mouseUp = new MouseEvent('mouseup', {
                                          bubbles: true,
                                          cancelable: true,
                                          view: window
                                        });
                                        btn.dispatchEvent(mouseDown);
                                        setTimeout(() => {
                                          btn.dispatchEvent(mouseUp);
                                          btn.dispatchEvent(clickEvent);
                                        }, 10);
                                        
                                        // Method 5: Try parent click if button doesn't work
                                        if (btn.parentElement) {
                                          try {
                                            btn.parentElement.click();
                                          } catch {}
                                        }
                                      } catch {}
                                    };
                                    
                                    btn._skipClickHandler = handleTouch;
                                    btn.addEventListener('touchend', handleTouch, { passive: false, capture: true });
                                    btn.addEventListener('touchstart', (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }, { passive: false, capture: true });
                                    
                                    // Also add click listener as backup
                                    btn.addEventListener('click', (e) => {
                                      // Ensure click works
                                    }, { passive: true, capture: true });
                                  } catch {}
                                }
                              });
                              
                              // Ensure canvas elements are touchable (for games) - already handled above
                              // Canvas elements are already enabled in the main loop above
                              
                              // Auto-handle Unity WebGL dialog - automatically click OK button
                              const handleUnityDialog = () => {
                                try {
                                  // Look for Unity WebGL dialog - common patterns
                                  const dialogText = doc.body?.innerText || doc.body?.textContent || '';
                                  if (dialogText.includes('Unity WebGL') && dialogText.includes('not currently supported on mobiles')) {
                                    // Find OK button - check all buttons
                                    const allButtons = doc.querySelectorAll('button, [role="button"], input[type="button"]');
                                    const okButton = Array.from(allButtons).find(btn => {
                                      const text = (btn.textContent || btn.value || '').toLowerCase().trim();
                                      return text === 'ok' || text === 'okay' || text.includes('continue') || text.includes('proceed');
                                    });
                                    
                                    if (okButton) {
                                      // Auto-click OK button after short delay
                                      setTimeout(() => {
                                        try {
                                          okButton.click();
                                          console.log('Unity WebGL dialog automatically handled - OK clicked');
                                        } catch (e) {
                                          // Try alternative methods
                                          try {
                                            const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                                            okButton.dispatchEvent(event);
                                          } catch {}
                                          // Also try touch event for mobile
                                          try {
                                            const touchEvent = new TouchEvent('touchend', { bubbles: true, cancelable: true });
                                            okButton.dispatchEvent(touchEvent);
                                          } catch {}
                                        }
                                      }, 200);
                                    }
                                  }
                                } catch {}
                              };
                              
                              // Check for dialog immediately and periodically
                              handleUnityDialog();
                              
                              // Watch for dialog appearance
                              const dialogObserver = new MutationObserver(() => {
                                handleUnityDialog();
                              });
                              
                              dialogObserver.observe(doc.body || doc.documentElement, {
                                childList: true,
                                subtree: true,
                                characterData: true
                              });
                              
                              // Store observer for cleanup
                              if (!iframeRef.current._dialogObserver) {
                                iframeRef.current._dialogObserver = dialogObserver;
                              }
                            }
                          } catch {}
                        };
                        
                        // Run immediately and then more frequently for mobile
                        makeElementsTouchable();
                        // Run more frequently on mobile for better touch handling
                        const interval = setInterval(makeElementsTouchable, isMobile ? 1000 : 2000);
                        
                        // Store interval for cleanup
                        iframeRef.current._touchInterval = interval;
                        
                        // Also ensure iframe itself is always touchable
                        try {
                          const iframe = iframeRef.current;
                          if (iframe) {
                            // Force enable touch on iframe
                            iframe.style.pointerEvents = 'auto';
                            iframe.style.touchAction = 'auto';
                            
                            // Add touch event listeners to iframe
                            iframe.addEventListener('touchstart', (e) => {
                              // Allow touch events to pass through
                            }, { passive: true });
                            
                            iframe.addEventListener('touchend', (e) => {
                              // Allow touch events to pass through
                            }, { passive: true });
                          }
                        } catch {}
                      }
                      
                      // Performance: Optimize iframe content rendering
                      try {
                        const iframe = iframeRef.current;
                        if (iframe && iframe.contentWindow) {
                          // Request animation frame optimization
                          const win = iframe.contentWindow;
                          if (win.requestAnimationFrame) {
                            // Throttle to 60fps for smoother performance
                            let lastFrame = 0;
                            const originalRAF = win.requestAnimationFrame;
                            win.requestAnimationFrame = function(callback) {
                              const now = performance.now();
                              const timeToCall = Math.max(0, 16 - (now - lastFrame));
                              const id = setTimeout(() => {
                                lastFrame = now + timeToCall;
                                callback(lastFrame);
                              }, timeToCall);
                              return id;
                            };
                          }
                          
                          // Optimize document rendering inside iframe
                          try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            if (iframeDoc) {
                              iframeDoc.body.style.willChange = 'auto';
                              iframeDoc.body.style.transform = 'translateZ(0)';
                              
                              // Reduce layout thrashing
                              iframeDoc.body.style.contain = 'layout style paint';
                            }
                          } catch {}
                        }
                      } catch {}
                      
                      try {
                        // Give the iframe focus for keyboard/touch controls
                        iframeRef.current?.contentWindow?.focus?.();
                        
                        // Ensure focus stays on iframe for better input handling
                        setTimeout(() => {
                          try {
                            iframeRef.current?.contentWindow?.focus?.();
                          } catch {}
                        }, 100);
                      } catch {}
                      
                      // Performance: Optimize modal container
                      try {
                        const el = modalContainerRef.current;
                        if (el) {
                          // Force hardware acceleration on container
                          el.style.willChange = 'transform';
                          el.style.transform = 'translateZ(0)';
                          el.style.backfaceVisibility = 'hidden';
                          el.style.webkitBackfaceVisibility = 'hidden';
                          
                          // Best-effort fullscreen request
                          if (document.fullscreenElement == null) {
                            const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                            if (typeof req === 'function') {
                              req.call(el).catch(() => {
                                // Silently fail if fullscreen not available
                              });
                            }
                          }
                        }
                      } catch {}
                      
                      // Performance: Reduce browser reflows
                      try {
                        // Use requestIdleCallback if available for non-critical updates
                        if (window.requestIdleCallback) {
                          requestIdleCallback(() => {
                            // Any non-critical optimizations can go here
                          }, { timeout: 2000 });
                        }
                      } catch {}
                    }}
                    onError={() => {
                      setGameError('Failed to load game. Please try again.');
                      setIframeLoaded(true);
                    }}
                  />

                  {/* Game Error Display */}
                  {gameError && (
                    <div className="absolute inset-0 z-[30] flex flex-col items-center justify-center bg-black/90 text-white text-center p-6 game-error-overlay">
                      <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-6 max-w-md">
                        <h3 className="text-lg font-semibold mb-3 text-red-300">Game Error</h3>
                        <p className="text-sm mb-4 text-red-200">{gameError}</p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => {
                              setGameError(null);
                              setRetryCount(prev => prev + 1);
                              setIframeLoaded(false);
                            }}
                            className="px-4 py-2 bg-[#DCF836] text-black rounded-lg font-semibold hover:bg-[#c4e030] transition-colors retry-button"
                          >
                            Retry Game
                          </button>
                          <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Removed Start Game overlay - games play directly on mobile without extra button */}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Always close modal, don't navigate away
                      handleCloseModal();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Always close modal, don't navigate away
                      handleCloseModal();
                    }}
                    aria-label="Close game"
                    className="absolute z-[10000] pointer-events-auto cursor-pointer top-2 right-2 md:top-4 md:right-4 bg-red-600 text-white w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full text-sm md:text-base shadow-lg active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-lg:px-5 mt-8 grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-[rgba(220,248,54,0.18)] bg-[rgba(7,18,28,0.55)] p-5">
            <h2 className="text-2xl font-semibold text-[#DCF836] mb-3">About this game</h2>
            <div
              dangerouslySetInnerHTML={{ __html: gameDetails?.description || "" }}
              className="text-white/95 text-lg leading-relaxed"
            />
          </div>
          {/* GOOGLE ADS */}
          <div className="w-full flex justify-center ad-wrapper">
            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
          </div>
          <div className="rounded-2xl border border-[rgba(220,248,54,0.18)] bg-[rgba(7,18,28,0.55)] p-5">
            <h2 className="text-2xl font-semibold text-[#DCF836] mb-3">Instructions</h2>
            <div
              dangerouslySetInnerHTML={{ __html: gameDetails?.instructions || "" }}
              className="text-white/95 text-lg leading-relaxed"
            />
          </div>
          <div className="w-full flex justify-center ad-wrapper">
            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
          </div>
        </div>

        <div className="flex justify-start items-center flex-wrap gap-3 mt-8 max-lg:px-5">
          {(Array.isArray(gameDetails?.tags) ? gameDetails.tags : (typeof gameDetails?.tags === 'string' ? gameDetails.tags.split(/[,|]/).map(t => t.trim()).filter(Boolean) : []))
            .map((tag, index) => (
            <div
              key={index}
              className="px-4 py-1 rounded-[16px] border border-[rgba(220,248,54,0.25)] text-[#DCF836] bg-[rgba(7,18,28,0.45)]"
            >
              {tag}
            </div>
          ))}
        </div>
        
        {/* GOOGLE ADS BELOW TAGS */}
        <div className="w-full flex justify-center ad-wrapper">
          <AdSenseSlot
            slot="7994995968"
            format="fluid"
            layout="in-article"
          />
        </div>
        <style jsx>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ring {
          0% { box-shadow: 0 0 0 0 rgba(220,248,54,0.35); opacity: 1; }
          100% { box-shadow: 0 0 0 22px rgba(220,248,54,0.0); opacity: 0; }
        }
        @keyframes float1 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(6px, -10px, 0); } }
        @keyframes float2 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-8px, 6px, 0); } }
        @keyframes float3 { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(5px, 8px, 0); } }
        @keyframes glowPulse { 0%,100% { filter: drop-shadow(0 0 4px rgba(220,248,54,0.35)); } 50% { filter: drop-shadow(0 0 12px rgba(220,248,54,0.75)); } }
        @keyframes orbDrift1 { 0%,100% { transform: translate(0,0) scale(1); opacity: .28; } 50% { transform: translate(8%, -6%) scale(1.05); opacity: .42; } }
        @keyframes orbDrift2 { 0%,100% { transform: translate(0,0) scale(1); opacity: .24; } 50% { transform: translate(-6%, 8%) scale(1.08); opacity: .38; } }
        @keyframes orbDrift3 { 0%,100% { transform: translate(0,0) scale(1); opacity: .22; } 50% { transform: translate(4%, -4%) scale(1.04); opacity: .32; } }
        @keyframes tagFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes tagSlideIn { 0% { transform: translateX(12px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes barSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        .orb { position: absolute; border-radius: 9999px; filter: blur(28px); }
        .orb.o1 { left: -60px; top: -40px; width: 300px; height: 300px; background: #1f3a5a; animation: orbDrift1 22s ease-in-out infinite; }
        .orb.o2 { right: -80px; bottom: -60px; width: 380px; height: 380px; background: #2a5e9a; animation: orbDrift2 26s ease-in-out infinite; }
        .orb.o3 { left: 35%; top: 20%; width: 200px; height: 200px; background: #0e2236; animation: orbDrift3 24s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
}
