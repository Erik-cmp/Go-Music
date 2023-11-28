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
import { Song } from "@/types";
import Image from "next/image";
import useLoadPlaylistImage from "@/hooks/useLoadPlaylistImage";

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

  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const imageUrl = useLoadPlaylistImage(playlists)

  // const totalSongs = songs.length;

  // const totalDuration = songs.reduce((sum, song) => sum + song.song_length, 0);

  // const hours = Math.floor(totalDuration / 3600);
  // const minutes = Math.floor((totalDuration % 3600) / 60);  

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return playlistUploadModal.onOpen();
  };

  const handleClick = (i: number) => {
    if (!user) {
      return authModal.onOpen();
    }

    setIsOpen(true);
    setIndex(i);
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

  if (!isOpen) {
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
            onDoubleClick={() => handleClick(i)}
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
              <PlaylistItem data={playlists[i]} href={playlist.id} />
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
  }

  return (
    <div>
        <div className="md:p-6 p-4">
          <div
            className="
            flex            
            md:flex-row flex-col
            items-center
            gap-x-5
          "
          >
            <div
              className="
              relative
              h-40
              w-40
              lg:h-44
              lg:w-44              
            "
            >
              <Image
                fill
                alt="Playlist"
                className="object-cover"
                src={imageUrl[index] as any}
                sizes="300px"
              />
            </div>
            <div
              className="
              flex
              flex-col
              gap-y-2
              mt-4
              md:mt-0
              md:items-start items-center
              w-full              
            "
            >
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1
                className="
                text-white
                text-3xl
                sm:text-3xl
                lg:text-6xl
                font-bold         
                md:text-start
                text-center                                   
              "
              >
                {playlists[index].title}
              </h1>
              <p className="hidden md:block text-sm text-neutral-400">{playlists[index].description}</p>
              {/* <p className="text-sm">
                {totalSongs} {totalSongs === 1 ? "song" : "songs"},                
                &nbsp;
                <span className="text-neutral-400">                  
                  {hours > 0 ? `${hours} hr ` : ""}
                  {minutes} min
                </span>
              </p> */}
            </div>
          </div>
        </div>
        {/* PlaylistSongs component here with props of songs */}
    </div>
  );
};

export default PlaylistContent;
