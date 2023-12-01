"use client";
import { Playlist, Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { FaCaretRight } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import useAuthModal from "@/hooks/useAuthModal";
import usePlaylistUploadModal from "@/hooks/usePlaylistUploadModal";
import { BsPlus } from "react-icons/bs";

interface AddToPlaylistProps {
  playlist: Playlist[];
  song: Song;
}

const AddToPlaylist: React.FC<AddToPlaylistProps> = ({ playlist, song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { user, subscription } = useUser();
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const playlistUploadModal = usePlaylistUploadModal();

  const addSongToPlaylist = async (playlist: Playlist, song: Song) => {
    try {
      setIsLoading(true);

      const existingRecord = await supabaseClient
        .from("playlists_song")
        .select("id")
        .eq("playlist_id", playlist.id)
        .eq("song_id", song.id)
        .single();

      console.log(existingRecord);

      if (existingRecord.data) {
        toast.error(`${song.title} is already in ${playlist.title}!`);
        return;
      }

      const id = uniqid();

      const { error } = await supabaseClient.from("playlists_song").upsert([
        {
          id,
          user_id: user?.id,
          playlist_id: playlist.id,
          song_id: song.id,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success(`${song.title} added to ${playlist.title}!`);
    } catch (error) {
      console.error(error);
      toast.error("Whoops, something went wrong...");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (value: any) => {
    let date = new Date(value);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return playlistUploadModal.onOpen();
  };

  return (
    <div
      className="      
      bg-neutral-800 
      p-1
      rounded 
      w-[160px] 
      shadow 
      items-center 
      justify-center                 
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className={`
            absolute
            bottom-0
            left-full
            bg-neutral-800
            p-1
            rounded
            shadow
            w-[200px]       
            max-h-[30vh]
            overflow-y-auto               
          `}
        >
          <div
            className="flex gap-y-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-t-sm shadow transition justify-between items-center"
            onClick={() => onClick()}
          >
            <p className="text-neutral-100 font-semibold text-">
              Create Playlist
            </p>
            <BsPlus size={26} className="text-neutral-100" />
          </div>
          <div className="w-full h-[1px] bg-neutral-700"></div>
          {playlist.map((playlist, index) => (
            <Tippy
              content={
                <div>
                  <p style={{ fontSize: "1rem" }}>{playlist.title}</p>
                  <p style={{ fontSize: "0.875rem", color: "#a3a3a3" }}>
                    Created {formatDate(playlist.created_at)}
                  </p>
                </div>
              }
              placement="right"
              delay={[300, 0]}
            >
              <div
                key={playlist.id}
                className={`flex gap-y-2 p-2 bg-neutral-800 hover:bg-neutral-700 ${
                  index === 0 ? "rounded-b-sm" : "rounded-sm"
                } shadow transition`}
                onClick={() => addSongToPlaylist(playlist, song)}
              >
                <p className="text-neutral-100 truncate">{playlist.title}</p>
              </div>
            </Tippy>
          ))}
        </div>
      )}

      {playlist.length > 0 ? (
        <div className="flex p-2 bg-neutral-800 hover:bg-neutral-700 transition shadow rounded-sm justify-between items-center">
          <p className="text-neutral-100">Add to playlist</p>
          <FaCaretRight size={21} />
        </div>
      ) : (
        <div className="text-neutral-400 flex gap-y-2 p-2 text-sm text-center">
          <p>You have no playlists.</p>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylist;
