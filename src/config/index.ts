import dotenv from 'dotenv';
import { TwitterCredentials, AdminConfig, BrowserConfig, AppConfig } from '../types';

dotenv.config();

export const twitterConfig: TwitterCredentials = {
  username: process.env.TWITTER_USERNAME || '',
  password: process.env.TWITTER_PASSWORD || '',
  email: process.env.TWITTER_EMAIL || ''
};

export const adminConfig: AdminConfig = {
  username: process.env.ADMIN_USERNAME || '',
  userId: process.env.ADMIN_USER_ID || ''
};

export const browserConfig: BrowserConfig = {
  headless: process.env.HEADLESS === 'true',
  viewport: {
    width: parseInt(process.env.VIEWPORT_WIDTH || '1200'),
    height: parseInt(process.env.VIEWPORT_HEIGHT || '800')
  },
  screenshotDpi: parseInt(process.env.SCREENSHOT_DPI || '144')
};

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  screenshotRetentionDays: parseInt(process.env.SCREENSHOT_RETENTION_DAYS || '30'),
  maxMemoryRestart: parseInt(process.env.MAX_MEMORY_RESTART || '2048'),
  restartDelay: parseInt(process.env.RESTART_DELAY || '5000'),
  maxRestarts: parseInt(process.env.MAX_RESTARTS || '10'),
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '300000'),
  errorAlertThreshold: parseInt(process.env.ERROR_ALERT_THRESHOLD || '5')
};

export const paths = {
  sessions: './data/sessions',
  screenshots: './data/screenshots',
  logs: './data/logs',
  config: './data/config.json'
};

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!twitterConfig.username) errors.push('TWITTER_USERNAME is required');
  if (!twitterConfig.password) errors.push('TWITTER_PASSWORD is required');
  if (!twitterConfig.email) errors.push('TWITTER_EMAIL is required');
  if (!adminConfig.username) errors.push('ADMIN_USERNAME is required');
  if (!adminConfig.userId) errors.push('ADMIN_USER_ID is required');

  return {
    valid: errors.length === 0,
    errors
  };
} 