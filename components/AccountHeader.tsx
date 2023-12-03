"use client";
import Header from "@/components/Header";
import Image from "next/image";
import { Playlist, Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import useUserUpdateModal from "@/hooks/useUserUpdateModal";
import AccountContent from "@/app/account/components/AccountContent";
import useLoadUserImage from "@/hooks/useLoadUserImage";

interface AccountHeaderProps {
  playlist: Playlist[];
  songs: Song[];
}

const AccountHeader: React.FC<AccountHeaderProps> = (playlist) => {
  const userUpdateModal = useUserUpdateModal();
  const user = useUser();
  const router = useRouter();
  const imagePath = useLoadUserImage(user?.userDetails?.avatar_url as string);

  // console.log("Playlist: ", playlist);

  const onClick = () => {
    return userUpdateModal.onOpen();
  };

  return (
    <div
      className="  
  "
    >
      <Header>
        <div className="mt-8">
          <div
            className="
          flex            
          md:flex-row flex-col
          items-center
          gap-x-5
        "
          >
            <div
              className="
            relative
            h-40
            w-40
            lg:h-48
            lg:w-48     
            aspect-square    
            rounded-full                                                                        
          "
            >
              <Image
                fill
                alt="Playlist"
                className="object-cover rounded-full"
                src={!imagePath ? "/images/profile.png" : imagePath}
                sizes="300px"
              />
            </div>
            <div
              className="
            flex
            flex-col
            gap-y-2
            mt-4
            md:mt-0
            md:items-start items-center
            w-full                                             
          "
            >
              <p className="hidden md:block font-semibold text-sm">Profile</p>
              <h1
                className="
              text-white
              text-4xl
              sm:text-5xl
              lg:text-7xl
              font-bold       
              pb-2
            "
              >
                {user.userDetails?.name === null
                  ? "User"
                  : user.userDetails?.name}
              </h1>
              <div className="flex">
                <p
                  className="text-sm flex cursor-pointer hover:text-white transition text-neutral-400"
                  onClick={() => {
                    router.push("/playlist");
                  }}
                >
                  {playlist.playlist.length}{" "}
                  {playlist.playlist.length === 1 ? "Playlist" : "Playlists"}
                  ,                  
                </p>                
                &nbsp;                                
                <p
                  className="text-sm flex cursor-pointer hover:text-white transition text-neutral-400"
                  onClick={() => {
                    router.push("/library");
                  }}
                >
                  {playlist.songs.length}{" "}
                  {playlist.songs.length === 1 ? "Song" : "Songs"}
                </p>
              </div>
              <div className="flex w-full justify-end">
                <p
                  className="md:text-sm text-xs text-neutral-400 hover:text-white transition cursor-pointer items-center"
                  onClick={onClick}
                >
                  Edit Profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <AccountContent />
    </div>
  );
};

export default AccountHeader;
