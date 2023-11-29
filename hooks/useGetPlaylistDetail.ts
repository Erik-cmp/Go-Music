import { Playlist } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetPlaylistDetail = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchPlaylist = async () => {
      const { data, error } = await supabaseClient
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      setPlaylist(data as Playlist);
      setIsLoading(false);
    };

    fetchPlaylist();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      playlist,
    }),
    [isLoading, playlist]
  );
};

export default useGetPlaylistDetail;
