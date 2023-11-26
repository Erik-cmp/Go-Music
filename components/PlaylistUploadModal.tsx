"use client"

import uniqid from "uniqid";
import usePlaylistUploadModal from "@/hooks/usePlaylistUploadModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

const PlaylistUploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const playlistUploadModal = usePlaylistUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  })

  const onChange = (open: boolean) => {
    if(!open) {
      reset();
      playlistUploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];      

      if(!imageFile || !user){
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();
            
      // Upload image
      const {
        data: imageData,
        error: imageError,
      } = await supabaseClient
        .storage
        .from('images')
        .upload(`playlistImage-${values.title}-${uniqueID}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });      

      if(imageError){
        setIsLoading(false);
        return toast.error('Failed image upload');        
      }

      const {
        error: supabaseError
      } = await supabaseClient
        .from('playlists')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          image_path: imageData.path,          
        });

      if(supabaseError){
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Playlist added!');
      reset();
      playlistUploadModal.onClose();

    } catch (error) {
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false)
    }
  }

  return (  
    <Modal
      title="Add a playlist"
      description=""
      isOpen={playlistUploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Title"
        />
        <Input
          id="description"
          disabled={isLoading}
          {...register('description', { required: false })}
          placeholder="Description (Optional)"
        />                 
        <div>
          <div className="pb-1">
            Image
          </div>
          <Input
          id="image"
          type="file"
          disabled={isLoading}
          accept="image/*"
          {...register('image', { required: true })}                    
        />          
        </div> 
        <Button disabled={isLoading} type="submit">
          Add Playlist
        </Button>               
      </form>
    </Modal>
  );
}
 
export default PlaylistUploadModal;