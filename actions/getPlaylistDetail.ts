import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Playlist } from "@/types";

const getPlaylistDetail = async (
  playlistId: string
): Promise<Playlist | null> => {
  try {
    console.log("I'm called!");

    const supabase = createServerComponentClient({
      cookies: cookies,
    });

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.log("Session error:", sessionError.message);
      return null;
    }

    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("id", playlistId)
      .single();

    if (error) {
      console.log("Database error:", error.message);
      return null;
    }

    console.log("Database data:", data);
    return data as Playlist;
  } catch (error) {
    console.error("Error in getPlaylistDetail:", error);
    return null;
  }
};

export default getPlaylistDetail;
