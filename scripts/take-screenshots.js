/**
 * Screenshot generation script for PR CI
 * Takes screenshots of key pages in desktop and mobile viewports
 */

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCREENSHOT_DIR = resolve(__dirname, '../screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

// Viewport configurations
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 667 },
};

// Pages to screenshot
const PAGES = [
  { name: 'home', path: '/', waitFor: 'h1' },
  { name: 'crystal-mountain', path: '/resort/crystal-mountain-wa', waitFor: 'h1' },
];

async function takeScreenshots() {
  console.log('Starting screenshot generation...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshot directory: ${SCREENSHOT_DIR}`);

  // Ensure screenshot directory exists
  await mkdir(SCREENSHOT_DIR, { recursive: true });

  // Launch browser
  const browser = await chromium.launch();
  
  try {
    for (const viewport of Object.keys(VIEWPORTS)) {
      console.log(`\nTaking ${viewport} screenshots...`);
      
      const context = await browser.newContext({
        viewport: VIEWPORTS[viewport],
      });
      
      const page = await context.newPage();
      
      for (const pageConfig of PAGES) {
        const url = `${BASE_URL}${pageConfig.path}`;
        console.log(`  📸 ${pageConfig.name} (${viewport}): ${url}`);
        
        try {
          // Navigate to page
          await page.goto(url, { waitUntil: 'networkidle' });
          
          // Wait for main content to be visible
          await page.waitForSelector(pageConfig.waitFor, { timeout: 10000 });
          
          // Give a bit more time for fonts, images, etc to load
          await page.waitForTimeout(2000);
          
          // Take screenshot
          const filename = `${pageConfig.name}-${viewport}.png`;
          const filepath = resolve(SCREENSHOT_DIR, filename);
          await page.screenshot({ path: filepath, fullPage: true });
          
          console.log(`     ✓ Saved to ${filename}`);
        } catch (error) {
          console.error(`     ✗ Failed: ${error.message}`);
          throw error;
        }
      }
      
      await context.close();
    }
  } finally {
    await browser.close();
  }
  
  console.log('\n✓ All screenshots generated successfully!');
}

// Run the script
takeScreenshots().catch((error) => {
  console.error('Screenshot generation failed:', error);
  process.exit(1);
});
