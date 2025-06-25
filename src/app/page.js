import Games from "@/components/Games";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen -mt-20  bg-[url(https://pokiigame.com/_next/static/media/footer.5bdee055.jpg)] h-auto bg-no-repeat bg-fixed">
      <Games />
    </div>
  );
}
