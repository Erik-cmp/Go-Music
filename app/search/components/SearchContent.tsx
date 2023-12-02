"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { MdOutlineTimer } from "react-icons/md";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  if (songs.length === 0) {
    return (
      <div
        className="
        flex
        flex-col
        gap-y-2
        w-full
        md:px-6 px-4
        text-neutral-400
        min-h-[80vh]
      "
      >
        No songs found.
      </div>
    );
  }

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

  return (
    <div className="flex flex-col md:gap-y-1 w-full md:px-6 pl-3 pr-4 min-h-[80vh]">
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
          <div className="w-[45%] hover:text-white transition">Title</div>
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
          <div className="w-[5%] flex justify-end"></div>
        </div>
        <div className="w-full h-[1px] rounded-full bg-neutral-700 my-2"></div>
      </div>
      {songs.slice(0, 60).map((song) => (
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
          <div className="md:w-[45%] pointer-events-none w-[95%] truncate">
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
          <div className="w-[5%] flex justify-center">
            <LikeButton
              songId={song.id}
              songTitle={song.title}
              size={24}
              variant={1}
              hasTooltip={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
