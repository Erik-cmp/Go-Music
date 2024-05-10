import { create } from "zustand";

interface PlaylistEditModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  playlistData: any;
  imagePath: string | null;
  setPlaylistData: (data: any) => void;
  setImagePath: (path: string | null) => void;
}

const usePlaylistEditModal = create<PlaylistEditModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  playlistData: {},
  imagePath: null,
  setPlaylistData: (data) => set({ playlistData: data }),
  setImagePath: (path) => set({ imagePath: path }),
}));

export default usePlaylistEditModal;
