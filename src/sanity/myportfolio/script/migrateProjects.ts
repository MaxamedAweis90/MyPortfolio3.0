import { createClient } from '@sanity/client';

type LegacyProject = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: string;
  tools?: unknown[];
  description?: string;
  shortTagline?: string;
  appIcon?: unknown;
  apkFile?: unknown;
  screenshots?: unknown[];
  longDescription?: unknown;
  date?: string;
  duration?: string;
  team?: string[];
  images?: unknown[];
  video?: string;
  liveProjectUrl?: string;
  orderRank?: string;
};

const client = createClient({
  projectId: 'yf7fdygw',
  dataset: 'production',
  apiVersion: '2025-05-02',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN as string | undefined,
});

const toTargetType = (category?: string) => {
  if (category === 'Mobile') return 'mobileProject';
  if (category === 'Design') return 'designProject';
  return 'webProject';
};

const buildDoc = (project: LegacyProject): { _id: string; _type: string } & Record<string, unknown> => {
  const targetType = toTargetType(project.category);
  const base = {
    _id: `${targetType}-${project._id}`,
    _type: targetType,
    title: project.title,
    slug: project.slug,
    tools: project.tools,
    description: project.description,
    longDescription: project.longDescription,
    images: project.images,
    video: project.video,
    liveProjectUrl: project.liveProjectUrl,
    date: project.date,
    duration: project.duration,
    team: project.team,
    orderRank: project.orderRank,
  };

  if (targetType === 'mobileProject') {
    return {
      _id: base._id,
      _type: base._type,
      title: base.title,
      slug: base.slug,
      tools: base.tools,
      description: base.description,
      longDescription: base.longDescription,
      shortTagline: project.shortTagline,
      appIcon: project.appIcon,
      apkFile: project.apkFile,
      screenshots: project.screenshots,
      orderRank: base.orderRank,
    };
  }

  if (targetType === 'designProject') {
    return {
      _id: base._id,
      _type: base._type,
      title: base.title,
      slug: base.slug,
      tools: base.tools,
      description: base.description,
      longDescription: base.longDescription,
      images: base.images,
      liveProjectUrl: base.liveProjectUrl,
      orderRank: base.orderRank,
    };
  }

  return base;
};

const main = async () => {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN in environment.');
  }

  const legacyProjects = await client.fetch<LegacyProject[]>(
    `*[_type == "project"]{
      _id,
      title,
      slug,
      category,
      tools,
      description,
      shortTagline,
      appIcon,
      apkFile,
      screenshots,
      longDescription,
      date,
      duration,
      team,
      images,
      video,
      liveProjectUrl,
      orderRank
    }`
  );

  if (!legacyProjects.length) {
    console.log('No legacy project documents found.');
    return;
  }

  const transaction = client.transaction();

  legacyProjects.forEach((project: LegacyProject) => {
    const newDoc = buildDoc(project);
    transaction
      .createIfNotExists(newDoc as { _id: string; _type: string } & Record<string, unknown>)
      .delete(project._id);
  });

  const result = await transaction.commit();
  console.log(`Migrated ${legacyProjects.length} projects.`);
  console.log('Transaction result:', result?.results?.length || 0, 'mutations');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
