"use client";

import useRemoveSongFromPlaylistModal from "@/hooks/useRemoveSongFromPlaylistModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Button from "./Button";
import { Playlist, Song } from "@/types";

interface RemoveSongFromPlaylistModalProps {
  song: Song;
  playlist: Playlist;
}

const RemoveSongFromPlaylistModal: React.FC<
  RemoveSongFromPlaylistModalProps
> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { song } = useRemoveSongFromPlaylistModal();
  const user = useUser();  
  const RemoveSongFromPlaylistModal = useRemoveSongFromPlaylistModal();
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
      RemoveSongFromPlaylistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const { error } = await supabaseClient
        .from("playlists_song")
        .delete()
        .match({ song_id: song?.id, user_id: user?.id });

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song removed from playlist!");
      reset();
      RemoveSongFromPlaylistModal.onClose();
    } catch (error) {
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Remove song from playlist"
      description={`Do you want to remove ${song?.title} from this playlist?`}
      isOpen={RemoveSongFromPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Button disabled={isLoading} type="submit">
          Remove Song
        </Button>
      </form>
    </Modal>
  );
};

export default RemoveSongFromPlaylistModal;
