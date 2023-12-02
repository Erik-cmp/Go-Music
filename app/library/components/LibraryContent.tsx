"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { BsPlus } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import Button from "@/components/Button";
import useDeleteModal from "@/hooks/useDeleteModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MdOutlineTimer } from "react-icons/md";

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
        min-h-[80vh]
      "
      >
        <p className="text-sm text-neutral-400">
          Your Library Is Empty, Upload a Song to Get Started!
        </p>
        <Button
          className="w-[150px] md:text-base flex gap-x-2 items-center justify-center"
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
    <div className="flex flex-col min-h-[80vh]">
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
            items-end
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
            className="w-[150px] md:text-base flex gap-x-2 items-center justify-center"
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
     gap-y-1
     w-full    
     pt-4 
    "
        >
          <div
            className="                  
         flex-col
         items-center 
         justify-center         
         w-full                
         md:flex
         hidden
         pr-2 
         pt-4
         "
          >
            <div className="flex w-full items-center justify-center gap-x-4 px-4 text-sm font-medium text-neutral-400">
              <div className="w-[1.25%] hover:text-white transition">#</div>
              <div className="w-[45%] hover:text-white transition flex justify-start">Title</div>
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
              <div className="w-[4%] flex justify-end"></div>
            </div>
            <div className="w-full h-[1px] rounded-full bg-neutral-700 my-2"></div>
          </div>
          {songs.map((song, i) => (
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
              <div className="md:block hidden w-[0.5%]">
                <p className="text-neutral-400">{i + 1}</p>
              </div>
              <div className="md:w-[45%] pointer-events-none w-[90%] truncate">
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
              {/* Delete Song on Click */}
              <Tippy
                content={<div style={{ fontWeight: "600" }}>Delete Song</div>}
                delay={[100, 0]}
                touch={false}
              >
                <div className="md:w-[4%] w-[10%] flex justify-end">
                  <IoCloseCircleOutline
                    size={24}
                    className="text-neutral-400 hover:opacity-75 cursor-pointer"
                    onClick={() => deleteSong(song)}
                  />
                </div>
              </Tippy>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
