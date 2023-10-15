import Header from "@/components/Header";
import LibraryContent from "./components/LibraryContent";
import { Song } from "@/types";
import getSongsByUserId from "@/actions/getSongsByUserId";

const Library = async () => {
  const userSongs = await getSongsByUserId();

  return (  
    <div 
      className="
        bg-neutral-900                
        h-[calc(100vh-95px)]
        w-full
        overflow-hidden
        overflow-y-auto
        rounded-lg        
    ">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-bold">
            Library
          </h1>          
        </div>
        <LibraryContent songs={userSongs} />
      </Header>            
    </div>
  );
}
 
export default Library;