"use client";
import { Playlist } from "@/types";
import { useState } from "react";
import { FaCaretRight } from "react-icons/fa6";

interface AddToPlaylistProps {
  playlist: Playlist[];
}

const AddToPlaylist: React.FC<AddToPlaylistProps> = ({ playlist }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="      
      bg-neutral-800 
      p-1
      rounded 
      w-[160px] 
      shadow 
      items-center 
      justify-center                 
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className={`
            absolute
            bottom-0
            left-full
            bg-neutral-800
            p-1
            rounded
            shadow
            w-[200px]
          `}
        >
          {playlist.map((playlist) => (
            // TODO: When this is clicked add song to playlist
            <div key={playlist.id} className="flex gap-y-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded shadow transition">
              <p className="text-white truncate">
                {playlist.title}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex p-2 bg-neutral-800 hover:bg-neutral-700 transition shadow rounded justify-between items-center">
        <p className="text-white">Add to playlist</p>
        <FaCaretRight size={21} />
      </div>
    </div>
  );
};

export default AddToPlaylist;
