import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadUserImage = (path: string) => {
  const supabaseClient = useSupabaseClient();

  if(!path){
    return null;
  }

  const { data: imageData } = supabaseClient
    .storage
    .from('images')
    .getPublicUrl(path)
  
  return imageData.publicUrl;
}

export default useLoadUserImage;