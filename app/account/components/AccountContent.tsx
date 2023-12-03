"use client"

import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(!isLoading && !user){
      router.replace('/');
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };
  
  return (  
    <div className="mb-7 p-6 min-h-[60vh]">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p className="flex flex-col gap-y-4 text-2xl font-semibold">User Information:</p>
          {user && (
            <div className="flex flex-col gap-y-4 text-sm lg:text-base mb-4">
              <p> <b>User ID:</b> {user.id}</p>
              <p> <b>Email:</b> {user.email}</p>              
            </div>
          )}
          <p className="flex flex-col gap-y-4 text-2xl font-semibold">Subscription:</p>          
          <p>
            No active plan.
          </p>
          <Button
            onClick={subscribeModal.onOpen}
            className="w-[120px]"
          >
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p className="flex flex-col gap-y-4 text-2xl font-semibold">User Information:</p>
          {user && (
            <div className="flex flex-col gap-y-4 text-sm lg:text-base mb-4">
              <p> <b>User ID:</b> {user.id}</p>
              <p> <b>Email:</b> {user.email}</p>              
            </div>
          )}
          <p className="flex flex-col gap-y-4 text-2xl font-semibold">Subscription:</p>          
          <p className="text-sm lg:text-base">
            You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.
          </p>
          <Button 
            className="w-[250px]"
            onClick={redirectToCustomerPortal}
            disabled={loading || isLoading}
          >
            Open customer portal
          </Button>
        </div>
      )}
    </div>
  );
}
 
export default AccountContent;