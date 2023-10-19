"use client";

import { TbPlaylist } from "react-icons/tb";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { BsPlus } from "react-icons/bs";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
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

  if (songs.length === 0){
    return (
      <div className="
        flex
        flex-col
        gap-y-2
        w-full                
        text-neutral-400                
        text-xs
      ">
        Your Library Is Empty, Upload a Song to Get Started!
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div
        className="
          flex
          items-center
          justify-between
          md:px-2 px-1
          pt-4
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-x-2
          "
        >
          <TbPlaylist className="text-neutral-400" size={26} />
          <p
            className="
              text-neutral-400
              font-medium
              text-md
            "
          >
            Your Songs
          </p>
        </div>
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
        "
        >
          <BsPlus onClick={onClick} size={34} className="text-black" />
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
        md:gap-y-2 gap-y-0
        mt-4        
        w-full
      "
        >
          {songs.map((item) => (
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              key={item.id}
              data={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
