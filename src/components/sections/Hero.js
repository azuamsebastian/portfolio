import Image from 'next/image';
import FadeIn from '@/components/motion/FadeIn';
import StreamingText from '@/components/motion/StreamingText';
import ProjectList from '@/components/ui/ProjectList';
import WritingGrid from '@/components/ui/WritingGrid';
import profile from '@/data/profile.json';
import projects from '@/data/projects.json';

// Product Work rows show a preview on hover: the project's own `preview` image if set,
// otherwise the first image in its Solution section
const productProjects = projects
  .filter((p) => p.category === 'product-work')
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    preview: p.preview ?? p.sections?.find((s) => s.heading === 'Solution')?.images?.find((img) => img.width && img.height) ?? null,
  }));

// Exploration items link out to external sites (opened in a new tab); Photography keeps its own page.
const explorationProjects = [
  { slug: 'forma-creative-studio', listTitle: 'Forma Creative Studio', href: 'https://formacreative.studio/' },
  { slug: 'casara', listTitle: 'Casara', href: 'https://apps.apple.com/us/app/casara/id6759580979' },
  { slug: 'sources', listTitle: 'Sources', href: 'https://sources.lovable.app/' },
  { slug: 'nomadik', listTitle: 'Nomadik Supply', href: 'https://nomadik-rentals.lovable.app' },
  { slug: 'photography', listTitle: 'Photography', href: '/photos' },
];

// Hero portrait — set to false to hide it
const SHOW_PORTRAIT = true;

function WorkSection({ id, title, projects, align = 'left', dividers = true, className = '' }) {
  return (
    <div id={id} className={`relative z-10 md:w-3/4 ${align === 'right' ? 'md:ml-auto md:text-right' : ''} ${className}`}>
      <h2 className="leading-none text-base md:text-xl font-sans font-normal tracking-tight text-primary">
        {title}
      </h2>
      {projects && (
        <div className="mt-6">
          <ProjectList projects={projects} align={align} dividers={dividers} />
        </div>
      )}
    </div>
  );
}

export default function Hero({ substackPosts = [] }) {
  return (
    <section id="hero" className="min-h-[70vh] px-6 md:px-8">
      <div className="max-w-[75rem] mx-auto w-full relative pt-12 md:pt-27 pb-18 md:pb-24">
        {/* First screen on desktop: intro at the top, Product Work pushed to the bottom, filling
            the viewport (minus the 4rem nav above it and the container's top padding) so Exploration
            starts below the fold. */}
        <div className="md:min-h-[calc(100svh-10.75rem)] md:flex md:flex-col">
          {/* Intro — headline on the left, photo on the right. On desktop they share a row and the
              headline is centred vertically against the photo. On mobile the photo sits above the
              headline, aligned right, at 8rem (128px) wide. The mobile intro fills the first
              screen minus the 4rem nav, the 3rem top padding and ~8rem reserved at the bottom, so the
              Product Work title and its first item peek in above the fold. */}
          <div className="flex flex-col justify-center min-h-[calc(100svh-15rem)] pb-12 md:min-h-0 md:pb-0 md:flex-row md:items-center md:justify-between md:gap-8">
            <FadeIn>
              <p className="text-2xl md:text-[2rem] leading-[1.3] md:leading-[1.25] tracking-tight text-primary max-w-2xl relative z-10" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
                I design and build digital products that simplify complex workflows and drive business impact.
              </p>
              <p className="mt-9 flex items-start gap-2 text-xs font-mono text-tertiary max-w-2xl md:max-w-md relative z-10">
                {/* Blinking dot, vertically centred on the first line of the caption */}
                <span aria-hidden="true" className="mt-[0.4em] size-1.5 shrink-0 rounded-full bg-current animate-blink motion-reduce:animate-none" />
                <StreamingText text="Recent experience: Owning the end-to-end implementation of features and systems to enable an AI rollup strategy." />
              </p>
            </FadeIn>
            {SHOW_PORTRAIT && (
              <div className="relative order-first mb-8 md:order-none md:mb-0 ml-auto shrink-0 w-[8rem] md:w-[11.375rem] lg:w-[13.125rem] z-0">
                <div className="aspect-[3/4] relative overflow-hidden opacity-50">
                  <Image
                    src="/images/hero-portrait.jpg"
                    alt={profile.name}
                    fill
                    // The landscape source (≈1.48:1) is cropped into a 3:4 frame, so it's drawn
                    // ≈1.97× wider than the frame: 8rem → ~253px, 11.375rem → ~360px, 13.125rem ×1.1 → ~456px
                    sizes="(min-width: 1024px) 456px, (min-width: 768px) 360px, 253px"
                    className="object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Work — at least 96px below the intro, 64px clear of the fold */}
          <div className="relative md:mt-auto md:pt-24 md:pb-16">
            {/* Anchor for "Work" links: lands the title 24px from the top of the view */}
            <WorkSection id="work" title="Product Work" projects={productProjects} dividers={false} className="scroll-mt-6" />
          </div>
        </div>

        {/* Remaining work sections — below the fold on desktop */}
        <div className="relative mt-16 md:mt-8">
          <WorkSection title="Exploration" projects={explorationProjects} align="right" dividers={false} />
          {/* Same 144px / 192px gap as the sections below; 12px less because the last
              Exploration item already ends with 12px of padding */}
          <WorkSection title="Writing" className="mt-33 md:mt-45" />
          <div className="relative z-10 mt-6">
            <WritingGrid posts={substackPosts} />
          </div>
        </div>
      </div>
    </section>
  );
}
