"use client";

import ListItem from "./ListItem";
import { Playlist } from "@/types";
import useLoadPlaylistImage from "@/hooks/useLoadPlaylistImage";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlists }) => {

  const reversedPlaylist = [...playlists].reverse().slice(0, 5);
  const imagePaths = useLoadPlaylistImage(reversedPlaylist);
  console.log("imagePaths", imagePaths);


  const playlistsWithImages = [...playlists]
    .reverse()
    .slice(0, 5)
    .map((item, i) => {      
      return { item, i };
    });

  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-3
        gap-3
        mt-4
      "
    >
      <ListItem
        image="/images/liked.png"
        name="Liked Songs"
        href="liked"
        variant="1"        
      />

      {playlistsWithImages.map(({ item, i }) => (
        <ListItem
          key={item.id}
          image={imagePaths[i] as any || "/images/song.png"}
          name={item.title}
          href={item.id}          
          variant="1"
        />
      ))}
    </div>
  );
};

export default PlaylistContent;
