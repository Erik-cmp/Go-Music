import getPlaylistsByUser from "@/actions/getPlaylistsByUser";
import AccountHeader from "@/components/AccountHeader";
import getSongsByUserId from "@/actions/getSongsByUserId";
import AccountContent from "./components/AccountContent";
import Footer from "@/components/Footer";

const Account = async () => {
  const playlist = await getPlaylistsByUser();
  const songs = await getSongsByUserId();

  return (
    <div
      className="
      bg-neutral-900                
      md:h-[calc(100%-72px)] h-[calc(100%-50px)]
      w-full
      overflow-hidden
      overflow-y-auto
      rounded-lg
      "
    >
      <AccountHeader playlist={playlist} songs={songs} />
      <AccountContent />
      <Footer />
    </div>
  );
};

export default Account;
