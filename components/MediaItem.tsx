"use client";

import Image from "next/image";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
  variant: string;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick, variant }) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  if (variant === "1") {
    return (
      <div
        onClick={handleClick}
        className="
          flex
          items-center
          gap-x-3
          cursor-pointer
          hover:bg-neutral-800/50
          w-full
          p-2
          rounded-md
        "
      >
        <div
          className="
          relative
          rounded-md
          min-h-[48px]
          min-w-[48px]
          overflow-hidden
        "
        >
          <Image
            fill
            sizes="48px"
            src={imageUrl || "/images/liked.png"}
            alt="Media Item"
            className="object-cover"
          />
        </div>
        <div
          className="
          flex
          flex-col
          gap-y-1
          overflow-hidden       
        "
        >
          <p className="text-white truncate">{data.title}</p>
          <p className="text-neutral-400 text-sm truncate">{data.author}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="
        flex
        items-center
        gap-x-3
        cursor-pointer        
        p-1.5
        w-full        
        rounded-md
      "
    >
      <div
        className="
        relative
        rounded-md
        min-h-[40px]
        min-w-[40px]
        overflow-hidden
      "
      >
        <Image
          fill
          sizes="40px"
          src={imageUrl || "/images/liked.png"}
          alt="Media Item"
          className="object-cover"
        />
      </div>
      <div
        className="
        flex
        flex-col
        gap-y-1
        overflow-hidden       
      "
      >
        <p className="text-white text-sm truncate">{data.title}</p>
        <p className="text-neutral-400 text-xs truncate">{data.author}</p>
      </div>
    </div>
  );
};

export default MediaItem;
