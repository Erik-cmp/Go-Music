import Image from "next/image";

import getLikedSongs from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import LikedContent from "./components/LikedContent";

export const revalidate = 0;

const Liked = async () => {
  const songs = await getLikedSongs();

  const totalSongs = songs.length;

  const totalDuration = songs.reduce((sum, song) => sum + song.song_length, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

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
              shadow                                  
            "
            >
              <Image
                fill
                alt="Playlist"
                className="object-cover rounded"
                src="/images/liked.png"
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
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1
                className="
                text-white
                text-4xl
                sm:text-5xl
                lg:text-7xl
                font-bold                                                                               
              "
              >
                Liked Songs
              </h1>
              <p className="text-sm">
                {totalSongs} {totalSongs === 1 ? "song" : "songs"},                
                &nbsp;
                <span className="text-neutral-400">                  
                  {hours > 0 ? `${hours} hr ` : ""}
                  {minutes} min
                </span>
              </p>
            </div>
          </div>
        </div>
      </Header>
      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;
