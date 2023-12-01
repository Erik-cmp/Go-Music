"use client";

import { BsPlus } from "react-icons/bs";
import { TbBooks } from "react-icons/tb";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { Playlist } from "@/types";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import usePlaylistUploadModal from "@/hooks/usePlaylistUploadModal";
import ListItem from "./ListItem";
import useLoadPlaylistImage from "@/hooks/useLoadPlaylistImage";
import { useRouter } from "next/navigation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface LibraryProps {
  playlists: Playlist[];
}

const Library: React.FC<LibraryProps> = ({ playlists }) => {
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const playlistUploadModal = usePlaylistUploadModal();
  const { user, subscription } = useUser();
  const router = useRouter();

  const imagePaths = useLoadPlaylistImage(playlists);

  const onClick = () => {
    console.log("Pass");
    console.log("PlaylistUploadModal state: ", playlistUploadModal.isOpen);
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return playlistUploadModal.onOpen();
  };
  return (
    <div className="flex flex-col">
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          pt-4
        "
      >
        <a
          onClick={() => {
            if (!user) {
              return authModal.onOpen();
            }

            router.replace("/playlist");
          }}
          className="group inline-flex items-center gap-x-2 cursor-pointer"
        >
          <TbBooks
            className="text-neutral-400 group-hover:text-white transition"
            size={26}
          />
          <p className="text-neutral-400 font-medium text-md group-hover:text-white transition">
            Your Playlists
          </p>
        </a>
        <Tippy
          content={
            <div style={{ fontWeight: "600" }}>
              Add New Playlist
            </div>
          }
          delay={[100, 0]}
        >
          <div className="flex gap-x-1">
            <BsPlus
              onClick={onClick}
              size={28}
              className="
          text-neutral-400 cursor-pointer hover:text-white hover:bg-neutral-800 transition bg-neutral-900 rounded-full
          "
            />
          </div>
        </Tippy>
      </div>
      <div
        className="
        flex
        flex-col
        gap-y-2
        mt-4
        px-3
      "
      >
        {playlists?.map((item, i) => {
          return (
            <ListItem
              key={item.id}
              image={imagePaths[i] || "/images/liked.png"}
              name={item.title}
              href={item.id}
              variant="2"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Library;
