"use client";

import uniqid from "uniqid";
import useDeleteModal from "@/hooks/useDeleteModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { Song } from "@/types";

interface DeleteModalProps {
  song: Song;
}

const DeleteModal: React.FC<DeleteModalProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { song } = useDeleteModal();
  const DeleteModal = useDeleteModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
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
      DeleteModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .delete()
        .match({ id: song?.id });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song deleted!");
      reset();
      DeleteModal.onClose();
    } catch (error) {
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (        
    <Modal
      title="Confirm Song Deletion"
      description={`Do you want to delete ${song?.title}? This action cannot be undone.`}
      isOpen={DeleteModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Button disabled={isLoading} type="submit">
          Delete Song
        </Button>
      </form>
    </Modal>
  );
};

export default DeleteModal;
