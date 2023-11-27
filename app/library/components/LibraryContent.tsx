"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { BsPlus } from "react-icons/bs";
import { LuPlus } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@/components/Button";
import DeleteModal from "@/components/DeleteModal";
import useDeleteModal from "@/hooks/useDeleteModal";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const deleteModal = useDeleteModal();
  const { user, subscription } = useUser();

  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return uploadModal.onOpen();
  };

  const deleteSong = (song: Song) => {
    return deleteModal.onOpen(song);
  };

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
        gap-y-4
        w-full                                          
        py-2
      "
      >
        <p className="text-sm text-neutral-400">
          Your Library Is Empty, Upload a Song to Get Started!
        </p>
        <Button
          className="md:w-[140px] w-[120px] md:text-base text-sm flex gap-x-2 items-center justify-center"
          onClick={onClick}
        >
          Add Song
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
    <div className="flex flex-col">
      <div
        className="
          flex          
          space-between
          items-start
          justify-between          
          pt-2          
        "
      >
        <div
          className="
            flex
            md:justify-start
            flex-between
            items-center
            w-full
            gap-x-2            
          "
        >
          <p
            className="
              text-neutral-400
              font-medium              
              md:text-2xl
              text-xl
              w-full
            "
          >
            Uploaded Songs
          </p>
          <Button
            className="md:w-[140px] w-[120px] md:text-base text-sm flex gap-x-2 items-center justify-center"
            onClick={onClick}
          >
            Add Song
          </Button>
        </div>
      </div>
      <div
        className="
        flex
        w-full
        px-0
      "
      >
        <div
          className="
     flex
     flex-col
     gap-y-2
     w-full    
     pt-4 
    "
        >
          {[...songs].reverse().map((song, i) => (
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
           cursor-pointer
           "
              onDoubleClick={() => handleDoubleClick(song.id)}
              onTouchStart={() => handleTouchStart(song.id)}
            >
              <div className="md:block hidden ">
                <p className="text-neutral-400">{i + 1}</p>
              </div>
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
              {/* Delete Song on Click */}
              <IoCloseCircleOutline
                size={24}
                className="text-neutral-400 hover:opacity-75 cursor-pointer"
                onClick={() => deleteSong(song)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
