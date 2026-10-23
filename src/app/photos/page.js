import PhotoGalleryFull from '@/components/ui/PhotoGalleryFull';

export const metadata = {
  title: 'Photography — Sebastian Azua',
  description: 'Photography by Sebastian Azua — moments captured on film and digital.',
};

export default function PhotosPage() {
  return (
    <article className="pb-24 md:pb-32 px-6 md:px-8">
      <div className="max-w-[75rem] mx-auto">
        {/* Back link — matches the case study pages */}
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

        <h1 className="pt-2 md:pt-4 text-[2rem] leading-[1.25] font-sans font-bold tracking-tight text-primary mb-4">
          Photography
        </h1>
        <div className="w-12 h-px bg-primary mb-12" />
        <PhotoGalleryFull />
      </div>
    </article>
  );
}
