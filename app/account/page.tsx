import getPlaylistsByUser from "@/actions/getPlaylistsByUser";
import AccountHeader from "@/components/AccountHeader";
import getSongsByUserId from "@/actions/getSongsByUserId";

const Account = async () => {
  const playlist = await getPlaylistsByUser();  
  const songs = await getSongsByUserId();

  return (
    <div
      className="
    bg-neutral-900
    rounded-lg
    md:h-[calc(100%-72px)] h-[calc(100%-50px)]
    w-full "
    >
      <AccountHeader playlist={playlist} songs={songs}/>            
    </div>
  );
};

export default Account;
