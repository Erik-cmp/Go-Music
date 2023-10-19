"use client"

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

interface SearchContentProps{
  songs: Song[]
}

const SearchContent: React.FC<SearchContentProps> = ({
  songs
}) => {
  const onPlay = useOnPlay(songs);
  if (songs.length === 0){
    return (
      <div className="
        flex
        flex-col
        gap-y-2
        w-full
        md:px-6 px-2
        text-neutral-400
      ">
        No songs found.
      </div>
    )
  }

  return (  
    <div className="flex flex-col md:gap-y-2 w-full md:px-6 pl-3 pr-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-center gap-x-2 w-full"
        >
          <div className="flex-1 w-[70vw]">
            <MediaItem 
              onClick={(id: string) => onPlay(id)}
              data={song}
            />                        
          </div>
          <LikeButton songId={song.id} songTitle={song.title} size={25}/>              
        </div>        
      ))}
    </div>
  );
}
 
export default SearchContent;