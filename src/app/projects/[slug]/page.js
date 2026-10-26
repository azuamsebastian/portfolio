import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FadeIn from '@/components/motion/FadeIn';
import ImageCarousel from '@/components/ui/ImageCarousel';
import projects from '@/data/projects.json';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  // params is a Promise in this version of Next.js
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Sebastian Azua`,
    description: project.summary,
  };
}

// A body block is a paragraph, optionally followed by "- " lines rendered as a bulleted list
function BodyBlock({ block }) {
  const lines = block.split('\n');
  const text = lines.filter((line) => !line.startsWith('- ')).join(' ');
  const items = lines.filter((line) => line.startsWith('- ')).map((line) => line.slice(2));

  return (
    <div>
      {text && <p>{text}</p>}
      {items.length > 0 && (
        <ul className={`list-['–_'] pl-5 space-y-1 ${text ? 'mt-3' : ''}`}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Text column shared by the hero and every section, so all body copy lines up
const TEXT_COLUMN = 'md:col-span-7 md:col-start-6';

function SectionImage({ img, cropped }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl bg-surface">
        {/* Images with known dimensions keep their own shape, unless they share a row;
            others are cropped to fill the frame */}
        {img.width && img.height && !cropped ? (
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(min-width: 1200px) 1320px, 100vw"
            className="w-full h-auto"
          />
        ) : (
          <div className="relative aspect-[4/3]">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
      {img.caption && (
        <figcaption className="mt-3 text-xs font-mono text-tertiary">{img.caption}</figcaption>
      )}
    </figure>
  );
}

function Testimonial({ quote, name, role }) {
  return (
    <figure>
      <blockquote className="font-mono text-secondary leading-relaxed text-xs">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-xs font-mono text-tertiary">
        {name}, {role}
      </figcaption>
    </figure>
  );
}

function CaseStudySection({ heading, body, images: allImages, testimonials, carousel = false }) {
  // Images marked "hidden" stay in the data but aren't shown
  const images = allImages?.filter((img) => !img.hidden);
  const hasImages = images && images.length > 0;
  // One image spans the full width; three sit in a row; anything else pairs up
  const columns = !hasImages || images.length === 1 ? '' : images.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <FadeIn>
      <div className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
          <h2 className="md:col-span-4 leading-none text-xl font-sans font-normal tracking-tight text-primary">{heading}</h2>

          <div className={TEXT_COLUMN}>
            <div className="text-secondary leading-relaxed text-base space-y-4">
              {body.split('\n\n').map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}
            </div>

            {/* A section can quote people, e.g. a testimonial backing up its Outcome */}
            {testimonials && testimonials.length > 0 && (
              <div className="mt-10 space-y-10">
                {testimonials.map((t, i) => (
                  <Testimonial key={i} {...t} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Images sit below the text at the full content width */}
        {hasImages && !carousel && (
          <div className={`mt-16 md:mt-24 grid grid-cols-1 gap-2 ${columns}`}>
            {images.map((img, i) => (
              <SectionImage key={i} img={img} cropped={images.length > 1} />
            ))}
          </div>
        )}

        {/* Carousel spans the full browser width (it adds its own mt-10) */}
        {hasImages && carousel && <div className="mt-6 md:mt-14"><ImageCarousel images={images} /></div>}
      </div>
    </FadeIn>
  );
}

// Small chevron for the Previous / Next labels, same shape as the back link
function NavChevron({ direction }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  );
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Prev/next stay within the same group (e.g. Product Work case studies link to each other)
  const siblings = projects.filter((p) => p.category === project.category);
  const currentIndex = siblings.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextProject = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const details = [
    { label: 'Company', value: project.company },
    { label: 'Role', value: project.role },
    { label: 'Date', value: project.year },
  ].filter((d) => d.value);

  return (
    <article className="px-6 md:px-8 overflow-x-clip">
      <div className="max-w-[75rem] mx-auto">
        {/* Back link */}
        <FadeIn>
          <div className="pt-8 pb-4">
            {/* Plain <a>, not <Link>: Next.js 16.2.1 doubles the hash on prefetched links (/#work#work) */}
            <a
              href="/#work"
              aria-label="Back to all projects"
              className="inline-flex text-tertiary hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </a>
          </div>
        </FadeIn>

        {/* Hero: title with project details underneath */}
        <FadeIn>
          <div className="pt-2 md:pt-4 pb-16 md:pb-24 border-b border-line grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            <div className="md:col-span-7">
              <h1 className="text-[2rem] leading-[1.25] font-normal tracking-tight text-primary">
                {project.title}
              </h1>
              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
                {details.map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-xs font-mono text-tertiary">{label}</dt>
                    <dd className="mt-1 text-sm font-sans font-normal text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </FadeIn>

        {/* Case Study Sections */}
        {project.sections.map((section) => (
          <CaseStudySection key={section.heading} {...section} />
        ))}

        {/* Prev / Next Navigation */}
        <div className="py-16 border-t border-line grid grid-cols-1 md:grid-cols-2 gap-8">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group"
            >
              <p className="flex items-center gap-1 text-xs font-mono text-tertiary mb-1">
                <NavChevron direction="left" />
                Previous
              </p>
              <p className="text-sm font-sans font-normal text-primary group-hover:text-tertiary transition-colors">
                {prevProject.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group md:text-right"
            >
              <p className="flex items-center md:justify-end gap-1 text-xs font-mono text-tertiary mb-1">
                Next
                <NavChevron direction="right" />
              </p>
              <p className="text-sm font-sans font-normal text-primary group-hover:text-tertiary transition-colors">
                {nextProject.title}
              </p>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
