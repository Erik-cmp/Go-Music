import { Playlist } from "@/types";
import { create } from "zustand";

interface DeletePlaylistModalStore {
  isOpen: boolean;
  playlist: Playlist | null;
  onOpen: (playlist: Playlist) => void;
  onClose: () => void;
 }
 

 const useDeletePlaylistModal = create<DeletePlaylistModalStore>((set) => ({
  isOpen: false,
  playlist: null,
  onOpen: (playlist: Playlist) => set({ isOpen: true, playlist }),
  onClose: () => set({ isOpen: false, playlist: null }),
 }))
 
export default useDeletePlaylistModal;