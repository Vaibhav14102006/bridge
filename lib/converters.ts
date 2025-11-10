/**
 * Data Format Converters
 * Converts between old (verbose) and new (optimized) field names
 * Use these helpers in components to maintain readability
 */

import type { Message, MediaMessage, Group, UserSession, RegisteredUser } from './firebase'

// ============================================================================
// MESSAGE CONVERTERS
// ============================================================================

/**
 * Convert optimized message to readable format for components
 */
export interface ReadableMessage {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: number
  type: "text" | "image" | "video"
  mediaType?: "image" | "video" | "file"
  mediaUrl?: string
  fileName?: string
}

export function toReadableMessage(msg: MediaMessage): ReadableMessage {
  return {
    id: msg.id,
    userId: msg.uid,
    userName: msg.un,
    content: msg.c,
    timestamp: msg.ts,
    type: msg.t === "t" ? "text" : msg.t === "i" ? "image" : "video",
    mediaType: msg.mt === "i" ? "image" : msg.mt === "v" ? "video" : msg.mt === "f" ? "file" : undefined,
    mediaUrl: msg.mu,
    fileName: msg.fn,
  }
}

export function toOptimizedMessage(msg: Partial<ReadableMessage>): Partial<MediaMessage> {
  return {
    id: msg.id,
    uid: msg.userId || "",
    un: msg.userName || "",
    c: msg.content || "",
    ts: msg.timestamp || Date.now(),
    t: msg.type === "text" ? "t" : msg.type === "image" ? "i" : "v",
    mt: msg.mediaType === "image" ? "i" : msg.mediaType === "video" ? "v" : msg.mediaType === "file" ? "f" : undefined,
    mu: msg.mediaUrl,
    fn: msg.fileName,
  }
}

// ============================================================================
// GROUP CONVERTERS
// ============================================================================

export interface ReadableGroup {
  id: string
  name: string
  passwordHash: string
  createdAt: number
}

export function toReadableGroup(group: Group): ReadableGroup {
  return {
    id: group.id,
    name: group.n,
    passwordHash: group.ph,
    createdAt: group.ca,
  }
}

export function toOptimizedGroup(group: Partial<ReadableGroup>): Partial<Group> {
  return {
    id: group.id,
    n: group.name || "",
    ph: group.passwordHash || "",
    ca: group.createdAt || Date.now(),
  }
}

// ============================================================================
// USER CONVERTERS
// ============================================================================

export interface ReadableUser {
  userId: string
  displayName: string
  registeredAt: number
}

export function toReadableUser(user: RegisteredUser): ReadableUser {
  return {
    userId: user.uid,
    displayName: user.dn,
    registeredAt: user.ra,
  }
}

export function toOptimizedUser(user: Partial<ReadableUser>): Partial<RegisteredUser> {
  return {
    uid: user.userId || "",
    dn: user.displayName || "",
    ra: user.registeredAt || Date.now(),
  }
}

// ============================================================================
// SESSION CONVERTERS
// ============================================================================

export interface ReadableSession {
  displayName: string
  groupName: string
  userId: string
  sessionId: string
}

export function toReadableSession(session: UserSession): ReadableSession {
  return {
    displayName: session.dn,
    groupName: session.gn,
    userId: session.uid,
    sessionId: session.sid,
  }
}

export function toOptimizedSession(session: Partial<ReadableSession>): Partial<UserSession> {
  return {
    dn: session.displayName || "",
    gn: session.groupName || "",
    uid: session.userId || "",
    sid: session.sessionId || "",
  }
}

// ============================================================================
// BULK CONVERTERS
// ============================================================================

export function toReadableMessages(messages: MediaMessage[]): ReadableMessage[] {
  return messages.map(toReadableMessage)
}

export function toReadableGroups(groups: Group[]): ReadableGroup[] {
  return groups.map(toReadableGroup)
}

export function toReadableUsers(users: RegisteredUser[]): ReadableUser[] {
  return users.map(toReadableUser)
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// In components, use readable format:

import { toReadableMessage, toOptimizedMessage } from '@/lib/converters'

// When fetching from database:
const dbMessages = await getMessages(groupName)
const messages = toReadableMessages(dbMessages)

messages.forEach(msg => {
  console.log(msg.userName) // ✅ Readable!
  console.log(msg.timestamp) // ✅ Readable!
})

// When sending to database:
const newMessage = toOptimizedMessage({
  userId: "user123",
  userName: "John",
  content: "Hello!",
  timestamp: Date.now(),
  type: "text"
})

await saveMessage(groupName, newMessage as MediaMessage)
*/
