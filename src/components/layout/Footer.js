import profile from '@/data/profile.json';

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-8 border-t border-line">
      {/* Mobile: stacked on the left; desktop: copyright left, credits right */}
      <div className="max-w-[75rem] mx-auto flex flex-col gap-1 md:flex-row md:justify-between">
        <p className="text-xs text-tertiary font-mono">
          Copyright &copy; {new Date().getFullYear()} {profile.name}.
        </p>
        <p className="text-xs text-tertiary font-mono">
          Built with Claude Code &middot; Next.js &middot; Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
