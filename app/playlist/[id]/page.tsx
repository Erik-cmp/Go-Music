import Header from "@/components/Header";
import PlaylistDetail from "./components/PlaylistDetail";
import getSongsByUserId from "@/actions/getSongsByUserId";
import PlaylistHeader from "./components/PlaylistHeader";
import Footer from "@/components/Footer";
import getPlaylistsByUser from "@/actions/getPlaylistsByUser";


export const revalidate = 0;

const Playlist = async () => {
    
  const songs = await getSongsByUserId();
  const playlist = await getPlaylistsByUser();

  return (
    <div 
      className="
        bg-neutral-900                
        md:h-[calc(100%-72px)] h-[calc(100%-50px)]
        w-full
        overflow-hidden
        overflow-y-auto
        rounded-lg        
    ">
      <Header>        
        <PlaylistHeader playlists={playlist}/>
      </Header>            
      <PlaylistDetail/>     
      <Footer />   
    </div>
  );
};

export default Playlist;
