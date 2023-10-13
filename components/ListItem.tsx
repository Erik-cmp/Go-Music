"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlay } from "react-icons/fa"
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

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

  const onClick = () => {
    // Add auth b4 push
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