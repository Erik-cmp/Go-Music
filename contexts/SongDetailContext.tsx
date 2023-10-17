"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface SongDetailContextType {
  isSongDetailVisible: boolean;
  setIsSongDetailVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongDetailContext = createContext<SongDetailContextType | undefined>(undefined);

export const useSongDetail = (): SongDetailContextType => {
  const context = useContext(SongDetailContext);
  if (!context) {
    throw new Error('useSongDetail must be used within a SongDetailProvider');
  }
  return context;
};

interface SongDetailProviderProps {
  children: ReactNode;
}

export const SongDetailProvider: React.FC<SongDetailProviderProps> = ({ children }) => {
  const [isSongDetailVisible, setIsSongDetailVisible] = useState(false);

  return (
    <SongDetailContext.Provider value={{ isSongDetailVisible, setIsSongDetailVisible }}>
      {children}
    </SongDetailContext.Provider>
  );
};
