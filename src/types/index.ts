export interface TwitterCredentials {
  username: string;
  password: string;
  email: string;
}

export interface AdminConfig {
  username: string;
  userId: string;
}

export interface BrowserConfig {
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  screenshotDpi: number;
}

export interface AppConfig {
  nodeEnv: string;
  logLevel: string;
  screenshotRetentionDays: number;
  maxMemoryRestart: number;
  restartDelay: number;
  maxRestarts: number;
  healthCheckInterval: number;
  errorAlertThreshold: number;
}

export interface NotificationMention {
  id: string;
  username: string;
  tweetId: string;
  threadUrl: string;
  timestamp: Date;
}

export interface ScreenshotResult {
  success: boolean;
  filePath?: string;
  error?: string;
  processingTime: number;
}

export interface AdminCommand {
  command: string;
  args: string[];
  timestamp: Date;
  userId: string;
}

export interface HealthStatus {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  screenshotCount: number;
  errorCount: number;
  lastScreenshot?: Date;
  browserStatus: 'running' | 'stopped' | 'error';
}

export interface AuthSession {
  cookies: any[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  timestamp: Date;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogContext {
  service?: string;
  operation?: string;
  userId?: string;
  tweetId?: string;
  error?: Error;
  [key: string]: any;
} 