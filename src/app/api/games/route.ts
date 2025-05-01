import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { timeStamp } from "console";

const NINJA_SESSION_ID = 2;

type Game = {
  name: string;
  ninjaSessionId: number;
  matchWon: boolean;
  timeStamp: number;
  ninjaPoints: number;
};

type PlayerScore = {
  name: string;
  matchWon: boolean;
  matchPointsWon: number;
  matchPointsLost: number;
  ninjaSessionId: number;
  ninjaPoints: number;
};

export async function POST(req: NextRequest) {
  try {
    const matchScores: PlayerScore[] = await req.json();

    // Get the absolute path to the games.json file
    const filePath = path.join(process.cwd(), "public/data/games2.json");

    // Read the existing games from the file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const existingGames = JSON.parse(fileContent);

    const newGames = [];

    let team1LatestGame = existingGames.games
      .filter((game: Game) => {
        return (
          game.name === matchScores[0].name &&
          game.ninjaSessionId === NINJA_SESSION_ID
        );
      })
      .sort((a: Game, b: Game) => {
        return b.timeStamp - a.timeStamp;
      });

    let team2LatestGame = existingGames.games
      .filter((game: Game) => {
        return (
          game.name === matchScores[2].name &&
          game.ninjaSessionId === NINJA_SESSION_ID
        );
      })
      .sort((a: Game, b: Game) => {
        return b.timeStamp - a.timeStamp;
      });

    const isBountyGame =
      team1LatestGame.ninjaPoints === 20 || team2LatestGame.ninjaPoints === 20;

    // i =  player index
    for (let i = 0; i < matchScores.length; i++) {
      let playerGame = { ...matchScores[i], timeStamp: Date.now() };

      let playerSessionGames = existingGames.games
        .filter((game: Game) => {
          return (
            game.name === playerGame.name &&
            game.ninjaSessionId === NINJA_SESSION_ID
          );
        })
        .sort((a: Game, b: Game) => {
          return b.timeStamp - a.timeStamp;
        });

      if (playerSessionGames.length > 0) {
        const playerLatestGame =
          i === 0 || i === 1 ? team1LatestGame[0] : team2LatestGame[0];

        // Case 1 - First match of the session for a player
        // if (playerLatestGame.ninjaPoints === 0 && playerGame.matchWon) {
        //   playerGame.ninjaPoints = 10;
        // } else

        if (
          // Case 3 - Bounty win match of the session for a player
          isBountyGame &&
          playerGame.matchWon
        ) {
          let bonusPoints =
            i === 0 || i === 1
              ? team2LatestGame[0].ninjaPoints
              : team1LatestGame[0].ninjaPoints;

          if (bonusPoints > 0) {
            bonusPoints += 5;
          } else {
            bonusPoints = 10;
          }

          playerGame.ninjaPoints =
            playerLatestGame.ninjaPoints > 0
              ? playerLatestGame.ninjaPoints + 5 + bonusPoints
              : 10 + bonusPoints;
        } else if (
          // Case 2 - Consecutive win match of the session for a player
          playerLatestGame.ninjaPoints > 0 &&
          playerLatestGame.ninjaPoints < 20 &&
          playerGame.matchWon
        ) {
          playerGame.ninjaPoints = playerLatestGame.ninjaPoints + 5;
        } else {
          // Case 4 - Match lost for a player
          playerGame.ninjaPoints = 0;
        }
      } else {
        // Case 1 - First match of the session for a player
        playerGame.ninjaPoints = playerGame.matchWon ? 10 : 0;
      }

      newGames.push(playerGame);
    }

    // Append the new game to the array
    existingGames.games.push(...newGames);

    // Write the updated games array back to the file
    await fs.writeFile(
      filePath,
      JSON.stringify(existingGames, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      { message: "Game added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding game:", error);
    return NextResponse.json({ message: "Error adding game" }, { status: 500 });
  }
}
