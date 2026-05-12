import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "prod_log_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function hashPassword(plain: string) {
	return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string) {
	return bcrypt.compare(plain, hash);
}

export function generateSessionToken() {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
