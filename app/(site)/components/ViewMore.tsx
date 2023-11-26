"use client";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";

const ViewMore = () => {

  const router = useRouter();  
  const { user } = useUser();  
  const AuthModal = useAuthModal();

  return (
    <div className="flex items-end justify-end w-full pt-1 cursor-pointer">
      <a
        onClick={() => {
          if (!user) {
            return AuthModal.onOpen();
          }

          router.push("/playlist");
        }}
        className="md:text-sm text-xs text-neutral-400 hover:text-white transition"
      >
        <div className="flex items-center">
          View more
          <IoIosArrowRoundForward size={22} />
        </div>
      </a>
    </div>
  );
};

export default ViewMore;
