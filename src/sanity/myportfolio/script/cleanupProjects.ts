import { createClient } from '@sanity/client';

type DocId = { _id: string };

type CleanupPlan = {
  type: string;
  unset: string[];
};

const client = createClient({
  projectId: 'yf7fdygw',
  dataset: 'production',
  apiVersion: '2025-05-02',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN as string | undefined,
});

const cleanupPlans: CleanupPlan[] = [
  {
    type: 'webProject',
    unset: ['shortTagline', 'appIcon', 'apkFile', 'screenshots'],
  },
  {
    type: 'mobileProject',
    unset: ['date', 'duration', 'team', 'images', 'video', 'liveProjectUrl'],
  },
  {
    type: 'designProject',
    unset: ['shortTagline', 'appIcon', 'apkFile', 'screenshots', 'date', 'duration', 'team', 'video'],
  },
];

const main = async () => {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN in environment.');
  }

  for (const plan of cleanupPlans) {
    const docs = await client.fetch<DocId[]>(`*[_type == "${plan.type}"]{ _id }`);
    if (!docs.length) {
      console.log(`No ${plan.type} docs to clean.`);
      continue;
    }

    const transaction = client.transaction();
    docs.forEach((doc) => {
      transaction.patch(doc._id, (patch) => patch.unset(plan.unset));
    });

    const result = await transaction.commit();
    console.log(`Cleaned ${docs.length} ${plan.type} documents.`);
    console.log('Transaction result:', result?.results?.length || 0, 'mutations');
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
