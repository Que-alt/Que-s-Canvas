import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import AnimatedText from "@/components/AnimatedText";
import CaseSection, { Placeholder } from "@/components/case-study/CaseSection";
import ProjectCover from "@/components/ProjectCover";
import Reveal from "@/components/Reveal";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.cover ? [{ url: project.cover.src, alt: project.cover.alt }] : undefined,
    },
  };
}

const prose = "max-w-[62ch] text-lg leading-relaxed text-ink md:text-xl";

// Body copy inside the shared problem / approach / outcome panel: set smaller so all three fit beside the work
const storyText = "max-w-[56ch] leading-relaxed text-ink md:text-lg lg:text-[clamp(0.9rem,min(1.15vw,2.3svh),1.1rem)]";

type StoryPart = { index: number; title: string; question: string; body: ReactNode };

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const cs = project.caseStudy ?? {};

  const meta = [
    project.client
      ? { label: "Client", value: project.client }
      : { label: "Product", value: project.product && `${project.product} · In-house product` },
    { label: "Executed at", value: project.agency },
    { label: "Discipline", value: project.category },
    { label: "Year", value: project.year },
  ].filter((m) => m.value);

  // Numbered in reading order; Overview appears only once it's written. The problem, the
  // approach and the outcome share one panel: their text holds in place while the work scrolls.
  let n = 0;
  const overviewIndex = cs.overview ? ++n : 0;
  const story: StoryPart[] = [
    {
      index: ++n,
      title: "The Business Problem",
      question: "Why did it matter?",
      body: cs.challenge ? <p className={storyText}>{cs.challenge}</p> : <Placeholder field="challenge" compact />,
    },
    {
      index: ++n,
      title: "The Approach & Solution",
      question: "How did we solve it?",
      body: (
        <>
          {cs.approach ? <p className={storyText}>{cs.approach}</p> : <Placeholder field="approach" compact />}
          {cs.process?.length ? (
            <ol className="mt-4 space-y-2">
              {cs.process.map((step, i) => (
                <li key={step.title} className={storyText}>
                  <span className="mr-2 font-label text-xs text-electric">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{step.title}</span> — {step.body}
                </li>
              ))}
            </ol>
          ) : null}
          {cs.stack?.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {cs.stack.map((t) => (
                <li key={t} className="rounded-full border border-ink/15 px-3 py-1.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ),
    },
    {
      index: ++n,
      title: "The Outcome",
      question: "Let the work speak for itself.",
      body: (
        <>
          {cs.outcome ? <p className={storyText}>{cs.outcome}</p> : cs.outcomes?.length ? null : <Placeholder field="outcome" compact />}
          {cs.outcomes?.length ? (
            <ul className="mt-3">
              {cs.outcomes.map((o) => (
                <li key={o} className={`flex gap-3 border-b border-ink/10 py-2.5 ${storyText}`}>
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-electric" aria-hidden />
                  {o}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ),
    },
  ];
  const roleIndex = ++n;

  // Screens and prototypes, or one labelled slot per screen still to come. Every third tile
  // (1st, 4th, …) runs full width, the two between share a row, unless the gallery sets
  // `wide` on its images, which then decides it image by image.
  const explicit = cs.gallery?.some((img) => img.wide !== undefined);
  const wide = (i: number) => (explicit ? !!cs.gallery?.[i]?.wide : i % 3 === 0);
  const work = (
    <div className="grid gap-5 sm:grid-cols-2">
      {cs.gallery?.length
        ? cs.gallery.map((img, i) => (
            <figure key={img.src} className={wide(i) ? "sm:col-span-2" : undefined}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={wide(i) ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover"
                />
              </div>
              {img.caption && <figcaption className="mt-3 text-sm text-ink-2">{img.caption}</figcaption>}
            </figure>
          ))
        : (cs.showcase?.length ? cs.showcase : ["Screenshot", "Screenshot", "Screenshot"]).map((label, i) => (
            <div
              key={`${label}-${i}`}
              className={`grid aspect-[16/10] place-items-center rounded-[24px] border border-dashed border-ink/20 bg-white/60 p-6 text-center ${
                wide(i) ? "sm:col-span-2" : ""
              }`}
            >
              <span className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">{label} — image to come</span>
            </div>
          ))}
    </div>
  );

  return (
    <article className="bg-paper">
      {/* Header */}
      <header className="mx-auto max-w-[1680px] px-gutter pt-16 md:pt-20">
        <Link
          href="/#work"
          className="link-underline inline-flex items-center gap-2 font-label text-xs uppercase tracking-[0.16em] text-ink-2"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Selected Works
        </Link>

        {/* Title and one-liner on the left; the project details beside them on wide screens */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,17rem)] lg:items-end lg:gap-16">
          <div>
            <AnimatedText
              as="h1"
              mode="inView"
              text={project.title}
              className="mt-8 max-w-[20ch] text-balance text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.045em]"
            />
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-[40ch] text-lg leading-snug text-ink-2 md:text-2xl md:leading-snug">
                {project.tagline}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <dl className="grid gap-x-8 gap-y-3 border-t border-line pt-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-y-3 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">{m.label}</dt>
                  <dd className="mt-1">{m.value}</dd>
                </div>
              ))}
            </dl>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 inline-flex items-center gap-3 text-ink-2 transition-colors hover:text-ink lg:ml-8"
              >
                View the project
                <span className="grid size-10 place-items-center rounded-full bg-brand bg-iridescent text-white transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </a>
            )}
          </Reveal>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-[1680px] px-gutter md:mt-12">
        {overviewIndex ? (
          <CaseSection index={overviewIndex} title="Overview" question="What did we set out to create?">
            <p className={prose}>{cs.overview}</p>
          </CaseSection>
        ) : null}

        {/* Why it mattered → how → the result: the text stays put (desktop) while the work scrolls past */}
        <section
          aria-label="The problem, the approach and the outcome"
          className="my-4 grid gap-12 rounded-[28px] bg-[#efe8fb] px-6 py-14 md:my-8 md:rounded-[40px] md:px-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-14"
        >
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-10 lg:gap-[clamp(1.1rem,3svh,2rem)]">
              {story.map((part) => (
                <div key={part.title}>
                  <p className="font-label text-xs text-electric">{String(part.index).padStart(2, "0")}</p>
                  <h2 className="mt-1.5 text-2xl font-medium tracking-[-0.03em] lg:text-[clamp(1.25rem,min(1.6vw,3.2svh),1.75rem)]">
                    {part.title}
                  </h2>
                  <p className="mt-1 text-ink-2 lg:text-[clamp(0.9rem,min(1.05vw,2.15svh),1.05rem)]">{part.question}</p>
                  <div className="mt-4 lg:mt-3">{part.body}</div>
                </div>
              ))}
            </div>
          </div>
          {work}
        </section>

        <CaseSection index={roleIndex} title="My Role" question="What was my contribution?">
          {cs.role?.length ? (
            <ul className="grid max-w-[62ch] sm:grid-cols-2 sm:gap-x-10">
              {cs.role.map((r) => (
                <li key={r} className="flex gap-4 border-b border-line py-4 text-lg md:text-xl">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-electric" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder field="role" />
          )}
        </CaseSection>
      </div>

      {/* Next project */}
      <nav aria-label="Next project" className="mx-auto mt-16 max-w-[1680px] px-gutter pb-24 md:mt-24 md:pb-32">
        <Link
          href={`/work/${next.slug}`}
          className="group grid items-center gap-8 rounded-[32px] border border-line p-6 transition-colors duration-500 hover:border-ink/20 hover:bg-paper-2 md:grid-cols-[1fr_minmax(0,0.6fr)] md:p-10"
        >
          <div>
            <p className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">Next project</p>
            <p className="mt-4 text-balance font-display text-[clamp(2.25rem,5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em]">
              {next.title}
            </p>
            <span className="mt-8 inline-flex items-center gap-3 text-ink-2 transition-colors group-hover:text-ink">
              View case study
              <span className="grid size-10 place-items-center rounded-full bg-brand bg-iridescent text-white transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
            <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out-expo group-hover:scale-[1.04]">
              <ProjectCover project={next} index={projects.indexOf(next)} sizes="(min-width: 768px) 35vw, 100vw" />
            </div>
          </div>
        </Link>
      </nav>
    </article>
  );
}
