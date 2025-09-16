import Games from "@/components/Games";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <div className="min-h-screen -mt-20 relative">
      <AnimatedBackground />
      <div className="relative z-[1]">
        <Games />
      </div>
    </div>
  );
}
