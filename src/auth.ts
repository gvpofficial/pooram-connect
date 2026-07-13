import { dbService, User } from './db';

const SESSION_KEY = 'pooram_connect_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: User['role'];
  name: string;
  isVerified: boolean;
}

export function getSession(): SessionPayload | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    
    const payload = JSON.parse(sessionData) as SessionPayload;
    
    // Refresh database verification and name status
    const user = dbService.getUserById(payload.userId);
    if (!user) {
      logout();
      return null;
    }
    
    return {
      ...payload,
      isVerified: user.isVerified,
      name: user.name
    };
  } catch {
    return null;
  }
}

export function setSession(user: User): SessionPayload {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    isVerified: user.isVerified
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  // Dispatch custom event to let header or other components know session changed
  window.dispatchEvent(new Event('session-changed'));
  return payload;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('session-changed'));
}

export function checkRole(allowedRoles: User['role'][]): SessionPayload | null {
  const session = getSession();
  if (!session) return null;
  if (!allowedRoles.includes(session.role)) return null;
  return session;
}
