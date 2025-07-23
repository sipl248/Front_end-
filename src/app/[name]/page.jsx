import { GAMES } from "@/components/Constant";
import GameDetail from "@/components/GameDetail";
import Games from "@/components/Games";
import axios from "axios";

export default async function Page({ params }) {
  const { name } = params;
  let gameDetails = null;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}games/${name}`
    );
    gameDetails = response?.data?.data?.game;
  } catch (error) {
    console.error("Error fetching game details:", error);
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

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}games/${name}`
    );
    const gameDetails = response?.data?.data?.game;

    return {
      title: `Play ${
        gameDetails?.title || name
      } - Free Online Browser Game to Play`,
      description: `Enjoy playing ${
        gameDetails?.title || name
      } on Pokiifuns Game!`,
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);

    return {
      title: `Play ${name} - Pokiifuns Game`,
      description: `Enjoy playing ${name} on Pokiifuns Game!`,
    };
  }
}
