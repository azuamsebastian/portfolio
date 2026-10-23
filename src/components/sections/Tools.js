import FadeIn from '@/components/motion/FadeIn';
import tools from '@/data/tools.json';

export default function Tools() {
  return (
    <section id="tools" className="py-18 md:py-24 px-6 md:px-8">
      <FadeIn>
        {/* Title alone in cols 1–2; tools run as an index in cols 4–8, col 3 left empty */}
        <div className="max-w-[75rem] mx-auto md:grid md:grid-cols-8 md:gap-x-12">
          <h2 className="mb-6 md:mb-0 md:col-span-2 leading-none text-base md:text-xl font-sans font-normal tracking-tight text-primary">
            Stack
          </h2>

          {/* Two columns of five, filled top-to-bottom so the order reads down each column */}
          <ul className="md:col-start-4 md:col-span-5 grid grid-cols-2 grid-rows-5 grid-flow-col gap-x-6 gap-y-6 md:gap-x-12">
            {tools.map((tool) => (
              <li key={tool.name}>
                <h3 className="text-sm font-sans font-normal text-primary">{tool.name}</h3>
                <p className="mt-1 text-xs font-mono text-tertiary">{tool.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </section>
  );
}
