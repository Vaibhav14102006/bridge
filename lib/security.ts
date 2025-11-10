// import crypto from "crypto"
// import { initializeApp, getDatabase, ref, set, get } from "firebase/database"

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   databaseURL: "YOUR_DATABASE_URL",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// }

// const app = initializeApp(firebaseConfig)
// const database = getDatabase(app)
// const rateLimitRef = ref(database, "ratelimit")

const rateLimitStore = new Map<string, { attempts: number; firstAttempt: number }>()

/**
 * Simple hash function for passwords using Web Crypto API
 * In production, use bcrypt or similar
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Generate secure session token using Web Crypto API
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Validate password strength
 * Removed all password validation - accept any passcode
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  // No restrictions - any password is valid
  return {
    isValid: true,
    errors: [],
  }
}

/**
 * Validate group name
 */
export function validateGroupName(name: string): boolean {
  return name.length > 0 && name.length <= 50 && /^[a-zA-Z0-9\s-_]+$/.test(name)
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string): boolean {
  return name.length > 0 && name.length <= 30
}

/**
 * Rate limiting check (in-memory, client-side only)
 */
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): boolean {
  const ratelimitKey = `ratelimit_${key}`
  const now = Date.now()

  const data = rateLimitStore.get(ratelimitKey)

  if (!data) {
    rateLimitStore.set(ratelimitKey, { attempts: 1, firstAttempt: now })
    return true
  }

  const { attempts, firstAttempt } = data

  if (now - firstAttempt > windowMs) {
    rateLimitStore.set(ratelimitKey, { attempts: 1, firstAttempt: now })
    return true
  }

  if (attempts >= maxAttempts) {
    return false
  }

  rateLimitStore.set(ratelimitKey, { attempts: attempts + 1, firstAttempt })
  return true
}

/**
 * Clear rate limit
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(`ratelimit_${key}`)
}
