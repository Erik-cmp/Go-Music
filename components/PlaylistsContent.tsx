"use client";

import ListItem from "./ListItem";
import { Playlist } from "@/types";
import useLoadPlaylistImageSingle from "@/hooks/useLoadPlaylistImageSingle";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlists }) => {
  const playlistsWithImages = [...playlists]
    .reverse()
    .slice(0, 5)
    .map((item) => {
      const imagePaths = useLoadPlaylistImageSingle(item);
      return { item, imagePaths };
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

      {playlistsWithImages.map(({ item, imagePaths }) => (
        <ListItem
          key={item.id}
          image={imagePaths || "/images/liked.png"}
          name={item.title}
          href={item.id}
          variant="1"
        />
      ))}
    </div>
  );
};

export default PlaylistContent;
