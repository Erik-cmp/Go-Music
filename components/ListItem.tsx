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
  variant: string;
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  href,
  variant
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

  if(variant === "1"){
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
        md:gap-x-4
        gap-x-2
        bg-neutral-100/10
        hover:bg-neutral-100/20
        transition
        md:pr-4
        pr-2
      ">
        <div className="
          relative
          md:min-h-[64px]
          md:min-w-[64px]
          min-h-[48px]
          min-w-[48px]
        ">
          <Image 
            className="object-cover"
            fill            
            src={image}
            alt="Image"
          />
        </div>
        <p className="font-semibold truncate md:py-4 md:text-lg text-sm">
          {name}
        </p>
      </button>
    );
  }
  else if(variant === "2"){
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
        gap-x-3        
        hover:bg-neutral-100/10
        transition
        p-2               
      ">
        <div className="
          relative
          min-h-[48px]
          min-w-[48px]
          overflow-hidden
          rounded-md                    
        ">
          <Image 
            className="object-cover"
            fill
            sizes="48px"
            src={image}
            alt="Image"
          />
        </div>
        <p className="truncate font-medium">
          {name}
        </p>
      </button>
    );    
  }
}
 
export default ListItem;