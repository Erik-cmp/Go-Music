import { create } from "zustand";

interface UploadSongToPlaylistStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUploadSongToPlaylist = create<UploadSongToPlaylistStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useUploadSongToPlaylist;