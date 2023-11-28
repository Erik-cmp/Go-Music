"use client"

import Image from "next/image";

import { Playlist } from "@/types";
import useLoadPlaylistImageSingle from "@/hooks/useLoadPlaylistImageSingle";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

interface PlaylistItemProps{
  data: Playlist;
  href: string;  
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  data,
  href
}) => {  
  const imageUrl = useLoadPlaylistImageSingle(data);

  const router = useRouter();  
  const authModal = useAuthModal();
  const user = useUser();

  const handleClick = () => {
    if (!user) {
      return authModal.onOpen();
    }        
    
    router.push(href);
  }

  return (  
    <div
      onDoubleClick={handleClick}
      className="
        flex
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        p-2
        rounded-md
      ">
      <div className="
        relative
        rounded-md
        min-h-[48px]
        min-w-[48px]
        overflow-hidden
      ">
        <Image 
          fill
          sizes="48px"
          src={imageUrl || '/images/liked.png'}
          alt="Media Item"
          className="object-cover"
        />
      </div>
      <div className="
        flex
        flex-col
        gap-y-1
        overflow-hidden       
      ">
        <p className="text-white truncate">
          {data.title}
        </p>
        <p className="text-neutral-400 truncate text-sm">
          {data.description}
        </p>        
      </div>
    </div>
  );
}
 
export default PlaylistItem;