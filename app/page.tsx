import BrandGallery from "@/components/BrandGallery";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import HorizontalProjectGallery from "@/components/HorizontalProjectGallery";
import SkillsSection from "@/components/SkillsSection";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

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
      <HorizontalProjectGallery projects={projects} />
      <SkillsSection />
      <BrandGallery />
      <ContactSection />
    </>
  );
}
