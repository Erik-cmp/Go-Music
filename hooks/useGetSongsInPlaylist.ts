import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";

const useGetSongsInPlaylist = (playlistId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const { supabaseClient } = useSessionContext();

  const fetchSongsInPlaylist = async () => {
    try {
      setIsLoading(true);

      const { data: playlistSongs, error: playlistSongsError } =
        await supabaseClient
          .from("playlists_song")
          .select("song_id, created_at")
          .eq("playlist_id", playlistId)
          .order("created_at", { ascending: true });

      if (playlistSongsError) {
        throw playlistSongsError;
      }

      const songIds =
        playlistSongs?.map((playlistSong) => playlistSong.song_id) || [];
      console.log("Song ids:" + songIds);

      if (songIds.length === 0) {
        setSongs([]);
        setIsLoading(false);
        return;
      }

      const { data: songsData, error: songsError } = await supabaseClient
        .from("songs")
        .select("*")
        .in("id", songIds);

      if (songsError) {
        throw songsError;
      }

      const mappedSongs = songsData
        .map((song) => {
          const playlistSong = playlistSongs.find(
            (ps) => ps.song_id === song.id
          );
          return {
            ...song,
            created_at: playlistSong
              ? playlistSong.created_at
              : song.created_at,
          };
        })
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );

      setSongs(mappedSongs as Song[]);
    } catch (error) {
      console.error("Error fetching songs in playlist:", error);
      toast.error("Failed to fetch songs in playlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId) {
      fetchSongsInPlaylist();
    }
  }, [playlistId, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      songs,
      fetchSongsInPlaylist,
    }),
    [isLoading, songs, fetchSongsInPlaylist]
  );
};

export default useGetSongsInPlaylist;
