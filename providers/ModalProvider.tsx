"use client"

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import PlaylistUploadModal from "@/components/PlaylistUploadModal";
import DeleteModal from "@/components/DeleteModal";
import SubscribeModal from "@/components/SubscribeModal";
import { ProductWithPrice, Song } from "@/types";

interface ModalProviderProps{
  products: ProductWithPrice[];
  song: Song;
}

const ModalProvider: React.FC<ModalProviderProps> = ({
  products,
  song
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
      <DeleteModal song={song}/>
      <SubscribeModal products={products} />
    </>
  );
}
 
export default ModalProvider;
