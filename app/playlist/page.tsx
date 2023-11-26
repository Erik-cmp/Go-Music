
import Header from "@/components/Header";
import getPlaylistsByUser from "@/actions/getPlaylistsByUser";
import PlaylistContent from "./components/PlaylistContent";

export const revalidate = 0;

const Playlist = async () => {
  const playlists = await getPlaylistsByUser();
  
  return (
    <div
      className="
      bg-neutral-900
      rounded-lg
      md:h-[calc(100%-72px)] h-[calc(100%-60px)]
      w-full
      overflow-hidden
      overflow-y-auto
    "
    >
      <Header>
        <div className="md:mt-20 mt-8">
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
              flex
              flex-col
              gap-y-2
              mt-4
              md:mt-0
              items-start
              w-full            
            "
            >              
              <h1
                className="
                text-white
                text-3xl
                sm:text-4xl
                lg:text-6xl
                font-bold                                                                               
              "
              >
                Your Playlists
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <PlaylistContent playlists={playlists} />
    </div>
  );
};

export default Playlist;
