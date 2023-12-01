"use client"
import Image from "next/image";
import useGetPlaylistDetail from "@/hooks/useGetPlaylistDetail";
import useLoadPlaylistImageSingle from "@/hooks/useLoadPlaylistImageSingle";
import useGetSongsInPlaylist from "@/hooks/useGetSongsInPlaylist";

export const revalidate = 0;

const PlaylistHeader = () => {  
  const url = typeof window !== "undefined" ? window.location.href : "";
  const id = url.split("/playlist/")[1];

  // console.log(id);
  const playlists = useGetPlaylistDetail(id);  
  const imagePath = useLoadPlaylistImageSingle(playlists.playlist as any);
  // console.log(imagePath);  

  const playlistSongs = useGetSongsInPlaylist(id);  
  // console.log(playlistSongs);

  const songs = playlistSongs.songs
  
  const totalSongs = songs.length;

  const totalDuration = songs.reduce((sum, song) => sum + song.song_length, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="md:mt-16 mt-8">
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
            "
        >
          <Image
            fill
            alt="Playlist"
            className="object-cover rounded"
            src={imagePath || '/images/liked.png'}
            sizes="400px"
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
                md:mb-2                                                                         
                mb-0
              "
          >
            {playlists.playlist?.title}
          </h1>
          <p className="text-xs text-neutral-400">
            {playlists.playlist?.description}
          </p>
          <p className="text-sm">
            {totalSongs} {totalSongs === 1 ? "song" : "songs"}, &nbsp;
            <span className="text-neutral-400">
              {hours > 0 ? `${hours} hr ` : ""}
              {minutes} min
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;
