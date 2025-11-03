import express from "express";
import cors from "cors";
import { chromium } from "playwright";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function summarise(content: string): Promise<string> {
  const prompt = `
    Summarize this LinkedIn post into 2 short sentences.
    Keep company names and technical details intact.
    Ignore hashtags, emojis, and greetings.

    Post:
    ${content}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function scrapeLinkedinPost(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Dismiss login popup if present
  try {
    await page.click('button[aria-label="Dismiss"]', { timeout: 5000 });
  } catch {}

  const selector = 'p[data-test-id="main-feed-activity-card__commentary"]';
  await page.waitForSelector(selector, { timeout: 20000 });

  const content = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return "No content found";
    const links = Array.from(el.querySelectorAll("a"))
      .map((a) => `${a.textContent?.trim()} (${a.getAttribute("href")})`)
      .join("\n");
    const text = el.textContent?.trim() || "";
    return text + (links ? "\n\nLinks:\n" + links : "");
  }, selector);

  await browser.close();
  return content;
}

app.post("/summarize", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.includes("linkedin.com")) {
    return res.status(400).json({ error: "Invalid LinkedIn URL" });
  }

  try {
    const content = await scrapeLinkedinPost(url);
    const summary = await summarise(content);
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize post" });
  }
});

app.listen(8085, () => {
  console.log("✅ Server running on port 8085");
});
