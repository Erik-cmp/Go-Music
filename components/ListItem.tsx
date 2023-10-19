"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlay } from "react-icons/fa"
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@supabase/auth-helpers-react";

interface ListItemProps {
  image: string;
  name: string;
  href: string;  
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  href
}) => {
  const router = useRouter();  
  const authModal = useAuthModal();
  const user = useUser();

  const onClick = () => {  
    if (!user) {
      return authModal.onOpen();
    }    
    
    router.push(href);
  }

  return ( 
    <button 
    onClick={onClick}
    className="
      relative
      group
      flex
      items-center
      rounded-md
      overflow-hidden
      gap-x-4
      bg-neutral-100/10
      hover:bg-neutral-100/20
      transition
      pr-4
    ">
      <div className="
        relative
        min-h-[64px]
        min-w-[64px]
      ">
        <Image 
          className="object-cover"
          fill
          sizes="64px"
          src={image}
          alt="Image"
        />
      </div>
      <p className="font-medium truncate py-5">
        {name}
      </p>
    </button>
  );
}
 
export default ListItem;