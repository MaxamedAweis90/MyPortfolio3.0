import { notFound } from "next/navigation";
import Image from "next/image";
import AutoDownload from "./AutoDownload";
import { TOOL_ICONS } from "@/components/toolIcons";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { projectsData } from "@/data/portfolioData";

export async function generateStaticParams() {
	return projectsData.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = projectsData.find((p) => p.slug === slug);
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

	const project = projectsData.find((p) => p.slug === slug);

	if (!project) {
		notFound();
	}

	const appIconUrl = project.appIconUrl;
	const apkUrl = project.apkUrl;
	const playStoreUrl = project.playStoreUrl;
	const appStoreUrl = project.appStoreUrl;

	const galleryUrls = (project.screenshots?.length ? project.screenshots : project.images) || [];

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
		<section className="bg-mainBg py-20 md:py-20 min-h-screen text-primaryText">
			<div className="container mx-auto px-2 md:px-6 max-w-6xl">
				<AutoDownload shouldDownload={shouldAutoDownload} apkUrl={apkUrl} />

				<div className="p-2 pt-5 md:p-10 ">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
						{/* Mobile header: icon left, text right */}
						<div className="flex items-center gap-4 sm:gap-5 md:hidden">
							{appIconUrl && (
								<Image
									src={appIconUrl}
									alt={`${project.title} icon`}
									width={96}
									height={96}
									className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] shadow-xl border border-borderSubtle object-cover"
								/>
							)}
							<div className="flex-1 min-w-0">
								<h1 className="text-3xl font-extrabold text-primaryText leading-tight truncate">
									{project.title}
								</h1>
								{project.shortTagline && (
									<p className="text-mutedText text-base leading-snug line-clamp-2">
										{project.shortTagline}
									</p>
								)}
							</div>
						</div>

						{/* Main content with CTAs */}
						<div className="flex-1 flex flex-col gap-3">
							<h1 className="hidden md:block text-3xl md:text-5xl font-extrabold text-primaryText leading-tight">
								{project.title}
							</h1>
							{project.shortTagline && (
								<p className="hidden md:block text-mutedText text-base md:text-lg">{project.shortTagline}</p>
							)}

							{ctaCount > 0 && (
								<div className="grid grid-cols-6 gap-3 w-full md:flex md:flex-wrap md:items-center md:gap-4 mt-1">
									{ctaLinks.map((cta) => {
										const baseButton =
											cta.variant === "primary"
												? "bg-brandAccent hover:bg-secondaryAccent text-white"
											: cta.variant === "dark"
												? "bg-surface hover:bg-borderSubtle text-primaryText border border-borderSubtle"
												: "bg-surface hover:bg-borderSubtle text-primaryText border border-borderSubtle";

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
								<Image
									src={appIconUrl}
									alt={`${project.title} icon`}
									width={144}
									height={144}
									className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-[28px] shadow-xl border border-borderSubtle object-cover"
								/>
							</div>
						)}
					</div>


					{galleryUrls.length > 0 && (
						<div className="mt-8 md:mt-10">
							<div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 md:static md:left-auto md:right-auto md:w-auto md:translate-x-0">
								<div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 snap-x snap-mandatory scrollbar-screenshots px-0 md:px-0">
									{galleryUrls.map((url, index) => (
										<div
											key={`${project.title}-shot-${index}`}
											className="min-w-[150px] sm:min-w-[180px] md:min-w-[280px] snap-start rounded-2xl overflow-hidden border border-borderSubtle bg-surface p-2 shadow-lg relative aspect-[9/18]"
										>
											<Image
												src={url}
												alt={`${project.title} screenshot ${index + 1}`}
												fill
												loading="lazy"
												sizes="(max-width: 768px) 180px, 280px"
												className="object-contain"
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{(project.description || project.longDescription?.length) && (
						<div className="max-w-none mt-10">
							<div className="bg-surface border border-borderSubtle rounded-2xl p-5 sm:p-6 md:p-8 shadow-md">
								<h3 className="text-2xl font-semibold mb-3 text-primaryText">About this app</h3>
								{project.description && (
									<p className="text-mutedText leading-relaxed mb-4 text-sm sm:text-base">
										{project.description}
									</p>
								)}
								{project.longDescription && (
									<div className="prose max-w-none text-mutedText space-y-3">
										{project.longDescription.map((paragraph, idx) => (
											<p key={idx} className="leading-relaxed">
												{paragraph}
											</p>
										))}
									</div>
								)}
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
											className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-borderSubtle bg-mainBg text-primaryText ${
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
