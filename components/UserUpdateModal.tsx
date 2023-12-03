"use client"

import uniqid from "uniqid";
import useUserUpdateModal from "@/hooks/useUserUpdateModal";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

const UserUpdateModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const UserUpdateModal = useUserUpdateModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',            
      image: null,
    }
  })

  const onChange = (open: boolean) => {
    if(!open) {
      reset();
      UserUpdateModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];      

      if(!user){
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
        .upload(`userImage-${uniqueID}`, imageFile, {
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
        .from('users')
        .upsert({
          id: user.id,
          name: values.name,          
          avatar_url: imageData.path,
          billing_address: null,
          payment_method: null,          
        });

      if(supabaseError){
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Update Successful! Refresh the page to see changes.');
      reset();
      UserUpdateModal.onClose();

    } catch (error) {
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false)
    }
  }

  return (  
    <Modal
      title="Update Profile"
      description=""
      isOpen={UserUpdateModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="name"
          disabled={isLoading}
          {...register('name', { required: true })}
          placeholder="Username"
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
          Update Profile
        </Button>               
      </form>
    </Modal>
  );
}
 
export default UserUpdateModal;