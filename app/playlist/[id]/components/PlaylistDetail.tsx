"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import { Playlist, Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useGetPlaylistDetail from "@/hooks/useGetPlaylistDetail";
import useGetSongsInPlaylist from "@/hooks/useGetSongsInPlaylist";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import RemoveSongFromPlaylistModal from "@/components/removeSongFromPlaylistModal";
import useRemoveSongFromPlaylistModal from "@/hooks/useRemoveSongFromPlaylistModal";

const PlaylistDetail = () => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const id = url.split("/playlist/")[1];
  // console.log(id);
  const playlists = useGetPlaylistDetail(id);
  const playlistSongs = useGetSongsInPlaylist(id);
  const songs = playlistSongs.songs;
  const { supabaseClient } = useSessionContext();

  const router = useRouter();
  const { isLoading, user } = useUser();

  const onPlay = useOnPlay(songs);

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

    window.location.reload()
  };

  // const removeSongFromPlaylistModal = useRemoveSongFromPlaylistModal();

  // const removeSongFromPlaylist = (song: Song, playlist: Playlist) => {
  //   return removeSongFromPlaylistModal.onOpen(song);
  // }

  useEffect(() => {

  }, [supabaseClient, songs]);  

  if (songs.length === 0) {
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
      {songs.map((song, i) => (
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
          <IoCloseCircleOutline
            size={24}
            className="text-neutral-400 hover:opacity-75 cursor-pointer"
            onClick={() =>
              removeSongFromPlaylist(song, playlists.playlist as Playlist)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetail;
