"use client";
import { Playlist, Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { FaCaretRight } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";

interface AddToPlaylistProps {
  playlist: Playlist[];
  song: Song;
}

const AddToPlaylist: React.FC<AddToPlaylistProps> = ({ playlist, song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

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
          `}
        >
          {playlist.map((playlist) => (
            <div
              key={playlist.id}
              className="flex gap-y-2 p-2 bg-neutral-800 hover:bg-neutral-700 rounded shadow transition"
              onClick={() => addSongToPlaylist(playlist, song)}
            >
              <p className="text-white truncate">{playlist.title}</p>
            </div>
          ))}
        </div>
      )}

      {playlist.length > 0 ? (
        <div className="flex p-2 bg-neutral-800 hover:bg-neutral-700 transition shadow rounded justify-between items-center">
          <p className="text-white">Add to playlist</p>
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
