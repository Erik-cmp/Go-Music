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
import Head from "next/head";

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
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={figtree.className}>
        <VolumeProvider>
          <ToasterProvider />
          <SupabaseProvider>
            <UserProvider>
              <ModalProvider products={products} />
              <Sidebar songs={userSongs}>{children}</Sidebar>
              <ShuffleProvider>
                <Player />
              </ShuffleProvider>
            </UserProvider>
          </SupabaseProvider>
        </VolumeProvider>
      </body>
    </html>
  );
}
