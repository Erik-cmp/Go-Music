"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MdOutlineTimer } from "react-icons/md";

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

  const handleDoubleClick = (id: string) => {
    onPlay(id);
  };

  let lastTouchTime = 0;

  const handleTouchStart = (id: string) => {
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
        min-h-[80vh]
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
     gap-y-1
     w-full    
     md:p-6 p-3
     md:px-6 pl-3 pr-3    
     min-h-[80vh]
    "
    >
      <div
        className="                  
         flex-col
         items-center 
         justify-center         
         w-full                
         md:flex
         hidden
         pr-2          
         "
      >
        <div className="flex w-full items-center justify-center gap-x-4 px-4 text-sm font-medium text-neutral-400">
          <div className="w-[1.25%] hover:text-white transition">#</div>
          <div className="w-[45%] hover:text-white transition flex justify-start">
            Title
          </div>
          <div className="w-[35%] flex justify-center hover:text-white transition">
            Date Uploaded
          </div>
          <div className="w-[15%] text-neutral-400 flex justify-center hover:text-white transition">
            <Tippy
              content={<div style={{ fontWeight: "600" }}>Duration</div>}
              delay={[100, 0]}
              touch={false}
            >
              <div>
                <MdOutlineTimer size={18} />
              </div>
            </Tippy>
          </div>
          <div className="w-[4%] flex justify-end"></div>
        </div>
        <div className="w-full h-[1px] rounded-full bg-neutral-700 my-2"></div>
      </div>
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
          <div className="md:block hidden w-[0.5%]">
            <p className="text-neutral-400">{i + 1}</p>
          </div>
          <div className="md:w-[45%] pointer-events-none w-[90%] truncate">
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              data={song}
              variant="1"
            />
          </div>
          <div className="md:flex hidden text-sm text-neutral-400 w-[35%] justify-center">
            {new Date(song.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </div>
          <div className="md:flex hidden w-[15%] justify-center">
            <p className="text-sm text-neutral-400">
              {`${Math.floor(song.song_length / 60)}`.padStart(2, "0")}:
              {`${song.song_length % 60}`.padStart(2, "0")}
            </p>
          </div>
          <div className="flex md:w-[4%] w-[10%] justify-end">
            <LikeButton
              songId={song.id}
              songTitle={song.title}
              size={20}
              variant={2}
              hasTooltip={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
