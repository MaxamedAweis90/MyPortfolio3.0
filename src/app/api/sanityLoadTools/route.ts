import { createClient } from '@sanity/client';
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
  token: process.env.SANITY_API_TOKEN as string, // Make sure this token exists and has write access!
  useCdn: false,
  apiVersion: '2024-07-01',
});

type SanityDocument = Record<string, unknown> & { _id: string; _type: string };

export async function POST(request: Request) {
  let data: SanityDocument[];

  try {
    data = (await request.json()) as SanityDocument[];
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Expected an array of documents" }, { status: 400 });
  }

  const validDocs = data.filter((doc) =>
    typeof doc?._id === "string" && doc._id && typeof doc?._type === "string" && doc._type
  );

  if (!validDocs.length) {
    return NextResponse.json({ error: "No valid documents to insert" }, { status: 400 });
  }

  try {
    await Promise.all(validDocs.map((doc) => client.createIfNotExists(doc)));
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error inserting tools" }, { status: 500 });
  }
}
