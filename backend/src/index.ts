import { chromium } from 'playwright';
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

export async function summarise(content: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Summarize this LinkedIn post into 2 short sentences.
    Keep company names and technical details intact.
    Ignore hashtags and emojis.

    Post:
    ${content}
    `;

  const result = await model.generateContent(prompt);
  const summary = result.response.text();
  console.log("\nSummary:\n", summary);
}


async function scrapeLinkedinPost(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Try to dismiss login popup
  try {
    await page.waitForSelector('button[aria-label="Dismiss"]', { timeout: 5000 });
    await page.click('button[aria-label="Dismiss"]');
    console.log('Closed sign-in popup.');
  } catch {
    console.log('No popup detected.');
  }

  // Wait for the actual paragraph element
  const selector = 'p[data-test-id="main-feed-activity-card__commentary"]';
  await page.waitForSelector(selector, { timeout: 20000 });

  // Extract text content including link URLs
  const content = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 'No content found';
    const links = Array.from(el.querySelectorAll('a'))
      .map((a) => `${a.textContent?.trim()} (${a.getAttribute('href')})`)
      .join('\n');
    const text = el.textContent?.trim() || '';
    return text + (links ? '\n\nLinks:\n' + links : '');
  }, selector);

  console.log('\nExtracted post content:\n');
  console.log(content);

  await browser.close();
  return content;
}

const url =
  'https://www.linkedin.com/posts/santosh-mode_webdevelopment-firstproject-frontend-ugcPost-7388901914702213120--rSl?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEkD_MsBs1FlXe_RI4O7-qfS025GJx8AD0c';

scrapeLinkedinPost(url)
  .then((data) => {
    summarise(data);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
