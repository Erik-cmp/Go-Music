"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/hooks/useUser";
``;
import { Playlist } from "@/types";
import PlaylistItem from "@/components/PlaylistItem";
import { IoCloseCircleOutline } from "react-icons/io5";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import useAuthModal from "@/hooks/useAuthModal";
import usePlaylistUploadModal from "@/hooks/usePlaylistUploadModal";
import Button from "@/components/Button";
import { BsPlus } from "react-icons/bs";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlists }) => {
  const router = useRouter();
  const { isLoading, user, subscription } = useUser();

  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const playlistUploadModal = usePlaylistUploadModal();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return playlistUploadModal.onOpen();
  };

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
        gap-y-4
        w-full
        px-5        
        text-neutral-400
      "
      >
        <p>You have no playlists.</p>
        <Button className="md:block hidden w-[150px]" onClick={onClick}>
          Add Playlist
        </Button>
        <div
        style={{
          position: "fixed",
          bottom: "85px",
          right: "12px",
        }}
        className="
          bg-blue-500
          rounded-full
          w-12
          h-12
          flex
          items-center
          justify-center
          md:hidden          
        "
      >
        <BsPlus onClick={onClick} size={34} className="text-black" />
      </div>        
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
      <div
        style={{
          position: "fixed",
          bottom: "85px",
          right: "12px",
        }}
        className="
          bg-blue-500
          rounded-full
          w-12
          h-12
          flex
          items-center
          justify-center
          md:hidden          
        "
      >
        <BsPlus onClick={onClick} size={34} className="text-black" />
      </div>      
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
