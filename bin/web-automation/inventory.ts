import https from 'node:https';
import http from 'node:http';
import { URL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import readline from 'node:readline';
import arg from 'arg';
import { chromium } from 'playwright';
import sharp from 'sharp';

const args = arg({
  '--storybook-url': String
});
const SB_URL = args['--storybook-url'];
if (!SB_URL) {
  console.error('SB_URL is required. Provide --storybook-url.');
  process.exit(1);
}

// Download index.json from Storybook
function fetchJson(url: string): Promise<StoriesJson> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

type StoriesJson = {
  entries: Record<string, Story>;
};

type Story = {
  id: string;
  importPath: string;
  name: string;
  type?: string;
  [key: string]: unknown;
};

type GroupedStories = Record<
  string,
  Array<{ url: string; name: string; snapshotUrl?: string }>
>;

(async () => {
  const indexUrl = new URL('/index.json', SB_URL).toString();
  let indexJson: StoriesJson;
  try {
    indexJson = await fetchJson(indexUrl);
  } catch (err) {
    console.error('Failed to fetch index.json:', err);
    process.exit(1);
  }

  // Filter out MDX and docs
  const stories = Object.values(indexJson.entries).filter(
    (story) =>
      typeof story.importPath === 'string' &&
      !story.importPath.endsWith('.mdx') &&
      story.type !== 'docs'
  );

  // Group by importPath and archive story name
  const grouped: GroupedStories = {};
  for (const s of stories) {
    grouped[s.importPath] ??= [];
    grouped[s.importPath].push({
      url: `${SB_URL}/?path=/story/${s.id}`,
      name: s.name
    });
  }

  async function downloadImage(url: string, dest: string): Promise<void> {
    // Download image to buffer
    const buffer: Buffer = await new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      client
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to get '${url}' (${response.statusCode})`)
            );
            return;
          }
          const data: Buffer[] = [];
          response.on('data', (chunk) => data.push(chunk));
          response.on('end', () => resolve(Buffer.concat(data)));
        })
        .on('error', reject);
    });

    // Use sharp to trim white borders
    try {
      const image = sharp(buffer);
      // Use trim() to remove white borders (default threshold)
      const trimmed = await image.trim().png().toBuffer();
      await sharp(trimmed).toFile(dest);
    } catch (err) {
      // Fallback: save original image if trim fails
      await sharp(buffer).toFile(dest);
    }
  }

  if (!stories.length) {
    console.error('No stories found.');
    process.exit(1);
  }

  // --- Reusable functions ---
  async function navigateToStory(
    page: import('playwright').Page,
    storyUrl: string
  ): Promise<void> {
    console.log(`Navigating to: ${storyUrl}`);
    await page.goto(storyUrl);
  }

  async function clickVisualTestTab(
    page: import('playwright').Page
  ): Promise<void> {
    await page.waitForSelector('button[role="tab"]:has-text("Visual Test")', {
      timeout: 10000
    });
    await page.click('button[role="tab"]:has-text("Visual Test")');
  }

  async function getSnapshotUrl(
    page: import('playwright').Page
  ): Promise<string | null> {
    try {
      await page.waitForSelector('img[alt^="Latest snapshot"]', {
        timeout: 10000
      });
      const imgSrc = await page.getAttribute(
        'img[alt^="Latest snapshot"]',
        'src'
      );
      if (imgSrc) {
        console.log(`Snapshot URL: ${imgSrc}`);
        return imgSrc;
      } else {
        console.log('Snapshot image not found.');
        return null;
      }
    } catch (e) {
      console.log('Snapshot image not found.');
      return null;
    }
  }

  async function processStory(
    page: import('playwright').Page,
    story: Story,
    SB_URL: string,
    grouped: GroupedStories
  ): Promise<void> {
    const storyUrl = `${SB_URL}/?path=/story/${story.id}`;
    await navigateToStory(page, storyUrl);
    let imgSrc: string | undefined;
    try {
      await clickVisualTestTab(page);
      imgSrc = (await getSnapshotUrl(page)) || undefined;
    } catch (e) {
      console.error('Visual Test add-on is missing', e);
      process.exit(1);
    }
    // Save snapshot URL and name in grouped JSON
    const storyEntries = grouped[story.importPath];
    const storyEntry = storyEntries.find((entry) => entry.url === storyUrl);
    if (storyEntry) {
      storyEntry.snapshotUrl = imgSrc;
      storyEntry.name = story.name;
      // Download snapshot image
      if (imgSrc) {
        const importPathDir = resolve(
          dirname(story.importPath),
          '__snapshots__'
        );
        await mkdir(importPathDir, { recursive: true });
        const fileName = `${story.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.png`;
        const destPath = join(importPathDir, fileName);
        try {
          await downloadImage(imgSrc, destPath);
          console.log(`Downloaded snapshot to: ${destPath}`);
        } catch (err) {
          console.error(`Failed to download snapshot for ${story.name}:`, err);
        }
      }
    }
  }

  // --- Main Playwright logic ---
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the first story before prompt
  const firstStory = stories[0];
  const firstStoryUrl = `${SB_URL}/?path=/story/${firstStory.id}`;
  console.log(`Navigating to first story: ${firstStoryUrl}`);
  await navigateToStory(page, firstStoryUrl);
  await clickVisualTestTab(page);

  // Promisified readline question
  function questionAsync(
    rl: readline.Interface,
    query: string
  ): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await questionAsync(
    rl,
    'Please login to Chromatic. Then press ENTER to process all stories or type "q" then ENTER to quit: '
  );
  rl.close();
  if (answer.trim().toLowerCase() === 'q') {
    await browser.close();
    process.exit(0);
  } else {
    console.log('Processing all stories...');
    for (const story of stories) {
      await processStory(page, story, SB_URL, grouped);
    }
    // Output grouped JSON with snapshot URLs
    console.log('Grouped JSON with snapshot URLs:');
    console.log(JSON.stringify(grouped, null, 2));
    await browser.close();
  }
})();
