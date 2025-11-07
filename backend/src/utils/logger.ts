import fs from 'fs';
import path from 'path';

const LOG_FILE = process.env.SYSTEM_LOG_FILE || path.resolve(process.cwd(), 'data/system.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

function ensureDir() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function rotateLogIfNeeded() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const stats = fs.statSync(LOG_FILE);
      if (stats.size > MAX_LOG_SIZE) {
        const backupFile = LOG_FILE + '.old';
        if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
        fs.renameSync(LOG_FILE, backupFile);
      }
    }
  } catch {}
}

export function logInfo(message: string) {
  try {
    ensureDir();
    rotateLogIfNeeded();
    const line = `[INFO] ${new Date().toISOString()} ${message}\n`;
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}

export function logError(message: string) {
  try {
    ensureDir();
    rotateLogIfNeeded();
    const line = `[ERROR] ${new Date().toISOString()} ${message}\n`;
    fs.appendFileSync(LOG_FILE, line);
    console.error(line); // 同时输出到控制台
  } catch {}
}

export function logWarning(message: string) {
  try {
    ensureDir();
    rotateLogIfNeeded();
    const line = `[WARN] ${new Date().toISOString()} ${message}\n`;
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}

export function logRequest(method: string, path: string, duration: number, status: number, userId?: string) {
  try {
    ensureDir();
    rotateLogIfNeeded();
    const userInfo = userId ? ` [User:${userId}]` : '';
    const line = `[REQUEST] ${new Date().toISOString()} ${method} ${path} ${status} ${duration}ms${userInfo}\n`;
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}

export function getLogFilePath() {
  return LOG_FILE;
}


