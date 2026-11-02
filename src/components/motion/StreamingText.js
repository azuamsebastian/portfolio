'use client';

import { useEffect, useState } from 'react';

const START_DELAY_MS = 600; // let the hero fade in first
// Cadence of a streamed LLM response: tokens arrive at roughly 60 per second, the screen
// redraws in uneven frames that can carry 1–3 tokens, and the stream occasionally stalls.
const FRAME_MIN_MS = 16;
const FRAME_MAX_MS = 45;
const STALL_CHANCE = 0.06;
const STALL_MIN_MS = 80;
const STALL_MAX_MS = 220;

const rand = (min, max) => min + Math.random() * (max - min);

// Approximates how a tokenizer splits text: each word keeps its leading space, and longer
// words are broken into 3–5 character pieces. Returns the end index of each token.
function tokenEnds(text) {
  const ends = [];
  for (const match of text.matchAll(/\s*\S+/g)) {
    const start = match.index;
    const piece = match[0];
    const lead = piece.length - piece.trimStart().length;
    let i = lead;
    while (piece.length - i > 6) {
      i += 3 + Math.floor(Math.random() * 3);
      ends.push(start + i);
    }
    ends.push(start + piece.length);
  }
  return ends;
}

// Renders the first `end` characters of `text`, wrapping the part covered by `link.label` in
// an anchor. While streaming the anchor is taken out of the tab order, since that copy is hidden
// from assistive tech; once the text has finished it's a normal link.
function renderUpTo(text, end, link, focusable) {
  const start = link ? text.indexOf(link.label) : -1;
  if (start < 0) return text.slice(0, end);
  const stop = start + link.label.length;
  return (
    <>
      {text.slice(0, Math.min(end, start))}
      {end > start && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={focusable ? undefined : -1}
          className="underline-offset-4 hover:underline hover:text-primary transition-colors"
        >
          {text.slice(start, Math.min(end, stop))}
        </a>
      )}
      {end > stop && text.slice(stop, end)}
    </>
  );
}

// Reveals `text` the way a streamed response appears in a terminal: token by token, in
// small uneven bursts, with no cursor. The full text sits invisibly underneath so the
// layout never shifts, and a screen-reader copy carries the complete sentence from the start.
// An optional `link` ({ label, href }) turns the matching part of the text into a link.
export default function StreamingText({ text, link }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      return;
    }

    const ends = tokenEnds(text);
    const timers = [];
    let t = START_DELAY_MS;
    let i = 0;
    while (i < ends.length) {
      // Each frame flushes 1–3 tokens at once
      i = Math.min(ends.length, i + 1 + Math.floor(Math.random() * 3));
      const end = ends[i - 1];
      timers.push(setTimeout(() => setCount(end), t));
      t += rand(FRAME_MIN_MS, FRAME_MAX_MS) + (Math.random() < STALL_CHANCE ? rand(STALL_MIN_MS, STALL_MAX_MS) : 0);
    }

    return () => timers.forEach(clearTimeout);
  }, [text]);

  // Once fully streamed, swap the layered copies for the plain sentence so the link can be
  // reached by keyboard and screen readers like any other
  if (count >= text.length) {
    return <span className="block">{renderUpTo(text, text.length, link, true)}</span>;
  }

  return (
    <span className="relative block">
      <span className="sr-only">{renderUpTo(text, text.length, link, true)}</span>
      <span aria-hidden="true" className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">{renderUpTo(text, count, link, false)}</span>
    </span>
  );
}
