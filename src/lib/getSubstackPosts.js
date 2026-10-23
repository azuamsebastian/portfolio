import { XMLParser } from 'fast-xml-parser';

const SUBSTACK_FEED_URL = 'https://sebastianazua.substack.com/feed';

// Returns the posts whose URLs are listed in `urls`, in that order, using the feed for each
// post's title, date and image. Posts missing from the feed (it only carries recent ones)
// are skipped.
export async function getSubstackPosts(urls) {
  const res = await fetch(SUBSTACK_FEED_URL, {
    next: { revalidate: 3600 }, // revalidate every hour
  });

  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const feed = parser.parse(xml);
  const items = feed.rss.channel.item;

  // Normalize to array (single item comes as object)
  const posts = Array.isArray(items) ? items : [items];

  const byUrl = new Map(posts.map((item) => [item.link, item]));

  return urls.map((url) => byUrl.get(url)).filter(Boolean).map((item) => ({
    title: String(item.title).trim(),
    url: item.link,
    date: new Date(item.pubDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    image: item.enclosure?.['@_url'] || null,
    description: item.description?.replace(/<[^>]*>/g, '').slice(0, 160) + '...',
  }));
}
