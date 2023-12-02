import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";

import PageContent from "./components/PageContent";
import Greeting from "./components/Greeting";
import getPlaylistsByUser from "@/actions/getPlaylistsByUser";
import PlaylistContent from "@/components/PlaylistsContent";
import ViewMore from "./components/ViewMore";
import Footer from "@/components/Footer";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const playlists = await getPlaylistsByUser();

  // throw new Error('test');

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
        <div className="mb-2">
          <Greeting />
          <PlaylistContent playlists={playlists} />
        </div>
        <ViewMore/>
      </Header>
      <div className="mb-7 px-6 min-h-[80vh]">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Recently Uploaded
          </h1>
        </div>
        <PageContent songs={songs} />
      </div>
      <Footer />
    </div>
  );
}
