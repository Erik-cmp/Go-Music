"use client"
import React from 'react';

const AddToPlaylist = () => {
  const addToPlaylist = () => {    
    console.log('Song added to playlist');
  };

  return (
    <button
      className="bg-neutral-800 p-2 rounded w-[150px]"
      onClick={addToPlaylist}
    >
      Add to playlist
    </button>
  );
};

export default AddToPlaylist;
