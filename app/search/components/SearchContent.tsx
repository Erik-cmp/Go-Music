"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

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
    <div className="flex flex-col md:gap-y-2 w-full md:px-6 pl-3 pr-4">
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
          <LikeButton
            songId={song.id}
            songTitle={song.title}
            size={24}
            variant={1}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
