import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import getSongs from "./getSongs";

const getSongsByTitleAndAuthor = async (query: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({    
    cookies: cookies
  });

  if (!query) {
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .order('created_at', { ascending: false });

    if(error){
      console.log(error);
    }

    return (data as any) || [];
};

export default getSongsByTitleAndAuthor;