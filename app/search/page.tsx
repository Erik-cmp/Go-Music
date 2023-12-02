import getSongsByTitle from "@/actions/getSongsByTitleAndAuthor";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import getSongsByTitleAndAuthor from "@/actions/getSongsByTitleAndAuthor";
import Footer from "@/components/Footer";

interface SearchProps {
  searchParams: {
    title: string;
    author: string;
  }
};

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
  const songs = await getSongsByTitleAndAuthor(searchParams.title || searchParams.author);

  return(
    <div className="
      bg-neutral-900
      rounded-lg
      md:h-[calc(100%-72px)] h-[calc(100%-50px)]
      w-full
      overflow-hidden
      overflow-y-auto
    ">
      <Header className="from-bg-neutral-900">
        <div className="
          mb-2
          flex
          flex-col
          gap-y-6
        ">
          <h1 className="text-white text-3xl font-semibold">
            Search
          </h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs}/>
      <Footer />
    </div>
  )
}

export default Search;