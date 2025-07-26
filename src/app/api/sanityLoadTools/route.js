import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // Make sure this token exists and has write access!
  useCdn: false,
  apiVersion: '2024-07-01',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const data = JSON.parse(req.body);
    await Promise.all(
      data.map(doc => client.createIfNotExists(doc))
    );
    return res.status(200).json({ status: 'success' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error inserting tools' });
  }
}
