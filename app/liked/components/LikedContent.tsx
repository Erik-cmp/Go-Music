"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";

interface LikedContentProps {
  songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  const onPlay = useOnPlay(songs);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);  
  
  const handleDoubleClick = (id : string) => {    
    onPlay(id);
  };  

  let lastTouchTime = 0;

  const handleTouchStart = (id : string) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastTouchTime;
    
    if (timeDiff < 500) {
      handleDoubleClick(id);
    }

    lastTouchTime = currentTime;
  };

  if (songs.length === 0) {
    return (
      <div
        className="
        flex
        flex-col
        gap-y-2
        w-full
        px-6
        text-neutral-400
      "
      >
        No liked songs.
      </div>
    );
  }

  return (
    <div
      className="
     flex
     flex-col
     gap-y-2
     w-full    
     md:p-6 p-3
     md:px-6 pl-3 pr-4    
    "
    >
      {songs.map((song, i) => (
        <div
          key={song.id}
          className="
           flex 
           items-center 
           md:gap-x-6 
           gap-x-4 
           w-full 
           hover:bg-neutral-800/50 
           rounded-md 
           md:px-4 
           pr-2          
           "           
           onDoubleClick={() => handleDoubleClick(song.id)}    
           onTouchStart={() => handleTouchStart(song.id)}                                 
        >
          <div className="md:block hidden ">
            <p className="text-neutral-400">{i + 1}</p>
          </div>
          <div className="md:w-[50vw] pointer-events-none w-full truncate">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <div className="md:block hidden text-sm text-neutral-400 w-[25vw]">
            {new Date(song.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </div>
          <div className="md:block hidden w-[5vw]">
            <p className="text-sm text-neutral-400">
              {`${Math.floor(song.song_length / 60)}`.padStart(2, "0")}:
              {`${song.song_length % 60}`.padStart(2, "0")}
            </p>
          </div>
          <LikeButton songId={song.id} songTitle={song.title} size={20} variant={2} />
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
