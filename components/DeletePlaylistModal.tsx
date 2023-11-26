"use client";

import useDeletePlaylistModal from "@/hooks/useDeletePlaylistModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Button from "./Button";
import { Playlist } from "@/types";

interface DeletePlaylistModalProps {
  playlist: Playlist;
}

const DeletePlaylistModal: React.FC<DeletePlaylistModalProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { playlist } = useDeletePlaylistModal();
  const DeletePlaylistModal = useDeletePlaylistModal();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      DeletePlaylistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const { error: supabaseError } = await supabaseClient
        .from("playlists")
        .delete()
        .match({ id: playlist?.id });
      console.log(playlist?.id)
      console.log('Deletion result:', supabaseError ? supabaseError.message : 'Successfully deleted');        

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Playlist deleted!");
      reset();
      DeletePlaylistModal.onClose();
    } catch (error) {
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (        
    <Modal
      title="Confirm Playlist Deletion"
      description={`Do you want to delete ${playlist?.title}? This action cannot be undone.`}
      isOpen={DeletePlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Button disabled={isLoading} type="submit">
          Delete Playlist
        </Button>
      </form>
    </Modal>
  );
};

export default DeletePlaylistModal;
