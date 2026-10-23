import FadeIn from '@/components/motion/FadeIn';
import profile from '@/data/profile.json';

// Contact values, stacked vertically in mono
const links = [
  { label: 'azuamsebastian@gmail.com', href: 'mailto:azuamsebastian@gmail.com' },
  { label: 'LinkedIn', href: profile.social.linkedin },
  { label: 'GitHub', href: profile.social.github },
];

export default function Connect() {
  return (
    <section id="connect" className="py-18 md:py-24 px-6 md:px-8">
      <div className="max-w-[75rem] mx-auto">
        <FadeIn>
          <h2 className="leading-none text-base md:text-xl font-sans font-normal tracking-tight text-primary">
            Connect
          </h2>
          <ul className="mt-6 space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="text-xs font-mono text-tertiary hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
