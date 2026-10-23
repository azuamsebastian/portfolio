import FadeIn from '@/components/motion/FadeIn';
import profile from '@/data/profile.json';

export default function About() {
  return (
    <section id="about" className="py-18 md:py-24 px-6 md:px-8">
      <div className="max-w-[75rem] mx-auto">
        <FadeIn>
          <h2 className="mb-6 leading-none text-base md:text-xl font-sans font-normal tracking-tight text-primary">
            More About Me
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-8 md:gap-12">
            {/* Bio — 5 of 8 columns, paragraphs split into two side-by-side stacks of 3 */}
            <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              {[profile.bio.slice(0, 3), profile.bio.slice(3)].map((stack, s) => (
                <div key={s} className="space-y-5">
                  {stack.map((paragraph, i) => (
                    <p key={i} className="text-secondary leading-relaxed text-sm">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Resume — last 2 of 8 columns, aligned to the bottom of the bio */}
            <div className="md:col-span-2 md:col-start-7 md:self-end md:text-right">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-sans text-primary underline underline-offset-4 decoration-line hover:decoration-primary transition-colors"
              >
                View Resume
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
