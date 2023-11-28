// app/playlist/[id]/components/PlaylistDetail.tsx
"use client"
import { useEffect, useState } from 'react';

export const revalidate = 0;

const PlaylistDetail = () => { 
 const [playlist, setPlaylist] = useState(null);

 useEffect(() => {
 const url = typeof window !== 'undefined' ? window.location.href : '';
 const id = url.split('/playlist/')[1];

 fetch(`/api/playlist/${id}`)
  .then(response => response.json())
  .then(data => setPlaylist(data));
 }, []);

 return (
 <div>
 </div>
 );
};

export default PlaylistDetail;
