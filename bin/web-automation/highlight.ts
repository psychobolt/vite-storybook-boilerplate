import arg from 'arg';
import { chromium } from 'playwright';
import Color from 'color';

const args = arg({
  '--url': String,
  '--class': [String],
  '--parent': String,
  '--output': String,
  '--color': String,
  '--border-alpha': Number
});

const url = args['--url'];
const classNames = args['--class'];
const parentClass = args['--parent'];
const outputFile = args['--output'] || '.temp/highlighted-elements.png';

let baseColor = args['--color'] || '255,0,0';
if (baseColor.startsWith('#')) {
  try {
    const colorObj = Color(baseColor);
    const rgbArr = colorObj.rgb().array();
    baseColor = rgbArr.join(',');
  } catch (e) {
    console.error('Invalid hex color');
    process.exit(4);
  }
}
const borderAlpha =
  typeof args['--border-alpha'] === 'number' ? args['--border-alpha'] : 0.5;
const highlightColor = `rgba(${baseColor},0.15)`;
const borderColor = `rgba(${baseColor},${borderAlpha})`;

if (!url || !classNames || classNames.length === 0) {
  console.error(
    'Usage: highlight --url <url> --class <className> [--class <className> ...] [--parent <parentClass>]'
  );
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  // Build regex objects for class names
  const regexes = classNames.map((str) => {
    try {
      return new RegExp(str);
    } catch (e) {
      console.error(`Invalid regex: ${str}`);
      process.exit(3);
      return null;
    }
  });

  // Get all elements to check
  let candidates;
  if (parentClass) {
    const parentSelector = `.${parentClass}`;
    const parent = await page.$(parentSelector);
    if (!parent) {
      console.error(`Parent element with class '${parentClass}' not found.`);
      await browser.close();
      process.exit(2);
    }
    candidates = await parent.$$('*');
  } else {
    candidates = await page.$$('*');
  }

  // Filter out any null regexes
  const validRegexes = regexes.filter(Boolean);
  // Filter elements by class name regex
  const elements = [];
  for (const el of candidates) {
    const className = await el.getAttribute('class');
    if (className && validRegexes.some((re) => re && re.test(className))) {
      elements.push(el);
    }
  }

  // Highlight matched elements in the page
  await Promise.all(
    elements.map((el) =>
      el.evaluate(
        (node, colors) => {
          node.style.boxShadow = `0 0 0 3px ${colors.borderColor}, 0 0 0 6px ${colors.bgColor}, inset 0 0 0 2px ${colors.borderColor}`;
          node.style.backgroundColor = colors.bgColor;
        },
        { bgColor: highlightColor, borderColor }
      )
    )
  );

  // Take a screenshot of the page with highlights
  await page.screenshot({ path: outputFile, fullPage: true });
  console.log(`Screenshot saved: ${outputFile}`);
  await browser.close();
})();
