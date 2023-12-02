import Header from "@/components/Header";
import getPlaylistsByUser from "@/actions/getPlaylistsByUser";
import PlaylistContent from "./components/PlaylistContent";
import Footer from "@/components/Footer";

export const revalidate = 0;

const Playlist = async () => {
  const playlists = await getPlaylistsByUser();

  return (
    <div
      className="
  bg-neutral-900
  rounded-lg
  md:h-[calc(100%-72px)] h-[calc(100%-50px)]
  w-full
  overflow-hidden
  overflow-y-auto
"
    >
      <Header>
        
      </Header>
      <PlaylistContent playlists={playlists} />
      <Footer />
    </div>
  );
};

export default Playlist;
