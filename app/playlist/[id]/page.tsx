import Header from "@/components/Header";
import PlaylistDetail from "./components/PlaylistDetail";
import getSongsByUserId from "@/actions/getSongsByUserId";
import PlaylistHeader from "./components/PlaylistHeader";


export const revalidate = 0;

const Playlist = async () => {
    
  const songs = await getSongsByUserId();

  return (
    <div 
      className="
        bg-neutral-900                
        md:h-[calc(100%-72px)] h-[calc(100%-60px)]
        w-full
        overflow-hidden
        overflow-y-auto
        rounded-lg        
    ">
      <Header>        
        <PlaylistHeader/>
      </Header>            
      <PlaylistDetail/>        
    </div>
  );
};

export default Playlist;
