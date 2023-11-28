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
import { FiPlusCircle } from "react-icons/fi";
import { LuPlus } from "react-icons/lu";
import useDeletePlaylistModal from "@/hooks/useDeletePlaylistModal";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlists }) => {
  const router = useRouter();
  const { isLoading, user, subscription } = useUser();

  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const playlistUploadModal = usePlaylistUploadModal();
  const deletePlaylistModal = useDeletePlaylistModal();

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

  const deletePlaylist = (playlist: Playlist) => {
    return deletePlaylistModal.onOpen(playlist);
  };

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
        <h1
          className="
                text-white
                text-3xl
                sm:text-4xl
                lg:text-6xl
                font-bold                                                                               
              "
        >
          Your Playlists
        </h1>
        <p>You have no playlists.</p>
        <Button
          className="w-[110px] md:text-base flex gap-x-2 items-center justify-center"
          onClick={onClick}
        >          
          Add New         
        </Button>
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
      <div className="flex justify-between items-center w-full p-2">
        <h1
          className="
                text-white
                text-3xl
                sm:text-4xl
                lg:text-6xl
                font-bold                                                                               
              "
        >
          Your Playlists
        </h1>
        <Button
          className="w-[110px] md:text-base flex gap-x-2 items-center justify-center"
          onClick={onClick}
        >          
          Add New         
        </Button>
      </div>
      {playlists.map((playlist, i) => (
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
           cursor-pointer
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
            onClick={() => {
              console.log(playlist);
              deletePlaylist(playlist);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PlaylistContent;
