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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MdOutlineTimer } from "react-icons/md";

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
    // Delete the song from playlists_song table
    const { error } = await supabaseClient
      .from("playlists_song")
      .delete()
      .eq("playlist_id", playlist.id)
      .eq("song_id", song.id);

    if (error) {
      toast.error(error.message);
    } else {
      setSongs((prevSongs) =>
        prevSongs?.filter((existingSong) => existingSong.id !== song.id)
      );

      const { data: playlistData, error: playlistError } = await supabaseClient
        .from("playlists")
        .select("*")
        .eq("id", playlist.id)
        .single();

      if (playlistError) {
        toast.error(playlistError.message);
      } else {
        const songCount = playlistData?.song_count - 1;

        const { error: updateError } = await supabaseClient
          .from("playlists")
          .upsert({
            id: playlistData.id,
            created_at: playlistData.created_at,
            title: playlistData.title,
            description: playlistData?.description,
            image_path: playlistData.image_path,
            user_id: playlistData.user_id,
            song_count: songCount,
          })
          .eq("id", playlist.id);

        if (updateError) {
          toast.error(updateError.message);
        } else {
          toast.success("Song removed from playlist!");
        }
      }
    }
  };

  if (songs2?.length === 0) {
    return (
      <div
        className="
        flex
        flex-col
        gap-y-2
        w-full
        px-6
        text-neutral-400        
        md:text-base        
        text-xs
        min-h-[80vh]
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
     gap-y-1
     w-full    
     md:p-6 p-3
     md:px-6 px-3    
     min-h-[80vh]
    "
    >
      <div
        className="                  
         flex-col
         items-center 
         justify-center         
         w-full                
         md:flex
         hidden
         pr-2          
         "
      >
        <div className="flex w-full items-center justify-center gap-x-4 px-4 text-sm font-medium text-neutral-400">
          <div className="w-[1.25%] hover:text-white transition">#</div>
          <div className="w-[45%] hover:text-white transition flex justify-start">
            Title
          </div>
          <div className="w-[35%] flex justify-center hover:text-white transition">
            Date Uploaded
          </div>
          <div className="w-[15%] text-neutral-400 flex justify-center hover:text-white transition">
            <Tippy
              content={<div style={{ fontWeight: "600" }}>Duration</div>}
              delay={[100, 0]}
              touch={false}
            >
              <div>
                <MdOutlineTimer size={18} />
              </div>
            </Tippy>
          </div>
          <div className="w-[4%] flex justify-end"></div>
        </div>
        <div className="w-full h-[1px] rounded-full bg-neutral-700 my-2"></div>
      </div>
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
          <div className="md:block hidden w-[0.5%]">
            <p className="text-neutral-400">{i + 1}</p>
          </div>
          <div className="md:w-[45%] pointer-events-none w-[90%] truncate">
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              data={song}
              variant="1"
            />
          </div>
          <div className="md:flex hidden text-sm text-neutral-400 w-[35%] justify-center">
            {new Date(song.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </div>
          <div className="md:flex hidden w-[15%] justify-center">
            <p className="text-sm text-neutral-400">
              {`${Math.floor(song.song_length / 60)}`.padStart(2, "0")}:
              {`${song.song_length % 60}`.padStart(2, "0")}
            </p>
          </div>
          <Tippy
            content={
              <div style={{ fontWeight: "600" }}>Remove from Playlist</div>
            }
            delay={[100, 0]}
            touch={false}
          >
            <button
              onClick={() =>
                removeSongFromPlaylist(song, playlists.playlist as Playlist)
              }
              className="text-neutral-400 hover:opacity-75 cursor-pointer md:w-[4%] flex w-[10%] justify-end"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </Tippy>
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetail;
