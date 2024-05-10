"use client";

import uniqid from "uniqid";
import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

const PlaylistEditModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const playlistEditModal = usePlaylistEditModal();
  const { playlistData, imagePath } = playlistEditModal;
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset, setValue } = useForm<FieldValues>({
    defaultValues: {
      title: playlistData.title || "",
      description: playlistData.description || "",
      song: null,
      image: imagePath || null,
    },
  });

  useEffect(() => {
    // Update form values when playlistData or imagePath changes
    setValue("title", playlistData.title || "");
    setValue("description", playlistData.description || "");
    setValue("image", imagePath || null);
  }, [playlistData, imagePath, setValue]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      playlistEditModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];

      if (!imageFile || !user) {
        toast.error("Missing fields");
        return;
      }      

      const { error: supabaseError } = await supabaseClient
        .from("playlists")
        .update({
          user_id: user.id,
          title: values.title,
          description: values.description,          
        }).match({ id: playlistData.id });;

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Playlist Edited!");
      reset();
      playlistEditModal.onClose();
    } catch (error) {
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit playlist"
      description=""
      isOpen={playlistEditModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Title"
        />
        <Input
          id="description"
          disabled={isLoading}
          {...register("description", { required: false })}
          placeholder="Description (Optional)"
        />
        <Button disabled={isLoading} type="submit">
          Edit Playlist
        </Button>
      </form>
    </Modal>
  );
};

export default PlaylistEditModal;
