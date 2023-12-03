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
          p-1
          rounded
        "
      >
        <div
          className="
          relative
          rounded
          min-h-[40px]
          min-w-[40px]
          overflow-hidden
        "
        >
          <Image
            fill
            sizes="40px"
            src={imageUrl || "/images/song.png"}
            alt="Media Item"
            className="object-cover"
          />
        </div>
        <div
          className="
          flex
          flex-col          
          overflow-hidden       
        "
        >
          <p className="text-white first-letter:truncate">{data.title}</p>
          <p className="text-neutral-400 text-sm truncate">{data.author}</p>
        </div>
      </div>
    );
  }

  if (variant === "2") {
    return (
      <div
        onClick={handleClick}
        className="
          flex
          items-center
          gap-x-3
          cursor-pointer        
          p-1.5
          pl-2
          w-full        
          rounded-sm
        "
      >
        <div
          className="
          relative
          rounded-sm
          min-h-[40px]
          min-w-[40px]
          overflow-hidden
        "
        >
          <Image
            fill
            sizes="40px"
            src={imageUrl || "/images/song.png"}
            alt="Media Item"
            className="object-cover"
          />
        </div>
        <div
          className="
          flex
          flex-col          
          overflow-hidden       
        "
        >
          <p className="text-white text-sm truncate">{data.title}</p>
          <p className="text-neutral-400 text-xs truncate">{data.author}</p>
        </div>
      </div>
    );
  }

  if(variant === "3"){
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
          rounded
          py-1
          pr-2
        "
      >
        <div
          className="
          relative
          rounded
          min-h-[56px]
          min-w-[56px]
          overflow-hidden
        "
        >
          <Image
            fill
            sizes="56px"
            src={imageUrl || "/images/song.png"}
            alt="Media Item"
            className="object-cover"
          />
        </div>
        <div
          className="
          flex
          flex-col          
          overflow-hidden          
          justify-center
          h-full       
        "
        >
          <p className="text-white truncate text-sm">{data.title}</p>
          <p className="text-neutral-400 text-xs truncate">{data.author}</p>
        </div>
      </div>
    );    
  }

};

export default MediaItem;
