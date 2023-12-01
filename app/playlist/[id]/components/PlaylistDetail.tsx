"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUser } from "@/hooks/useUser";
import { Playlist, Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useGetPlaylistDetail from "@/hooks/useGetPlaylistDetail";
import useGetSongsInPlaylist from "@/hooks/useGetSongsInPlaylist";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";

const PlaylistDetail = () => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const id = url.split("/playlist/")[1];
  // console.log(id);
  const playlists = useGetPlaylistDetail(id);
  const playlistSongs = useGetSongsInPlaylist(id);
  const [songs, setSongs] = useState<Song[]>();
  const songs2 = playlistSongs.songs;

  useEffect(() => {
    if (playlistSongs.songs.length > 0) {
      setSongs(playlistSongs.songs);
    }
  }, [playlistSongs.songs]);

  console.log("songs: ", songs);
  console.log("songs2: ", songs2);  

  const { supabaseClient } = useSessionContext();

  const router = useRouter();
  const { isLoading, user } = useUser();

  const onPlay = useOnPlay(songs as Song[]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const handleDoubleClick = (id: string) => {
    onPlay(id);
  };

  let lastTouchTime = 0;

  const handleTouchStart = (id: string) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastTouchTime;

    if (timeDiff < 500) {
      handleDoubleClick(id);
    }

    lastTouchTime = currentTime;
  };

  const removeSongFromPlaylist = async (song: Song, playlist: Playlist) => {
    const { error } = await supabaseClient
      .from("playlists_song")
      .delete()
      .eq("playlist_id", playlist.id)
      .eq("song_id", song.id);

    if (error) {
      toast.error(error.message);
    }
    else{
      setSongs((prevSongs) => prevSongs?.filter((existingSong) => existingSong.id !== song.id));
      toast.success("Song removed from playlist!");
    }
  };

  if (songs?.length === 0) {
    return (
      <div
        className="
        flex
        flex-col
        gap-y-2
        w-full
        px-6
        text-neutral-400
      "
      >
        {playlists.playlist?.title} is empty.
      </div>
    );
  }

  return (
    <div
      className="
     flex
     flex-col
     gap-y-2
     w-full    
     md:p-6 p-3
     md:px-6 pl-3 pr-4    
    "
    >
      {songs?.map((song, i) => (
        <div
          key={song.id}
          className="
           flex 
           items-center 
           md:gap-x-6 
           gap-x-4 
           w-full 
           hover:bg-neutral-800/50 
           rounded-md 
           md:px-4 
           pr-2          
           "
          onDoubleClick={() => handleDoubleClick(song.id)}
          onTouchStart={() => handleTouchStart(song.id)}
        >
          <div className="md:block hidden ">
            <p className="text-neutral-400">{i + 1}</p>
          </div>
          <div className="md:w-[50vw] pointer-events-none w-full truncate">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <div className="md:block hidden text-sm text-neutral-400 w-[25vw]">
            {new Date(song.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </div>
          <div className="md:block hidden w-[5vw]">
            <p className="text-sm text-neutral-400">
              {`${Math.floor(song.song_length / 60)}`.padStart(2, "0")}:
              {`${song.song_length % 60}`.padStart(2, "0")}
            </p>
          </div>
          <button
            onClick={() => removeSongFromPlaylist(song, playlists.playlist as Playlist)}
            className="text-neutral-400 hover:opacity-75 cursor-pointer"
          >
            <IoCloseCircleOutline size={24} />
          </button>
          {/* <RemoveButton songId={song.id} playlist={playlists?.playlist as Playlist} size={24} /> */}
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetail;
