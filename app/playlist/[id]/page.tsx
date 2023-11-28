import Header from "@/components/Header";
import PlaylistDetail from "./components/PlaylistDetail";

export const revalidate = 0;

const Playlist = async () => {
  
  return (
    <div className="bg-neutral-900 rounded-lg md:h-[calc(100%-72px)] h-[calc(100%-60px)] w-full overflow-hidden overflow-y-auto">
      <Header>
        <PlaylistDetail />
      </Header>
    </div>
  );
};

export default Playlist;
