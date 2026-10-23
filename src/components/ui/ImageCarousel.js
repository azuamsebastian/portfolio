'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

// Full-bleed horizontal carousel. The first slide lines up with the page content edge;
// slides snap into place, and chevron buttons step one slide at a time.
const EDGE = 'px-6 md:px-[max(2rem,calc((100vw_-_75rem)/2))]';
const SNAP_EDGE = 'scroll-px-6 md:scroll-px-[max(2rem,calc((100vw_-_75rem)/2))]';

function Chevron({ direction }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  );
}

export default function ImageCarousel({ images }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const slides = () => Array.from(trackRef.current?.children ?? []);

  const goTo = (i) => {
    const target = slides()[i];
    if (target) trackRef.current.scrollTo({ left: target.offsetLeft - slides()[0].offsetLeft, behavior: 'smooth' });
  };

  const onScroll = () => {
    const track = trackRef.current;
    const first = slides()[0];
    if (!track || !first) return;
    // The slide whose left edge is closest to the snap position is the current one
    const positions = slides().map((s) => Math.abs(s.offsetLeft - first.offsetLeft - track.scrollLeft));
    setIndex(positions.indexOf(Math.min(...positions)));
  };

  return (
    <div className="mt-10 relative left-1/2 w-screen -translate-x-1/2" aria-roledescription="carousel">
      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Project images"
        className={`flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory ${EDGE} ${SNAP_EDGE} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-tertiary`}
      >
        {images.map((img, i) => (
          <figure
            key={img.src}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
            className="snap-start shrink-0 w-[85vw] md:w-[min(62.5rem,80vw)]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 768px) 1000px, 85vw"
              className="w-full h-auto"
            />
            {img.caption && (
              <figcaption className="mt-2 text-xs text-tertiary font-mono">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      <div className={`mt-4 flex items-center justify-end gap-4 ${EDGE}`}>
        <span className="text-xs font-mono text-tertiary tabular-nums" aria-live="polite">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous image"
          className="text-tertiary hover:text-primary disabled:opacity-30 disabled:hover:text-tertiary transition-colors"
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === images.length - 1}
          aria-label="Next image"
          className="text-tertiary hover:text-primary disabled:opacity-30 disabled:hover:text-tertiary transition-colors"
        >
          <Chevron direction="right" />
        </button>
      </div>
    </div>
  );
}
