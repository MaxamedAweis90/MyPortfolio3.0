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

	type CtaLink = {
		key: "apk" | "play" | "app";
		href: string;
		label: string;
		variant: "primary" | "dark" | "light";
		icon?: JSX.Element;
	};

	const ctaLinks: CtaLink[] = [
		apkUrl
			? {
				key: "apk",
				href: apkUrl,
				label: "Install .apk",
				variant: "primary",
			}
			: null,
		playStoreUrl
			? {
				key: "play",
				href: playStoreUrl,
				label: "Play Store",
				variant: "dark",
				icon: <FaGooglePlay className="text-lg" />,
			}
			: null,
		appStoreUrl
			? {
				key: "app",
				href: appStoreUrl,
				label: "App Store",
				variant: "light",
				icon: <FaApple className="text-lg" />,
			}
			: null,
	].filter(Boolean) as CtaLink[];

	const ctaCount = ctaLinks.length;
	const ctaSpanClass =
		ctaCount === 1 ? "col-span-6" : ctaCount === 2 ? "col-span-3" : "col-span-2";

	return (
		<section className="bg-amber-100 py-20 md:py-20">
			<div className="container mx-auto px-2 md:px-6 max-w-6xl">
				<AutoDownload shouldDownload={shouldAutoDownload} apkUrl={apkUrl} />

				<div className="p-2 pt-5 md:p-10 ">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
						{/* Mobile header: icon left, text right */}
						<div className="flex items-center gap-4 sm:gap-5 md:hidden">
							{appIconUrl && (
								<img
									src={appIconUrl}
									alt={`${project.title} icon`}
									className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] shadow-xl border border-white/60 object-cover"
								/>
							)}
							<div className="flex-1 min-w-0">
								<h1 className="text-3xl font-extrabold text-slate-900 leading-tight truncate">
									{project.title}
								</h1>
								{project.shortTagline && (
									<p className="text-slate-700 text-base leading-snug line-clamp-2">
										{project.shortTagline}
									</p>
								)}
							</div>
						</div>

						{/* Main content with CTAs */}
						<div className="flex-1 flex flex-col gap-3">
							<h1 className="hidden md:block text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
								{project.title}
							</h1>
							{project.shortTagline && (
								<p className="hidden md:block text-slate-700 text-base md:text-lg">{project.shortTagline}</p>
							)}

							{ctaCount > 0 && (
								<div className="grid grid-cols-6 gap-3 w-full md:flex md:flex-wrap md:items-center md:gap-4 mt-1">
									{ctaLinks.map((cta) => {
										const baseButton =
											cta.variant === "primary"
												? "bg-blue-600 hover:bg-blue-700 text-white"
											: cta.variant === "dark"
												? "bg-slate-900 hover:bg-slate-800 text-white"
												: "bg-white hover:bg-slate-100 text-slate-900 border border-slate-200";

										return (
											<a
												key={cta.key}
												href={cta.href}
												target={cta.key !== "apk" ? "_blank" : undefined}
												rel={cta.key !== "apk" ? "noreferrer" : undefined}
												className={`${ctaSpanClass} inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold transition-colors text-sm md:text-base ${baseButton}`}
											>
												{cta.icon}
												<span>{cta.label}</span>
											</a>
										);
									})}
								</div>
							)}
						</div>

						{appIconUrl && (
							<div className="hidden md:flex justify-start md:justify-end">
								<img
									src={appIconUrl}
									alt={`${project.title} icon`}
									className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-[28px] shadow-xl border border-white/60 object-cover"
								/>
							</div>
						)}
					</div>


					{galleryUrls.length > 0 && (
						<div className="mt-8 md:mt-10">
							{/* <h3 className="text-2xl font-semibold mb-4">Screenshots</h3> */}
							<div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 md:static md:left-auto md:right-auto md:w-auto md:translate-x-0">
								<div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 snap-x snap-mandatory scrollbar-screenshots px-0 md:px-0">
									{galleryUrls.map((url, index) => (
										<div
											key={`${project.title}-shot-${index}`}
											className="min-w-[150px] sm:min-w-[180px] md:min-w-[280px] snap-start rounded-2xl overflow-hidden border border-amber-200 bg-amber-50/60 p-2 shadow-lg"
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
						</div>
					)}

					{project.longDescription && (
						<div className="max-w-none mt-10">
							<div className="bg-white/80 border border-amber-200/70 rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
								<h3 className="text-2xl font-semibold mb-3">About this app</h3>
								{project.description && (
									<p className="text-slate-700 leading-relaxed mb-4 text-sm sm:text-base">
										{project.description}
									</p>
								)}
								<div className="prose max-w-none text-slate-800 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6">
									<PortableText value={project.longDescription} />
								</div>
							</div>
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
