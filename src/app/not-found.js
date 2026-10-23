import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-[2rem] leading-[1.25] font-sans font-bold text-primary">404</h1>
        <p className="mt-4 text-secondary text-base">Page not found.</p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-sans text-primary underline underline-offset-4 hover:text-tertiary transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
