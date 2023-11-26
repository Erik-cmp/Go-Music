import { Song } from "@/types";
import { create } from "zustand";

interface DeleteModalStore {
  isOpen: boolean;
  song: Song | null;
  onOpen: (song: Song) => void;
  onClose: () => void;
 }
 

 const useDeleteModal = create<DeleteModalStore>((set) => ({
  isOpen: false,
  song: null,
  onOpen: (song: Song) => set({ isOpen: true, song }),
  onClose: () => set({ isOpen: false, song: null }),
 }))
 
export default useDeleteModal;