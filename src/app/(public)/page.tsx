import { CategoriesSection } from "@/components/home/categories-section";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import { Hero } from "@/components/home/hero";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { RecentPapersSection } from "@/components/home/recent-papers-section";
import { StatsBand } from "@/components/home/stats-band";
import { StepsSection } from "@/components/home/steps-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getHomePapers, getPublicStats } from "@/db/queries";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

// Page statique revalidée toutes les heures (et à chaque mutation admin,
// cf. revalidatePublicCatalog) : les épreuves récentes et les chiffres
// viennent de la base.
export const revalidate = 3600;

export default async function HomePage() {
  const [papers, stats] = await Promise.all([
    getHomePapers(5),
    getPublicStats(),
  ]);

  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <Hero />
      <CategoriesSection />
      <RecentPapersSection papers={papers} />
      <StatsBand stats={stats} />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
