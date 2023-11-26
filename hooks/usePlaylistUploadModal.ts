import { create } from "zustand";

interface PlaylistUploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePlaylistUploadModal = create<PlaylistUploadModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default usePlaylistUploadModal;