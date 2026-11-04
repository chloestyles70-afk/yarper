export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function getSessionExpiry(now = Date.now()) {
  return new Date(now + SESSION_TTL_MS).toISOString();
}

export function isSessionActive(expiresAt, revokedAt = null, now = Date.now()) {
  if (revokedAt) return false;
  const expiry = typeof expiresAt === "number" ? expiresAt : Date.parse(expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}
