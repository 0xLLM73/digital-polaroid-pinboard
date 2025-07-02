import puppeteer, { Browser, Page } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger } from '../utils/logger';
import { browserConfig } from '../config';
import { AuthSession } from '../types';
import fs from 'fs/promises';
import path from 'path';

// Configure puppeteer with stealth plugin
puppeteerExtra.use(StealthPlugin());

export class BrowserService {
  private logger = new Logger('BrowserService');
  private browser: Browser | null = null;
  private operationCount = 0;
  private readonly maxOperations = 100;

  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing browser service');
      
      this.browser = await puppeteerExtra.launch({
        headless: browserConfig.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ],
        defaultViewport: {
          width: browserConfig.viewport.width,
          height: browserConfig.viewport.height,
          deviceScaleFactor: browserConfig.screenshotDpi / 96
        }
      });

      this.logger.info('Browser initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize browser', { error: error as Error });
      throw new Error(`Browser initialization failed: ${(error as Error).message}`);
    }
  }

  async createPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    try {
      const page = await this.browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Set extra HTTP headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
      });

      // Disable images for performance (except for screenshots)
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (request.resourceType() === 'image' && !request.url().includes('pbs.twimg.com')) {
          request.abort();
        } else {
          request.continue();
        }
      });

      this.operationCount++;
      return page;
    } catch (error) {
      this.logger.error('Failed to create page', { error: error as Error });
      throw new Error(`Page creation failed: ${(error as Error).message}`);
    }
  }

  async saveSession(page: Page): Promise<void> {
    try {
      const cookies = await page.cookies();
      const localStorage = await page.evaluate(() => {
        const storage: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            storage[key] = localStorage.getItem(key) || '';
          }
        }
        return storage;
      });

      const sessionStorage = await page.evaluate(() => {
        const storage: Record<string, string> = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            storage[key] = sessionStorage.getItem(key) || '';
          }
        }
        return storage;
      });

      const session: AuthSession = {
        cookies,
        localStorage,
        sessionStorage,
        timestamp: new Date()
      };

      const sessionPath = path.join('./data/sessions', 'twitter-session.json');
      await fs.writeFile(sessionPath, JSON.stringify(session, null, 2));
      
      this.logger.info('Session saved successfully');
    } catch (error) {
      this.logger.error('Failed to save session', { error: error as Error });
      throw new Error(`Session save failed: ${(error as Error).message}`);
    }
  }

  async restoreSession(page: Page): Promise<boolean> {
    try {
      const sessionPath = path.join('./data/sessions', 'twitter-session.json');
      const sessionData = await fs.readFile(sessionPath, 'utf-8');
      const session: AuthSession = JSON.parse(sessionData);

      // Check if session is not too old (24 hours)
      const sessionAge = Date.now() - new Date(session.timestamp).getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        this.logger.warn('Session too old, skipping restore');
        return false;
      }

      // Restore cookies
      await page.setCookie(...session.cookies);

      // Restore localStorage and sessionStorage
      await page.evaluateOnNewDocument((localStorage, sessionStorage) => {
        Object.entries(localStorage).forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });
        Object.entries(sessionStorage).forEach(([key, value]) => {
          window.sessionStorage.setItem(key, value);
        });
      }, session.localStorage, session.sessionStorage);

      this.logger.info('Session restored successfully');
      return true;
    } catch (error) {
      this.logger.warn('Failed to restore session', { error: error as Error });
      return false;
    }
  }

  async shouldRestart(): Promise<boolean> {
    return this.operationCount >= this.maxOperations;
  }

  async restart(): Promise<void> {
    this.logger.info('Restarting browser service');
    await this.close();
    this.operationCount = 0;
    await this.initialize();
  }

  async close(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.logger.info('Browser closed successfully');
      }
    } catch (error) {
      this.logger.error('Failed to close browser', { error: error as Error });
    }
  }

  isInitialized(): boolean {
    return this.browser !== null;
  }
} 