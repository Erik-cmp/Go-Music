"use client"

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import PlaylistUploadModal from "@/components/PlaylistUploadModal";
import PlaylistEditModal from "@/components/PlaylistEditModal";
import DeleteModal from "@/components/DeleteModal";
import DeletePlaylistModal from "@/components/DeletePlaylistModal";
import SubscribeModal from "@/components/SubscribeModal";
import { Playlist, ProductWithPrice, Song } from "@/types";
import UserUpdateModal from "@/components/UserUpdateModal";

interface ModalProviderProps{
  products: ProductWithPrice[];
  song: Song;
  playlist: Playlist;
}

const ModalProvider: React.FC<ModalProviderProps> = ({
  products,
  song,
  playlist
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  if(!isMounted) {
    return null;
  }

  return ( 
    <>
      <AuthModal />
      <UploadModal />
      <PlaylistUploadModal />
      <PlaylistEditModal />
      <UserUpdateModal />
      <DeleteModal song={song}/>      
      <DeletePlaylistModal playlist={playlist}/>
      <SubscribeModal products={products} />
    </>
  );
}
 
export default ModalProvider;
