'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Connect', href: '/#connect' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-50 bg-background">
      <div className="px-6 md:px-8 h-16">
        <div className="max-w-[75rem] mx-auto h-full flex items-center justify-between">
          {/* SA monogram: Inter Bold, -6% letter spacing. 1.375rem puts the cap height at ~16px,
              the size the old logo image was shown at. */}
          <Link href="/" aria-label="Sebastian Azua — home" className="font-sans font-bold text-[1.375rem] leading-none tracking-[-0.06em] text-primary">
            SA
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Plain <a>, not <Link>: Next.js 16.2.1 doubles the hash on prefetched links (/#work#work) */}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-sans font-normal text-tertiary hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {/* Lines are 1px tall with a 6px gap, so the outer two move 7px to cross at the centre */}
            <span className={`block w-5 h-px bg-primary transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-px bg-primary transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-primary transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 overflow-hidden bg-background border-b border-line"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-xs font-sans font-normal text-tertiary hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
