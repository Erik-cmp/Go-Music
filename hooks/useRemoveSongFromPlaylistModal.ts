import { Song } from "@/types";
import { create } from "zustand";

interface RemoveSongFromPlaylistModalStore {
  isOpen: boolean;
  song: Song | null;
  onOpen: (song: Song) => void;
  onClose: () => void;
 }
 

 const useRemoveSongFromPlaylistModal = create<RemoveSongFromPlaylistModalStore>((set) => ({
  isOpen: false,
  song: null,
  onOpen: (song: Song) => set({ isOpen: true, song }),
  onClose: () => set({ isOpen: false, song: null }),
 }))
 
export default useRemoveSongFromPlaylistModal;