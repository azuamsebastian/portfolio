'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';

// Items with a `preview` image show it while the row is hovered. The panel is pinned to the
// right edge of the page content (the list fills 3/4 of it, and titles end before that area)
// and glides vertically to follow the cursor, so it never covers a title. All previews are
// rendered up front (hidden) so switching rows crossfades instantly. Large pointer screens only.
// Width in rem so the panel scales with the root font size (110% on desktop)
const PREVIEW_WIDTH = '45rem';

export default function ProjectList({ projects, align = 'left', dividers = true }) {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const previews = projects.filter((p) => p.preview);
  const activePreview = previews.find((p) => p.slug === active)?.preview;

  const move = (e) => {
    const panel = panelRef.current;
    const list = listRef.current;
    if (!panel || !list) return;
    const rect = list.getBoundingClientRect();
    const contentRight = rect.left + rect.width / 0.75;
    const x = contentRight - panel.offsetWidth;
    const y = Math.min(Math.max(e.clientY - panel.offsetHeight / 2, 16), window.innerHeight - panel.offsetHeight - 16);
    panel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const enter = (project, e) => {
    if (!project.preview || !window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
      setActive(null);
      return;
    }
    const panel = panelRef.current;
    if (!active && panel) {
      // Coming from no preview: jump into place instead of gliding in from the last position
      panel.style.transitionProperty = 'opacity';
      move(e);
      requestAnimationFrame(() => (panel.style.transitionProperty = ''));
    } else {
      move(e);
    }
    setActive(project.slug);
  };

  return (
    <>
      <ul ref={listRef} className={dividers ? 'border-t border-line' : ''} onMouseLeave={() => setActive(null)}>
        {projects.map((project) => (
          <li key={project.slug} className={dividers ? 'border-b border-line' : ''}>
            <Link
              href={project.href ?? `/projects/${project.slug}`}
              {...(project.href?.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
              onMouseEnter={(e) => enter(project, e)}
              onMouseMove={project.preview ? move : undefined}
              className={`group flex items-center ${align === 'right' ? 'md:justify-end' : ''} py-3 text-tertiary hover:text-primary transition-colors`}
            >
              <span className="text-sm uppercase tracking-[0.12em]">{project.listTitle ?? project.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Rendered at the top level of the page with z-0: it sits above the portrait but behind
          the section titles and project titles (z-10), so text stays readable on top of it */}
      {mounted && previews.length > 0 && createPortal(
        <div
          ref={panelRef}
          aria-hidden="true"
          style={{
            width: PREVIEW_WIDTH,
            aspectRatio: activePreview ? `${activePreview.width} / ${activePreview.height}` : '16 / 9',
          }}
          className={`pointer-events-none fixed left-0 top-0 z-0 hidden lg:block bg-background shadow-xl transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
        >
          {previews.map((project) => (
            <Image
              key={project.slug}
              src={project.preview.src}
              alt=""
              width={project.preview.width}
              height={project.preview.height}
              sizes="1600px"
              className={`absolute inset-x-0 top-0 w-full h-auto transition-opacity duration-200 ${active === project.slug ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
