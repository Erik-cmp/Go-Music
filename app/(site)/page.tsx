import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";

import PageContent from "./components/PageContent";
import Greeting from "./components/Greeting";
import getPlaylistsByUser from "@/actions/getPlaylistsByUser";
import PlaylistContent from "@/components/PlaylistsContent";

import { IoIosArrowRoundForward } from "react-icons/io";

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
      md:h-[calc(100%-72px)] h-[calc(100%-60px)]
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
        <div className="flex items-end justify-end w-full pt-1">
          <a
            href="playlist"
            className="md:text-sm text-xs text-neutral-400 hover:text-white transition"
          >
            <div className="flex items-center">
              View more
              <IoIosArrowRoundForward size={22} />
            </div>
          </a>
        </div>
      </Header>
      <div className="mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Recently Uploaded
          </h1>
        </div>
        <PageContent songs={songs} />
      </div>
    </div>
  );
}
