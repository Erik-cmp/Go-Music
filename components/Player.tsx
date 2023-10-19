"use client"

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId){
    return (
      <div className="
      fixed
      bottom-0
      bg-black
      w-full
      md:py-2 py-1
      md:h-[80px] h-[72px]
      md:px-4 px-1   
      flex
      items-center
      justify-center
      text-neutral-400   
      md:text-sm text-xs
    ">
      No active song, play something to open the player!
    </div>      
    );
  }

  return (  
    <div className="
      fixed
      bottom-0
      bg-black
      w-full
      md:py-2 py-1
      md:h-[80px] h-auto
      md:px-4 px-1      
      flex
    ">
      <PlayerContent 
        key={songUrl}
        song={song}
        songUrl={songUrl}
      />
    </div>
  );
}
 
export default Player;