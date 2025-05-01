"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const NINJA_SESSION_ID = 2;

type Team = {
  name: string;
  level: string;
  ninjaSessionId: number;
};

type Game = {
  team1: string;
  team2: string;
  team1Points: number;
  team2Points: number;
  group: string;
  ninjaSessionId: number;
};

const SubmitScores = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");
  const [team1Points, setTeam1Points] = useState<number | undefined>(undefined);
  const [team2Points, setTeam2Points] = useState<number | undefined>(undefined);
  const [ninjaPoints, setNinjaPoints] = useState<number | undefined>(undefined);
  const [group, setGroup] = useState<string>("Inter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetch("/data/teams.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeams(
          data.teams.filter(
            (team: Team) => team.ninjaSessionId === NINJA_SESSION_ID
          )
        );
      } catch (e: any) {
        setError(e.message || "Could not load teams.");
      }
    };

    loadTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !team1 ||
      !team2 ||
      team1Points === undefined ||
      team2Points === undefined ||
      //   ninjaPoints === undefined ||
      !group
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const newGame: Game = {
      team1,
      team2,
      team1Points,
      team2Points,
      group,
      ninjaSessionId: NINJA_SESSION_ID
    };

    const player1GameData = {
      name: team1.split("+")[0].trim(),
      matchWon: team1Points === 11,
      matchPointsWon: team1Points,
      matchPointsLost: team2Points,
      ninjaSessionId: NINJA_SESSION_ID
      //   ninjaPoints: team1Points === 11 ? ninjaPoints : 0
    };

    const player2GameData = {
      name: team1.split("+")[1].trim(),
      matchWon: team1Points === 11,
      matchPointsWon: team1Points,
      matchPointsLost: team2Points,
      ninjaSessionId: NINJA_SESSION_ID
      //   ninjaPoints: team1Points === 11 ? ninjaPoints : 0
    };

    const player3GameData = {
      name: team2.split("+")[0].trim(),
      matchWon: team2Points === 11,
      matchPointsWon: team2Points,
      matchPointsLost: team1Points,
      ninjaSessionId: NINJA_SESSION_ID
      //   ninjaPoints: team2Points === 11 ? ninjaPoints : 0
    };

    const player4GameData = {
      name: team2.split("+")[1].trim(),
      matchWon: team2Points === 11,
      matchPointsWon: team2Points,
      matchPointsLost: team1Points,
      ninjaSessionId: NINJA_SESSION_ID
      //   ninjaPoints: team2Points === 11 ? ninjaPoints : 0
    };

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          player1GameData,
          player2GameData,
          player3GameData,
          player4GameData
        ])
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form fields upon successful submission
      //setTeam1("");
      //   setTeam2("");
      //   setTeam1Points(undefined);
      //   setTeam2Points(undefined);
      //   //setGroup("");
      //   setNinjaPoints(undefined);

      alert("Score submitted successfully!"); // replace with toast
    } catch (e: any) {
      setError(e.message || "Could not submit score.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = useCallback(
    (level: string, team1?: string) => {
      return team1
        ? teams
            .filter((team) => team.ninjaSessionId === NINJA_SESSION_ID)
            .filter((team) => team.level === level)
            .filter((team) => team.name !== team1)
        : teams.filter((team) => team.level === level);
    },
    [teams]
  );

  return (
    <>
      <div className='container mx-auto py-10 px-4'>
        <h1 className='text-2xl font-bold mb-6'>Submit Scores</h1>
        {error && <div className='text-red-500 mb-4'>{error}</div>}
        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div>
            <Label htmlFor='group'>Group</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger id='group'>
                <SelectValue placeholder='Select Group' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Pro'>Pro</SelectItem>
                <SelectItem value='Inter'>Inter</SelectItem>
                <SelectItem value='Beg'>Beg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='team1'>Team 1</Label>
            <Select value={team1} onValueChange={setTeam1}>
              <SelectTrigger id='team1'>
                <SelectValue placeholder='Select Team 1' />
              </SelectTrigger>
              <SelectContent>
                {group &&
                  filteredTeams(group).map((team) => (
                    <SelectItem key={team.name} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                {!group && (
                  <SelectItem value='na' disabled>
                    Select Group first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='team2'>Team 2</Label>
            <Select value={team2} onValueChange={setTeam2}>
              <SelectTrigger id='team1'>
                <SelectValue placeholder='Select Team 2' />
              </SelectTrigger>
              <SelectContent>
                {team1 &&
                  filteredTeams(group, team1).map((team) => (
                    <SelectItem key={team.name} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                {!team1 && (
                  <SelectItem value='na' disabled>
                    Select Team 1 first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='team1Points'>Team 1 Points</Label>
            <Input
              type='number'
              id='team1Points'
              value={team1Points !== undefined ? team1Points.toString() : ""}
              onChange={(e) => setTeam1Points(Number(e.target.value))}
              placeholder='Enter Team 1 Points'
            />
          </div>
          <div>
            <Label htmlFor='team2Points'>Team 2 Points</Label>
            <Input
              type='number'
              id='team2Points'
              value={team2Points !== undefined ? team2Points.toString() : ""}
              onChange={(e) => setTeam2Points(Number(e.target.value))}
              placeholder='Enter Team 2 Points'
            />
          </div>
          {/* <div>
            <Label htmlFor='team2Points'>Ninja Points</Label>
            <Input
              type='number'
              id='ninjaPoints'
              value={ninjaPoints?.toString() ?? ""}
              onChange={(e) => setNinjaPoints(Number(e.target.value))}
              placeholder='Enter Ninja Points'
            />
          </div> */}
          <Button type='submit' disabled={loading}>
            {loading ? "Submitting..." : "Submit Score"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default SubmitScores;
