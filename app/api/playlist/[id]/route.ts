// app/api/playlist/[id]/route.ts
import { NextResponse } from "next/server";
import getPlaylistDetail from "@/actions/getPlaylistDetail";

export async function GET(req: any) {
  console.log("route.ts is called!")
  const { id } = req.query;
  const playlist = await getPlaylistDetail(id as string);
  return NextResponse.json(playlist);
}
