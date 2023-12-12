"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@/hooks/useUser";
``;
import { Playlist } from "@/types";
import PlaylistItem from "@/components/PlaylistItem";
import { IoCloseCircleOutline } from "react-icons/io5";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import useAuthModal from "@/hooks/useAuthModal";
import usePlaylistUploadModal from "@/hooks/usePlaylistUploadModal";
import Button from "@/components/Button";
import useDeletePlaylistModal from "@/hooks/useDeletePlaylistModal";
import useLoadPlaylistImage from "@/hooks/useLoadPlaylistImage";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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

  const imageUrl = useLoadPlaylistImage(playlists);

  let lastTouchTime = 0;

  const handleTouchStart = (id: string) => {
    console.log("im called");
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastTouchTime;

    if (timeDiff < 500) {
      console.log("called");
      redirect(id);
    }

    lastTouchTime = currentTime;
  };

  const redirect = (href: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (href === "liked") router.push("liked");
    else router.push("playlist/" + href);
  };

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return playlistUploadModal.onOpen();
  };

  const handleClick = (id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    router.push(`playlist/${id}`);
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
        min-h-[80vh]
      "
      >
        <h1
          className="
                  text-white                  
                  md:text-5xl                                                                                          
                  text-3xl
                  block
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
       gap-y-4
       w-full           
       md:px-6 pl-3 pr-3  
       min-h-[80vh]  
      "
    >
      <div className="flex justify-between items-center w-full p-2">
        <h1
          className="
                  text-white                  
                  md:text-5xl                                                                                          
                  text-3xl
                  block
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
          <div className="w-[55%] hover:text-white transition flex justify-start">
            Title
          </div>
          <div className="w-[40%] flex justify-center hover:text-white transition">
            Date Uploaded
          </div>
          <div className="w-[4%] flex justify-end"></div>
        </div>
        <div className="w-full h-[1px] rounded-full bg-neutral-700 my-2"></div>
      </div>
      {playlists.map((playlist, i) => (
        <div
          key={playlist.id}
          onDoubleClick={() => handleClick(playlist.id)}
          onTouchStart={() => handleTouchStart(playlist.id)}
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
          <div className="md:w-[55%] pointer-events-none w-[90%] truncate">
            <PlaylistItem data={playlists[i]} href={playlist.id} variant="1" />
          </div>
          <div className="md:flex hidden text-sm text-neutral-400 w-[40%] justify-center">
            {new Date(playlist.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </div>
          <Tippy
            content={<div style={{ fontWeight: "600" }}>Delete Playlist</div>}
            delay={[100, 0]}
            touch={false}
          >
            <div className="md:w-[4%] flex justify-end w-[10%]">
              <IoCloseCircleOutline
                size={24}
                className="text-neutral-400 hover:opacity-75 cursor-pointer"
                onClick={() => {
                  console.log(playlist);
                  deletePlaylist(playlist);
                }}
              />
            </div>
          </Tippy>
        </div>
      ))}
    </div>
  );
};

export default PlaylistContent;
