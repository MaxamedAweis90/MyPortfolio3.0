import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Sanity disabled. App is UI-only." });
}
