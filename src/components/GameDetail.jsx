"use client";
import Image from "next/image";
import Script from "next/script";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function GameDetail({ gameDetails, name }) {
  const [showIframe, setShowIframe] = useState(false);
  const router = useRouter();
  React.useEffect(() => {
    if (showIframe) {
      document.body.classList.add('overflow-hidden');
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('modal-open');
    };
  }, [showIframe]);

  return (
    <div
      className={`min-h-screen -mt-20 text-white bg-[url(https://pokiigame.com/_next/static/media/footer.5bdee055.jpg)] h-auto bg-no-repeat bg-fixed`}
    >
      <div className="py-20  px-[20.2rem]  max-lg:px-5 max-md:px-0">
        <div className="relative flex justify-between items-center sm:border-transparent  max-md:flex-col max-lg:gap-10 max-xl:gap-4 max-sm:!gap-0">
          <Image
            src={gameDetails?.thumb || "/assets/pokii_game.webp"}
            alt="background-poster"
            className="absolute inset-0 w-full h-[580px]  object-cover  rounded-[20px] max-sm:rounded-none"
            width={600}
            height={600}
          />
          <div className="absolute inset-0 h-[580px] rounded-[20px] max-sm:rounded-none bg-[linear-gradient(180deg,rgba(2,12,23,0.2)_0%,rgba(2,12,23,0.75)_55%,rgba(2,12,23,0.95)_100%)]"></div>

          <div className="relative z-[5] w-full py-24 max-md:py-6 flex justify-center items-center flex-col">
            <h1 className="text-[56px] max-xl:text-[44px] max-md:text-[32px] font-extrabold text-center tracking-wide mb-3">
              <span className="bg-gradient-to-r from-[#DCF836] via-white to-[#DCF836] bg-clip-text text-transparent" style={{ backgroundSize: '200% 200%', animation: 'shine 6s linear infinite' }}>
                {gameDetails?.title || name}
              </span>
            </h1>
            <div className="rounded-[22px] border border-[rgba(220,248,54,0.25)] bg-[rgba(7,18,28,0.55)] backdrop-blur-md p-4 flex flex-col items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <Image
                src={gameDetails?.thumb || "/assets/pokii_game.webp"}
                alt="game-poster"
                className="w-[200px] h-[200px] max-md:h-[160px] max-md:w-[160px] max-sm:h-[130px] max-sm:w-[150px] rounded-[16px] transition-transform duration-500 will-change-transform hover:rotate-1 hover:scale-[1.02]"
                width={200}
                height={200}
              />
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
              <div className="fixed top-0 left-0 z-[9999] w-full h-full bg-black/90 backdrop-blur-sm flex justify-center items-center">
                <div className="relative w-[100%] h-[100%] max-w-full">
                  <iframe
                    src={gameDetails?.url || "#"}
                    className="w-full h-full rounded-none"
                    allowFullScreen
                  />
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.history.length > 1) {
                        router.back();
                      } else {
                        setShowIframe(false);
                      }
                    }}
                    className="absolute z-[10000] cursor-pointer top-4 right-4 bg-red-600 text-white size-8 flex justify-center items-center rounded-full text-sm"
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className="game-detail">
          <div className="game-ad">
            <Script id="game-detail-ad-config" strategy="afterInteractive">
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
            <Script
              strategy="afterInteractive"
              src="//www.highperformanceformat.com/33c38de2503eaee4251a5962d435100d/invoke.js"
            />
          </div>
        </div> */}
        {/* html */}

        <div className="max-lg:px-5 mt-8 grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-[rgba(220,248,54,0.18)] bg-[rgba(7,18,28,0.55)] p-5">
            <h2 className="text-2xl font-semibold text-[#DCF836] mb-3">About this game</h2>
            <div
              dangerouslySetInnerHTML={{ __html: gameDetails?.description || "" }}
              className="text-white/95 text-lg leading-relaxed"
            />
          </div>
          <div className="rounded-2xl border border-[rgba(220,248,54,0.18)] bg-[rgba(7,18,28,0.55)] p-5">
            <h2 className="text-2xl font-semibold text-[#DCF836] mb-3">Instructions</h2>
            <div
              dangerouslySetInnerHTML={{ __html: gameDetails?.instructions || "" }}
              className="text-white/95 text-lg leading-relaxed"
            />
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
        `}</style>
      </div>
    </div>
  );
}
