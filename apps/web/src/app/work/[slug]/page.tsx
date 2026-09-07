import { notFound } from "next/navigation";
import { getPublicProjects, getPublicProjectBySlug } from "@/lib/portfolio-service";
import MobileProjectView from "./MobileProjectView";
import WebProjectView from "./WebProjectView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const projects = await getPublicProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title ? `${project.title} | Portfolio Case Study` : "My Portfolio",
    description: project.description || project.shortTagline,
  };
}

export default async function ProjectDetails({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ install?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isMobile =
    project.category?.trim().toLowerCase().includes("mobile") ||
    Boolean(project.playStoreUrl || project.appStoreUrl || project.apkUrl);

  const shouldAutoDownload = resolvedSearchParams?.install === "1";

  if (isMobile) {
    return (
      <MobileProjectView
        project={project}
        shouldAutoDownload={shouldAutoDownload}
      />
    );
  }

  return <WebProjectView project={project} />;
}
