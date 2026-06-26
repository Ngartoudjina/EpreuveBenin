import { CtaSection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import { Hero } from "@/components/home/hero";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { StepsSection } from "@/components/home/steps-section";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <Hero />
      <ShowcaseSection />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
    </>
  );
}
