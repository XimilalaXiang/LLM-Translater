import { db } from '../database/schema';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
}

const AUTH_ENABLED_KEY = 'auth_enabled';

export class AuthService {
  isAuthEnabled(): boolean {
    const row = db.prepare('SELECT value FROM app_settings WHERE key = ?').get(AUTH_ENABLED_KEY) as any;
    return row ? row.value === '1' : false;
  }

  setAuthEnabled(enabled: boolean): void {
    const value = enabled ? '1' : '0';
    const stmt = db.prepare(`INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`);
    stmt.run(AUTH_ENABLED_KEY, value);
  }

  getUserByUsername(username: string): AuthUser | null {
    const row = db.prepare('SELECT id, username, role, created_at FROM users WHERE username = ?').get(username) as any;
    return row || null;
  }

  getUserById(id: string): AuthUser | null {
    const row = db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(id) as any;
    return row || null;
  }

  createUser(username: string, password: string, role: 'admin' | 'user' = 'user'): AuthUser {
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(id, username, passwordHash, role);
    return this.getUserById(id)!;
  }

  createAdminIfNone(username: string, password: string): AuthUser {
    const hasAdmin = db.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1").get();
    if (hasAdmin) {
      throw new Error('Admin already exists');
    }
    return this.createUser(username, password, 'admin');
  }

  verifyPassword(username: string, password: string): AuthUser | null {
    const row = db.prepare('SELECT id, username, role, password_hash, created_at FROM users WHERE username = ?').get(username) as any;
    if (!row) return null;
    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) return null;
    return { id: row.id, username: row.username, role: row.role, created_at: row.created_at };
  }

  createSession(userId: string, maxAgeDays = 30): { id: string; expiresAt: string } {
    const id = uuidv4();
    const expires = new Date(Date.now() + maxAgeDays * 24 * 3600 * 1000).toISOString();
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, userId, expires);
    return { id, expiresAt: expires };
  }

  getUserBySession(sessionId: string): AuthUser | null {
    const row = db.prepare(
      'SELECT u.id, u.username, u.role, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > CURRENT_TIMESTAMP'
    ).get(sessionId) as any;
    return row || null;
  }

  deleteSession(sessionId: string): void {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  }

  cleanupExpiredSessions(): void {
    db.prepare('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP').run();
  }
}

export const authService = new AuthService();


