export const revalidate = 60;

import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { client as sanityClient } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import AutoDownload from "./AutoDownload";
import { TOOL_ICONS } from "@/components/toolIcons";
import { FaApple, FaGooglePlay } from "react-icons/fa";

type ProjectDetails = {
	title: string;
	description?: string;
	longDescription?: PortableTextBlock[];
	category?: string;
	tools?: { _id?: string; title?: string; icon?: string; color?: string }[];
	images?: SanityImageSource[];
	screenshots?: SanityImageSource[];
	appIcon?: unknown;
	apkFile?: { asset?: { url?: string } };
	shortTagline?: string;
	playStoreUrl?: string;
	appStoreUrl?: string;
};

export async function generateStaticParams() {
	const slugs = await sanityClient.fetch<string[]>(
		`*[_type in ["webProject", "mobileProject", "designProject"]].slug.current`
	);
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = await sanityClient.fetch<{ title?: string; description?: string }>(
		`*[_type in ["webProject", "mobileProject", "designProject"] && slug.current == $slug][0]{ title, description }`,
		{ slug }
	);
	if (!project) return {};
	return {
		title: project.title ? `${project.title} | My Portfolio` : "My Portfolio",
		description: project.description,
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

	const project = await sanityClient.fetch<ProjectDetails>(
		`*[_type in ["webProject", "mobileProject", "designProject"] && slug.current == $slug][0]{
			title,
			description,
			longDescription,
			tools[]->{ _id, title, icon, color },
			images,
			screenshots,
			appIcon,
			apkFile,
			shortTagline,
			playStoreUrl,
			appStoreUrl
		}`,
		{ slug }
	);

	if (!project) {
		notFound();
	}

	const appIconUrl = project.appIcon
		? urlFor(project.appIcon).width(160).height(160).url()
		: undefined;
	const apkUrl = project.apkFile?.asset?.url;
	const playStoreUrl = project.playStoreUrl;
	const appStoreUrl = project.appStoreUrl;

	const galleryImages = (project.screenshots?.length ? project.screenshots : project.images) || [];
	const galleryUrls = galleryImages.map((img) =>
		urlFor(img).width(900).height(1800).fit("max").url()
	);

	const shouldAutoDownload = resolvedSearchParams?.install === "1";

	return (
		<section className="bg-amber-100 py-20">
			<div className="container mx-auto px-4 max-w-6xl">
				<AutoDownload shouldDownload={shouldAutoDownload} apkUrl={apkUrl} />

				<div className="rounded-3xl p-6 md:p-10 border border-amber-200/60">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
						<div className="flex-1">
							<h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">
								{project.title}
							</h1>
							{project.shortTagline && (
								<p className="text-slate-700 mt-2 text-lg">{project.shortTagline}</p>
							)}

							<div className="flex flex-wrap gap-3 mt-4">
								{apkUrl && (
									<a
										href={apkUrl}
										className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
									>
										Install .apk
									</a>
								)}
								{playStoreUrl && (
									<a
										href={playStoreUrl}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-full transition-colors"
										aria-label="Open Play Store"
									>
										<FaGooglePlay className="text-lg" />
										<span className="sr-only">Play Store</span>
									</a>
								)}
								{appStoreUrl && (
									<a
										href={appStoreUrl}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-900 px-4 py-3 rounded-full border border-slate-200 transition-colors"
										aria-label="Open App Store"
									>
										<FaApple className="text-lg" />
										<span className="sr-only">App Store</span>
									</a>
								)}
							</div>
						</div>

						{appIconUrl && (
							<div className="flex justify-start md:justify-end">
								<img
									src={appIconUrl}
									alt={`${project.title} icon`}
									className="w-28 h-28 md:w-36 md:h-36 rounded-[28px] shadow-xl border border-white/60 object-cover"
								/>
							</div>
						)}
					</div>


					{galleryUrls.length > 0 && (
						<div className="mt-8">
							<h3 className="text-2xl font-semibold mb-4">Screenshots</h3>
							<div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-whatsapp">
								{galleryUrls.map((url, index) => (
									<div
											key={`${project.title}-shot-${index}`}
											className="min-w-[220px] sm:min-w-[260px] md:min-w-[280px] snap-start rounded-2xl overflow-hidden border border-amber-200 bg-amber-50/60 p-2 shadow-lg"
										>
											<img
												src={url}
												alt={`${project.title} screenshot ${index + 1}`}
												className="w-full aspect-[9/18] object-contain"
											/>
										</div>
								))}
							</div>
						</div>
					)}

					{project.longDescription && (
						<div className="prose max-w-none mt-10">
							<h3 className="text-2xl font-semibold mb-4">About this app</h3>
							<PortableText value={project.longDescription} />
						</div>
					)}

					{project.tools?.length ? (
						<div className="mt-10">
							<h3 className="text-2xl font-semibold mb-4">Tools Used</h3>
							<div className="flex flex-wrap gap-3">
								{project.tools.map((tool) => {
									if (!tool?.title) return null;
									const IconComponent = tool.icon ? TOOL_ICONS[tool.icon] : undefined;
									const isTailwind = tool.color?.startsWith("text-");
									return (
										<span
											key={tool._id || tool.title}
											className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 ${
												isTailwind ? tool.color : ""
											}`}
											style={!isTailwind && tool.color ? { color: tool.color } : {}}
										>
											{IconComponent ? <IconComponent className="text-base" /> : "🔧"}
											{tool.title}
										</span>
									);
								})}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
