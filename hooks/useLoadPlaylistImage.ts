import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Playlist } from "@/types";

const useLoadPlaylistImage = (playlists: Playlist[] | null) => {
  const supabaseClient = useSupabaseClient();

  if (!playlists || !Array.isArray(playlists)) {
    return [];
  }

  const imagePaths = playlists.map((playlist) => {
    if (!playlist) {
      return null;
    }

    const { data: imageData } = supabaseClient
      .storage
      .from('images')
      .getPublicUrl(playlist.image_path);

    return imageData ? imageData.publicUrl : null;
  });

  return imagePaths;
}

export default useLoadPlaylistImage;
