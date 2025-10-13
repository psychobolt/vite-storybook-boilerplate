import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import readline from 'node:readline';
import arg from 'arg';
import { chromium } from 'playwright';
import sharp from 'sharp';
import {
  EXIT_INVALID_USAGE,
  EXIT_SUCCESS
} from 'commons/esm/bin/utils/functions.js';
import { getStories, Story } from './utils.ts';

const args = arg({
  '--storybook-url': String
});
const SB_URL = process.env.SB_URL || args['--storybook-url'] || '';
if (!SB_URL) {
  console.error(
    'SB_URL is required. Provide --storybook-url or set the SB_URL environment variable.'
  );
  process.exit(EXIT_INVALID_USAGE);
}

interface GroupedStories {
  [group: string]: Array<{
    name: string;
    composite?: boolean;
  }>;
}

let stories: Story[];
try {
  const entries = await getStories(SB_URL);
  stories = Object.values(entries).filter((story) => {
    // Exclude if type is docs or any tag ends with -mdx
    if (
      typeof story.importPath !== 'string' ||
      story.type === 'docs' ||
      (Array.isArray(story.tags) &&
        story.tags.some((tag) => tag.endsWith('-mdx')))
    ) {
      return false;
    }
    return true;
  });
} catch (err) {
  console.error('Failed to fetch index.json:', err);
  process.exit(EXIT_INVALID_USAGE);
}

// Group by importPath and archive story name
const grouped: GroupedStories = {};
for (const s of stories) {
  grouped[s.importPath] ??= [];
  const entry: { name: string; composite?: boolean } = { name: s.name };
  if (Array.isArray(s.tags) && s.tags.includes('composite')) {
    entry.composite = true;
  }
  grouped[s.importPath].push(entry);
}

async function downloadImage(url: string, dest: string): Promise<void> {
  // Download image to buffer using fetch
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to get '${url}' (${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

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
  process.exit(EXIT_INVALID_USAGE);
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
    process.exit(EXIT_INVALID_USAGE);
  }
  // Save snapshot URL and name in grouped JSON
  const storyEntries = grouped[story.importPath];
  const storyEntry = storyEntries.find((entry) => entry.name === story.name);
  if (storyEntry && imgSrc) {
    const importPathDir = resolve(dirname(story.importPath), '__snapshots__');
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
function questionAsync(rl: readline.Interface, query: string): Promise<string> {
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
  process.exit(EXIT_SUCCESS);
} else {
  console.log('Processing all stories...');
  for (const story of stories) {
    await processStory(page, story, SB_URL, grouped);
  }
  // Output grouped JSON with snapshot URLs to inventory.json
  const inventoryPath = 'inventory.json';
  await writeFile(inventoryPath, JSON.stringify(grouped, null, 2), 'utf8');
  console.log(`Inventory written to ${inventoryPath}`);
}

await browser.close();
