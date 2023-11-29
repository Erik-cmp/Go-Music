import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import { VolumeProvider } from "@/contexts/VolumeContext";
import Player from "@/components/Player";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";
import { ShuffleProvider } from "@/contexts/ShuffleContext";
import { SongDetailProvider } from "@/contexts/SongDetailContext";
import getPlaylistsByUser from "@/actions/getPlaylistsByUser";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Go-Tunes",
  description: "Pasti ada jalan",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongsByUserId();
  const userPlaylists = await getPlaylistsByUser();
  const products = await getActiveProductsWithPrices();
  const playlist = await getPlaylistsByUser();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={figtree.className}>
        <VolumeProvider>
          <ToasterProvider />
          <SupabaseProvider>
            <UserProvider>
              <ModalProvider products={products} song={userSongs[0]} playlist={playlist[0]} />
              <SongDetailProvider>
                <Sidebar playlists={userPlaylists}>{children}</Sidebar>
                <ShuffleProvider>
                  <Player playlist={userPlaylists}/>
                </ShuffleProvider>
              </SongDetailProvider>
            </UserProvider>
          </SupabaseProvider>
        </VolumeProvider>
      </body>
    </html>
  );
}
