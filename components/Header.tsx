"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import Button from "./Button";
import usePlayer from "@/hooks/usePlayer";
import { TbPlaylist } from "react-icons/tb";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const player = usePlayer();
  const AuthModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    console.log("useEffect is running");
    const handleScroll = () => {
      const offset = window.scrollY;
      const scrollThreshold = 50;
      console.log(offset);
      console.log(scrollThreshold);
      if (offset > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);    
    return () => {
      window.removeEventListener('scroll', handleScroll);      
    };
  }, [])  

  return (
    <div
      className={twMerge(
        `
      h-fit
      bg-gradient-to-b
      from-blue-700
      md:p-6 p-4            
      ${isScrolled ? 'fixed top-0 bg-blue-900 rounded-tl-lg rounded-tr-lg p-6' : ''}
    `,        
        className
      )}
    >      
      <div
        className="
        w-full
        mb-4
        flex
        items-center
        justify-between
      "
      >
        <div
          className="
          hidden
          md:flex
          gap-x-2
          items-center
        "
        >
          <button
            onClick={() => router.back()}
            className="
            rounded-full
            bg-black
            flex
            items-center
            justify-center
            hover:opacity-75
            transition
          "
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="
            rounded-full
            bg-black
            flex
            items-center
            justify-center
            hover:opacity-75
            transition
          "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
          <button
            onClick={() => {
              if (!user) {
                return AuthModal.onOpen();
              }

              router.push("/library")
            }}
            className="
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              hover:opacity-75
              transition
            "
          >
            <TbPlaylist className="text-black" size={20} />{" "}
          </button>
        </div>
        <div
          className="
          flex
          justify-between
          items-center
          gap-x-4
        "
        >
          {user ? (
            <div
              className="
              flex gap-x-4
              items-center
            "
            >
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push("/account")}
                className="bg-white"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              {/* Hide this div on mobile */}
              <div className="hidden md:flex">
                <Button
                  onClick={AuthModal.onOpen}
                  className="
                  bg-transparent
                  text-neutral-300
                  font-medium                  
                "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={AuthModal.onOpen}
                  className="
                bg-white
                px-6
                py-2
                "
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
