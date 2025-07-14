import { GAMES } from "@/components/Constant";
import GameDetail from "@/components/GameDetail";
import Games from "@/components/Games";
import axios from "axios"; // <-- Import axios

export default async function page({ params }) {
  const { name } = params;
  console.log("name", name);
  let gameDetails = null;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}games/${name}`
    );
    gameDetails = response?.data?.data?.game;
    console.log("gameDetails", gameDetails);
  } catch (error) {
    console.log("error", error);
  }
  return (
    <>
      <GameDetail {...{ gameDetails, name }} />
      <div className="bg-[#020C17]">
        <Games />
      </div>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { name } = params;
  return {
    title: `Play ${name} - Pokiifuns Game`,
    description: `Enjoy playing ${name} on Pokiifuns Game!`,
  };
}
