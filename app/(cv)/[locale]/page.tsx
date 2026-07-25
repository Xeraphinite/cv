import { CV } from "@/components/sections/cv";
import { getCVData, getCVLastUpdated } from "@/lib/load-cv-data";
import { getVerifiedSocialProfileData } from "@/lib/social-profile-data";
import type { Locale } from "@/lib/types/cv";

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const [cvData, lastUpdated] = await Promise.all([
		getCVData(localeTyped),
		getCVLastUpdated(localeTyped),
	]);
	const socialProfiles = getVerifiedSocialProfileData();

	return (
		<main className="min-h-screen bg-background">
			<div className="flex justify-center p-0">
				<CV
					data={cvData}
					locale={locale}
					lastUpdated={lastUpdated}
					socialProfiles={socialProfiles}
				/>
			</div>
		</main>
	);
}
