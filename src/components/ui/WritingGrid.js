import Image from 'next/image';

export default function WritingGrid({ posts }) {
  return (
    // Mobile: a horizontal carousel that snaps per article, with a quarter of the next one
    // peeking in so it reads as scrollable (card = 80% of the width left after the 1rem gap).
    // Desktop: a four-column grid.
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-6 md:overflow-visible">
      {posts.map((post) => (
        <a
          key={post.url}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-[calc((100%-1rem)*0.8)] shrink-0 snap-start md:w-auto"
        >
          <div className="relative aspect-[4/3] bg-surface overflow-hidden">
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <h3 className="mt-3 font-sans text-sm text-primary group-hover:text-tertiary transition-colors">
            {post.title}
          </h3>
          <span className="block mt-1 text-xs font-mono text-tertiary">
            {post.date}
          </span>
        </a>
      ))}
    </div>
  );
}
