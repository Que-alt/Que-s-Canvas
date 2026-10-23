import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const cs = project.caseStudy ?? {};

  const meta = [
    { label: "Client", value: project.client },
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
    { label: "Discipline", value: project.categories.join(", ") },
  ];

  return (
    <article className="bg-paper">
      {/* Header */}
      <header className="mx-auto max-w-[1680px] px-gutter pt-32 md:pt-40">
        <Link
          href="/#work"
          className="link-underline inline-flex items-center gap-2 font-label text-xs uppercase tracking-[0.16em] text-ink-2"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Selected Works
        </Link>

        <p className="mt-12 font-label text-xs uppercase tracking-[0.16em] text-ink-2">
          Case study {String(index + 1).padStart(2, "0")} — {project.categories.join(" · ")}
        </p>
        <AnimatedText
          as="h1"
          mode="inView"
          text={project.title}
          className="mt-5 max-w-[14ch] text-[clamp(3rem,9vw,10rem)] font-medium leading-[0.9] tracking-[-0.055em]"
        />
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-[40ch] text-xl leading-snug text-ink-2 md:text-3xl md:leading-snug">
            {project.description}
          </p>
        </Reveal>

        <dl className="mt-16 grid grid-cols-2 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="pr-6">
              <dt className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">{m.label}</dt>
              <dd className="mt-2">{m.value ?? <span className="italic text-ink-2">To be added</span>}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Cover */}
      <Reveal className="mx-auto mt-16 max-w-[1680px] px-gutter md:mt-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] md:aspect-[16/8] md:rounded-[40px]">
          <ProjectCover project={project} index={index} priority sizes="100vw" />
        </div>
      </Reveal>

      {/* Chapters */}
      <div className="mx-auto mt-16 max-w-[1680px] px-gutter md:mt-24">
        <CaseSection index={1} title="Overview">
          {cs.overview ? <p className={prose}>{cs.overview}</p> : <Placeholder field="overview" />}
        </CaseSection>

        <CaseSection index={2} title="Business challenge">
          {cs.challenge ? <p className={prose}>{cs.challenge}</p> : <Placeholder field="challenge" />}
        </CaseSection>

        <CaseSection index={3} title="My role">
          {cs.role ? <p className={prose}>{cs.role}</p> : <Placeholder field="role" />}
        </CaseSection>

        <CaseSection index={4} title="Design & engineering approach">
          <div className="grid gap-5 md:grid-cols-2">
            {(["design", "engineering"] as const).map((k) => (
              <div key={k} className="rounded-[24px] border border-line p-6 md:p-8">
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">{k}</p>
                {cs.approach?.[k] ? (
                  <p className="mt-3 leading-relaxed md:text-lg">{cs.approach[k]}</p>
                ) : (
                  <p className="mt-3 text-ink-2">
                    Placeholder — add <code className="font-mono text-sm text-ink">caseStudy.approach.{k}</code>
                  </p>
                )}
              </div>
            ))}
          </div>
        </CaseSection>

        <CaseSection index={5} title="Process & solution">
          {cs.process?.length ? (
            <ol className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2">
              {cs.process.map((step, i) => (
                <li key={step.title} className="bg-white p-6 md:p-8">
                  <p className="font-label text-xs text-ink-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
                </li>
              ))}
            </ol>
          ) : (
            <Placeholder field="process" />
          )}
          <div className="mt-8">
            {cs.solution ? <p className={prose}>{cs.solution}</p> : <Placeholder field="solution" />}
          </div>
        </CaseSection>

        <CaseSection index={6} title="Screenshots & prototypes">
          <div className="grid gap-5 sm:grid-cols-2">
            {cs.gallery?.length
              ? cs.gallery.map((img, i) => (
                  <figure key={img.src} className={i % 3 === 0 ? "sm:col-span-2" : undefined}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-paper-2">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {img.caption && <figcaption className="mt-3 text-sm text-ink-2">{img.caption}</figcaption>}
                  </figure>
                ))
              : [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`grid aspect-[16/10] place-items-center rounded-[24px] border border-dashed border-ink/20 bg-paper-2 ${
                      i === 0 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <span className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">
                      Screenshot placeholder
                    </span>
                  </div>
                ))}
          </div>
        </CaseSection>

        <CaseSection index={7} title="Technology stack">
          {cs.stack?.length ? (
            <ul className="flex flex-wrap gap-2.5">
              {cs.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-4 py-2 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder field="stack" />
          )}
        </CaseSection>

        <CaseSection index={8} title="Outcomes & impact">
          {cs.outcomes?.length ? (
            <ul className="max-w-[62ch]">
              {cs.outcomes.map((o) => (
                <li key={o} className="flex gap-4 border-b border-line py-4 text-lg">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-electric" aria-hidden />
                  {o}
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder field="outcomes" />
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
            <p className="mt-4 font-display text-[clamp(2.25rem,5.5vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em]">
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
