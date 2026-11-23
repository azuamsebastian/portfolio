import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
// Stack section is hidden for now; re-add <Tools /> below to show it again
// import Tools from '@/components/sections/Tools';
import Connect from '@/components/sections/Connect';
import { getSubstackPosts } from '@/lib/getSubstackPosts';
import writing from '@/data/writing.json';

export default async function Home() {
  // The Writing section shows the hand-picked posts in src/data/writing.json, in that order
  const substackPosts = await getSubstackPosts(writing);

  return (
    <>
      <Hero substackPosts={substackPosts} />
      <About />
      <Connect />
    </>
  );
}
