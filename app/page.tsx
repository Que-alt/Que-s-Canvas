import AwardsSection from "@/components/AwardsSection";
import BrandGallery from "@/components/BrandGallery";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import OverlappingVideoSection from "@/components/OverlappingVideoSection";
import SkillsSection from "@/components/SkillsSection";
import WorkShowcase from "@/components/WorkShowcase";
import { showreel, site } from "@/data/site";
import { workCategories } from "@/data/work";

export default function Home() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    sameAs: [site.contact.linkedin, site.contact.github].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <OverlappingVideoSection {...showreel} />
      <WorkShowcase categories={workCategories} />
      <SkillsSection />
      <BrandGallery />
      <AwardsSection />
      <ContactSection />
    </>
  );
}
