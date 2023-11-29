"use client";

import useLoadPlaylistImage from "@/hooks/useLoadPlaylistImage";
import ListItem from "./ListItem";
import { Playlist } from "@/types";

interface PlaylistContentProps {
  playlists: Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({ playlists }) => {
  const imagePaths = useLoadPlaylistImage(playlists);

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

      {[...playlists]
        .reverse()
        .slice(0, 5)
        .map((item, i, arr) => {
          const reversedIndex = arr.length - i;
          return (
            <ListItem
              key={item.id}
              image={imagePaths[reversedIndex] || "/images/liked.png"}
              name={item.title}
              href={item.id}
              variant="1"
            />
          );
        })}
    </div>
  );
};

export default PlaylistContent;
