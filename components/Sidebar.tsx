"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Playlist";
import { Playlist } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";
import { TbPlaylist } from "react-icons/tb";

interface SidebarProps {
  children: React.ReactNode;  
  playlists: Playlist[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, playlists }) => {
  const pathname = usePathname();
  const player = usePlayer();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        active: pathname === "/search",
        href: "/search",
      },
      {
        icon: TbPlaylist,
        label: "Library",
        active: pathname === "/library",
        href: "/library",
      },
    ],
    [pathname]
  );

  return (
    <div className={twMerge(`
      flex
      h-full
    `,
      player.activeId && "h-[calc(100% - 80px)]"
    )}>
      <div
        className="
          hidden
          lg:flex
          flex-col
          gap-y-2
          bg-black
          lg:h-[calc(100%-72px)] h-[calc(100%-60px)]
          w-[300px]
          p-2
        "
      >
        <Box>
          <div className="
            flex
            flex-col
            gap-y-4
            px-5
            py-4
          ">
            {routes.map((item) => (
              <SidebarItem 
                key={item.label}
                {...item}
              />
            ))}            
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library playlists={playlists} />
        </Box>        
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
