import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import HomeButton from "~/components/homeButton";
import LoadingScreen from "~/components/loadingScreen";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import IGameState from "~/game/state";
import useNetwork from "~/hooks/network";

export default function JoinGame() {
  const router = useRouter();
  const network = useNetwork();

  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<IGameState[]>([]);

  useEffect(() => {
    network.subscribeToPublicGames(games => {
      setLoading(false);
      setGames(games);
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-100 h-100 flex justify-center items-center overflow-y-scroll relative bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <HomeButton className="absolute top-1 right-1" />
      <div className="w-90 h-100 pv4 flex flex-column items-center justify-between">
        {!games.length && (
          <>
            <div>
              <Txt
                className="nowrap"
                size={TxtSize.MEDIUM}
                value="No available room"
              />
            </div>
            <Button
              className="ma2 flex-1"
              size={ButtonSize.LARGE}
              text="Create a room"
              onClick={() => router.push("/new-game")}
            />
          </>
        )}
        {games.length > 0 && (
          <div>
            <Txt
              className="nowrap mb6"
              size={TxtSize.LARGE}
              value="Available rooms"
            />
            {games.map(game => (
              <div
                key={game.id}
                className="flex justify-between items-center mb3 w-100 mt3"
              >
                <Txt
                  className="mr4 silver"
                  value={`${game.players.length} / ${game.options.playersCount}`}
                />
                <Txt
                  className="flex-grow-1"
                  value={`${game.players.map(p => p.name).join(", ")}`}
                />
                <Button
                  className="ml2 flex justify-center"
                  size={ButtonSize.SMALL}
                  text="Join"
                  onClick={() => router.push(`/play?gameId=${game.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}