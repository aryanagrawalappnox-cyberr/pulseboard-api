/*
 * The API's login response contains only a token, and there is no /auth/me
 * endpoint, so the client reads the userId straight out of the JWT payload and
 * then fetches the profile from GET /users/:userId.
 *
 * This is a read of an unverified payload purely to know which user to fetch.
 * The server still verifies the signature on every request, so a tampered
 * payload buys nothing.
 */

function base64UrlDecode(segment) {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));

  // Handle non-ASCII characters in the payload.
  return decodeURIComponent(
    json
      .split("")
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
}

export function decodeToken(token) {
  if (!token) return null;

  const segments = token.split(".");
  if (segments.length !== 3) return null;

  try {
    return JSON.parse(base64UrlDecode(segments[1]));
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token) {
  const payload = decodeToken(token);
  return payload?.userId ?? null;
}

/** Tokens are signed with a 1h expiry; `exp` is in seconds. */
export function getTokenExpiry(token) {
  const payload = decodeToken(token);
  return payload?.exp ? payload.exp * 1000 : null;
}

export function isTokenExpired(token) {
  const expiresAt = getTokenExpiry(token);
  if (!expiresAt) return false;

  return Date.now() >= expiresAt;
}
