"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface ShuffleContextProps {
  children: ReactNode;
}

interface ShuffleContextValue {
  shuffle: boolean;
  toggleShuffle: () => void;
}

const ShuffleContext = createContext<ShuffleContextValue | undefined>(undefined);

export function ShuffleProvider({ children }: ShuffleContextProps) {
  const [shuffle, setShuffle] = useState(false);

  const toggleShuffle = () => {
    setShuffle((prevShuffle) => !prevShuffle);
  };

  return (
    <ShuffleContext.Provider value={{ shuffle, toggleShuffle }}>
      {children}
    </ShuffleContext.Provider>
  );
}

export function useShuffle() {
  const context = useContext(ShuffleContext);
  if (!context) {
    throw new Error('useShuffle must be used within a ShuffleProvider');
  }
  return context;
}
