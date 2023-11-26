"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/hooks/useUser";
``;
import { Playlist } from "@/types";
import PlaylistItem from "@/components/PlaylistItem";
import { IoCloseCircleOutline } from "react-icons/io5";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlists }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (playlists.length === 0) {
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
        You have no playlists.
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
      {[...playlists].reverse().map((playlist, i) => (
        <div
          key={playlist.id}
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
        >
          <div className="md:block hidden ">
            <p className="text-neutral-400">{i + 1}</p>
          </div>
          <div className="lg:w-[72.5vw] md:w-[60vw] pointer-events-none w-full truncate">
            <PlaylistItem onDoubleClick={() => {}} data={playlists[i]} />
          </div>
          <div className="md:block hidden text-sm text-neutral-400 lg:w-[7.5vw] md:w-[20vw]">
            {new Date(playlist.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </div>
          {/* Delete Playlist when Clicked */}
          <IoCloseCircleOutline
            size={24}
            className="text-neutral-400 hover:opacity-75 cursor-pointer"
            onClick={() => {}}
          />
        </div>
      ))}
    </div>
  );
};

export default PlaylistContent;
