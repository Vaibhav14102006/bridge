import { initializeApp } from "firebase/app"
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  updateDoc,
  addDoc,
  Timestamp,
  serverTimestamp
} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR6ya5VDU_d1f7MMAj3rTxt9i0OD3bUM8",
  authDomain: "bridge-cad2c.firebaseapp.com",
  projectId: "bridge-cad2c",
  storageBucket: "bridge-cad2c.firebasestorage.app",
  messagingSenderId: "662792565586",
  appId: "1:662792565586:web:698985074d90906240808b"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Export db for use in other modules
export { db }

// Optimized: Minimal data storage
export interface Message {
  id: string
  uid: string // Shortened from userId
  un: string // Shortened from userName  
  c: string // Shortened from content
  ts: number // Shortened from timestamp
  t: "t" | "i" | "v" // Shortened from type: text/image/video
  rb?: string[] // readBy: Array of userIds who read this message (legacy)
  rbt?: { [userId: string]: number } // readByTimestamps: userId -> timestamp mapping
}

export interface MediaMessage extends Message {
  mt?: "i" | "v" | "f" // Shortened from mediaType
  mu?: string // Shortened from mediaUrl (compressed base64)
  fn?: string // Shortened from fileName
}

// Online User Tracking
export interface OnlineUser {
  uid: string // userId
  un: string // userName
  la: number // lastActive timestamp
  s: "online" | "away" // status
}

// Optimized: Only essential group data
export interface Group {
  id: string
  n: string // Shortened from name
  ph: string // Shortened from passwordHash
  ca: number // Shortened from createdAt
  // Removed: updatedAt, admin (not essential)
}

// Optimized: Sessions are temporary, minimal storage
export interface UserSession {
  dn: string // Shortened from displayName
  gn: string // Shortened from groupName
  uid: string // Shortened from userId
  sid: string // Shortened from sessionId
  // Removed: joinedAt (not essential for functionality)
}

// Optimized: Only essential user data
export interface RegisteredUser {
  uid: string // Shortened from userId
  dn: string // Shortened from displayName
  ra: number // Shortened from registeredAt, changed to timestamp
  // Removed: lastActive (not essential)
}

// Messages API - Optimized storage
export async function saveMessage(groupName: string, message: MediaMessage): Promise<void> {
  try {
    const messagesRef = collection(db, `groups/${groupName}/messages`)
    // Only save essential fields
    await addDoc(messagesRef, {
      ...message,
      ts: message.ts || Date.now() // Use shortened field name
    })
  } catch (error) {
    console.error("[v0] Error saving message:", error)
    throw error
  }
}

export async function getMessages(groupName: string): Promise<MediaMessage[]> {
  try {
    const messagesRef = collection(db, `groups/${groupName}/messages`)
    const q = query(messagesRef, orderBy("ts", "asc")) // Use shortened field name
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return []

    const messages: MediaMessage[] = []
    snapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id } as MediaMessage)
    })
    return messages
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return []
  }
}

export function onMessagesChange(groupName: string, callback: (messages: MediaMessage[]) => void): () => void {
  try {
    const messagesRef = collection(db, `groups/${groupName}/messages`)
    const q = query(messagesRef, orderBy("ts", "asc")) // Use shortened field name
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: MediaMessage[] = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id } as MediaMessage)
      })
      callback(messages)
    })
    return unsubscribe
  } catch (error) {
    console.error("[v0] Error setting up message listener:", error)
    return () => {}
  }
}

// Group Password API - Optimized storage
export async function setGroupPassword(groupName: string, passwordHash: string): Promise<void> {
  try {
    const groupRef = doc(db, "groups", groupName)
    await setDoc(groupRef, { ph: passwordHash }, { merge: true }) // Shortened field name
  } catch (error) {
    console.error("[v0] Error setting group password:", error)
    throw error
  }
}

export async function getGroupPassword(groupName: string): Promise<string | null> {
  try {
    const groupRef = doc(db, "groups", groupName)
    const snapshot = await getDoc(groupRef)
    return snapshot.exists() ? snapshot.data()?.ph || null : null // Shortened field name
  } catch (error) {
    console.error("[v0] Error fetching group password:", error)
    return null
  }
}

// Group Data API
export async function getGroupData(groupName: string): Promise<any> {
  try {
    const groupRef = doc(db, "groups", groupName)
    const snapshot = await getDoc(groupRef)
    return snapshot.exists() ? snapshot.data() : null
  } catch (error) {
    console.error("[v0] Error fetching group data:", error)
    return null
  }
}

export async function getAllGroups(): Promise<Group[]> {
  try {
    console.log("[Firebase] Fetching all groups...")
    const groupsRef = collection(db, "groups")
    const snapshot = await getDocs(groupsRef)
    
    console.log("[Firebase] Groups snapshot size:", snapshot.size)
    
    if (snapshot.empty) {
      console.log("[Firebase] No groups found in database")
      return []
    }

    const groups: Group[] = []
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      console.log("[Firebase] Found group:", docSnapshot.id, data)
      groups.push({
        id: docSnapshot.id,
        n: docSnapshot.id, // Shortened field name
        ph: data.ph || "", // Shortened field name
        ca: data.ca || Date.now(), // Shortened field name
      })
    })
    
    console.log("[Firebase] Total groups loaded:", groups.length)
    return groups
  } catch (error) {
    console.error("[Firebase] Error fetching groups:", error)
    return []
  }
}

export async function deleteGroup(groupName: string): Promise<void> {
  try {
    const groupRef = doc(db, "groups", groupName)
    await deleteDoc(groupRef)
  } catch (error) {
    console.error("[v0] Error deleting group:", error)
    throw error
  }
}

export async function updateGroupPassword(groupName: string, newPasswordHash: string): Promise<void> {
  try {
    const groupRef = doc(db, "groups", groupName)
    // Only update password hash - no updatedAt needed
    await updateDoc(groupRef, {
      ph: newPasswordHash, // Shortened field name
    })
  } catch (error) {
    console.error("[v0] Error updating password:", error)
    throw error
  }
}

// Read Receipts API
export async function markMessageAsRead(groupName: string, messageId: string, userId: string): Promise<void> {
  try {
    const messagesRef = collection(db, `groups/${groupName}/messages`)
    const q = query(messagesRef)
    const snapshot = await getDocs(q)
    
    snapshot.forEach(async (docSnapshot) => {
      if (docSnapshot.id === messageId) {
        const data = docSnapshot.data()
        const readBy = data.rb || []
        const readByTimestamps = data.rbt || {}
        
        // Only update if user hasn't read it yet
        if (!readBy.includes(userId)) {
          readBy.push(userId)
          readByTimestamps[userId] = Date.now()
          
          await updateDoc(docSnapshot.ref, { 
            rb: readBy,
            rbt: readByTimestamps
          })
        }
      }
    })
  } catch (error) {
    console.error("[Firebase] Error marking message as read:", error)
  }
}

export async function markAllMessagesAsRead(groupName: string, userId: string): Promise<void> {
  try {
    const messagesRef = collection(db, `groups/${groupName}/messages`)
    const snapshot = await getDocs(messagesRef)
    
    const currentTime = Date.now()
    const updates: Promise<void>[] = []
    
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const readBy = data.rb || []
      const readByTimestamps = data.rbt || {}
      
      if (!readBy.includes(userId)) {
        readBy.push(userId)
        readByTimestamps[userId] = currentTime
        
        updates.push(updateDoc(docSnapshot.ref, { 
          rb: readBy,
          rbt: readByTimestamps
        }))
      }
    })
    
    await Promise.all(updates)
    console.log("[Firebase] All messages marked as read")
  } catch (error) {
    console.error("[Firebase] Error marking all messages as read:", error)
  }
}

// Online Users API
export async function setUserOnlineStatus(
  groupName: string,
  userId: string,
  userName: string,
  status: "online" | "away"
): Promise<void> {
  try {
    const onlineRef = doc(db, `groups/${groupName}/online`, userId)
    await setDoc(onlineRef, {
      uid: userId,
      un: userName,
      la: Date.now(),
      s: status,
    })
  } catch (error) {
    console.error("[Firebase] Error setting online status:", error)
  }
}

export async function removeUserOnlineStatus(groupName: string, userId: string): Promise<void> {
  try {
    const onlineRef = doc(db, `groups/${groupName}/online`, userId)
    await deleteDoc(onlineRef)
  } catch (error) {
    console.error("[Firebase] Error removing online status:", error)
  }
}

export function onOnlineUsersChange(groupName: string, callback: (users: OnlineUser[]) => void): () => void {
  try {
    const onlineRef = collection(db, `groups/${groupName}/online`)
    const unsubscribe = onSnapshot(onlineRef, (snapshot) => {
      const users: OnlineUser[] = []
      const now = Date.now()
      
      snapshot.forEach((doc) => {
        const data = doc.data() as OnlineUser
        // Consider user away if no activity for 2 minutes
        if (now - data.la < 120000) {
          users.push(data)
        }
      })
      
      callback(users)
    })
    return unsubscribe
  } catch (error) {
    console.error("[Firebase] Error setting up online users listener:", error)
    return () => {}
  }
}

// Typing Indicator API
export async function setTypingStatus(
  groupName: string,
  userId: string,
  userName: string,
  isTyping: boolean,
): Promise<void> {
  try {
    const typingRef = doc(db, `groups/${groupName}/typing`, userId)
    if (isTyping) {
      await setDoc(typingRef, {
        userName,
        timestamp: Date.now(),
      })
    } else {
      await deleteDoc(typingRef)
    }
  } catch (error) {
    console.error("[v0] Error setting typing status:", error)
  }
}

export function onTypingStatusChange(groupName: string, callback: (users: string[]) => void): () => void {
  try {
    const typingRef = collection(db, `groups/${groupName}/typing`)
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const users: string[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        users.push(data.userName)
      })
      callback(users)
    })
    return unsubscribe
  } catch (error) {
    console.error("[v0] Error setting up typing listener:", error)
    return () => {}
  }
}

// Sessions API - Optimized storage
export async function saveUserSession(session: UserSession): Promise<void> {
  try {
    const sessionRef = doc(db, "sessions", session.sid) // Use shortened field name
    await setDoc(sessionRef, session)
  } catch (error) {
    console.error("[v0] Error saving session:", error)
    throw error
  }
}

export async function getUserSession(sessionId: string): Promise<UserSession | null> {
  try {
    console.log("[Firebase] Fetching session:", sessionId)
    const sessionRef = doc(db, "sessions", sessionId)
    const snapshot = await getDoc(sessionRef)
    
    if (snapshot.exists()) {
      const data = snapshot.data() as UserSession
      console.log("[Firebase] Session found:", data)
      return data
    } else {
      console.log("[Firebase] Session not found in Firestore")
      return null
    }
  } catch (error) {
    console.error("[Firebase] Error fetching session:", error)
    return null
  }
}

export async function deleteUserSession(sessionId: string): Promise<void> {
  try {
    const sessionRef = doc(db, "sessions", sessionId)
    await deleteDoc(sessionRef)
  } catch (error) {
    console.error("[v0] Error deleting session:", error)
  }
}

// User Registration System - Optimized storage
export async function registerUser(displayName: string): Promise<RegisteredUser> {
  try {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const user: RegisteredUser = {
      uid: userId, // Shortened field name
      dn: displayName, // Shortened field name  
      ra: Date.now(), // Shortened field name, use timestamp
    }
    
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, user)
    console.log("[Firebase] User registered:", user)
    return user
  } catch (error) {
    console.error("[Firebase] Error registering user:", error)
    throw error
  }
}

export async function getRegisteredUser(userId: string): Promise<RegisteredUser | null> {
  try {
    const userRef = doc(db, "users", userId)
    const snapshot = await getDoc(userRef)
    
    if (snapshot.exists()) {
      const user = snapshot.data() as RegisteredUser
      console.log("[Firebase] User found:", user)
      return user
    }
    return null
  } catch (error) {
    console.error("[Firebase] Error fetching user:", error)
    return null
  }
}

export async function updateUserLastActive(userId: string): Promise<void> {
  // Removed - lastActive is not stored anymore to save database space
  // This function is kept for backward compatibility but does nothing
  console.log("[Firebase] Last active tracking disabled to save database space")
}

// Optimized: Store only essential group data
export async function createGroup(groupName: string, passwordHash: string): Promise<void> {
  try {
    console.log("[Firebase] Creating group:", groupName)
    const groupRef = doc(db, "groups", groupName)
    const groupData = {
      n: groupName, // Shortened from name
      ph: passwordHash, // Shortened from passwordHash
      ca: Date.now(), // Shortened from createdAt
      // Removed: updatedAt, admin (not essential)
    }
    await setDoc(groupRef, groupData)
    console.log("[Firebase] Group created successfully:", groupName)
    
    // Verify the group was created
    const verifyDoc = await getDoc(groupRef)
    if (verifyDoc.exists()) {
      console.log("[Firebase] Group verified in database:", verifyDoc.data())
    } else {
      console.error("[Firebase] Group not found after creation!")
    }
  } catch (error) {
    console.error("[Firebase] Error creating group:", error)
    throw error
  }
}

// Admin Functions
export async function adminDeleteMessage(groupName: string, messageId: string): Promise<void> {
  try {
    const messageRef = doc(db, `groups/${groupName}/messages`, messageId)
    
    // First check if message exists
    const messageDoc = await getDoc(messageRef)
    if (!messageDoc.exists()) {
      throw new Error(`Message ${messageId} not found in group ${groupName}`)
    }
    
    // Delete from Firestore database
    await deleteDoc(messageRef)
    
    // Verify deletion
    const verifyDoc = await getDoc(messageRef)
    if (verifyDoc.exists()) {
      throw new Error(`Failed to delete message ${messageId} from database`)
    }
    
    console.log("[Firebase Admin] Message deleted successfully from Firestore:", messageId)
  } catch (error) {
    console.error("[Firebase Admin] Error deleting message from Firestore:", error)
    throw error
  }
}

export async function adminBulkDeleteMessages(groupName: string, messageIds: string[]): Promise<void> {
  try {
    // First verify all messages exist
    const verifyPromises = messageIds.map(async messageId => {
      const messageRef = doc(db, `groups/${groupName}/messages`, messageId)
      const messageDoc = await getDoc(messageRef)
      if (!messageDoc.exists()) {
        throw new Error(`Message ${messageId} not found in group ${groupName}`)
      }
      return messageRef
    })
    
    const messageRefs = await Promise.all(verifyPromises)
    
    // Delete all messages from Firestore database
    const deletePromises = messageRefs.map(messageRef => deleteDoc(messageRef))
    await Promise.all(deletePromises)
    
    // Verify all deletions
    const verifyDeletionPromises = messageRefs.map(async messageRef => {
      const verifyDoc = await getDoc(messageRef)
      if (verifyDoc.exists()) {
        throw new Error(`Failed to delete message from database: ${messageRef.id}`)
      }
    })
    
    await Promise.all(verifyDeletionPromises)
    
    console.log("[Firebase Admin] Bulk deleted messages from Firestore successfully:", messageIds.length)
  } catch (error) {
    console.error("[Firebase Admin] Error bulk deleting messages from Firestore:", error)
    throw error
  }
}

export async function adminGetAllGroupsWithMessages(): Promise<{
  groupName: string
  messages: (MediaMessage & { id: string })[]
}[]> {
  try {
    const groups = await getAllGroups()
    const result = []
    
    for (const group of groups) {
      const groupName = group.n
      const messagesRef = collection(db, `groups/${groupName}/messages`)
      const q = query(messagesRef, orderBy("ts", "desc"))
      const snapshot = await getDocs(q)
      
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (MediaMessage & { id: string })[]
      
      result.push({
        groupName,
        messages
      })
    }
    
    return result
  } catch (error) {
    console.error("[Firebase Admin] Error getting all groups with messages:", error)
    throw error
  }
}

export async function adminDeleteGroup(groupName: string): Promise<void> {
  try {
    // Delete all messages in the group
    const messagesRef = collection(db, `groups/${groupName}/messages`)
    const messagesSnapshot = await getDocs(messagesRef)
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    
    // Delete all online status records
    const onlineRef = collection(db, `groups/${groupName}/online`)
    const onlineSnapshot = await getDocs(onlineRef)
    const deleteOnlinePromises = onlineSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deleteOnlinePromises)
    
    // Delete the group document
    const groupRef = doc(db, "groups", groupName)
    await deleteDoc(groupRef)
    
    console.log("[Firebase Admin] Group deleted successfully:", groupName)
  } catch (error) {
    console.error("[Firebase Admin] Error deleting group:", error)
    throw error
  }
}

// Admin Online Status Monitoring
export async function adminGetAllOnlineUsers(): Promise<{
  groupName: string
  onlineUsers: OnlineUser[]
}[]> {
  try {
    const groups = await getAllGroups()
    const result = []
    
    for (const group of groups) {
      const groupName = group.n
      const onlineRef = collection(db, `groups/${groupName}/online`)
      const snapshot = await getDocs(onlineRef)
      
      const onlineUsers: OnlineUser[] = []
      const now = Date.now()
      
      snapshot.forEach((doc) => {
        const data = doc.data() as OnlineUser
        // Consider user online if active within last 5 minutes
        if (now - data.la < 300000) {
          onlineUsers.push(data)
        }
      })
      
      result.push({
        groupName,
        onlineUsers
      })
    }
    
    return result
  } catch (error) {
    console.error("[Firebase Admin] Error getting all online users:", error)
    throw error
  }
}

export function adminOnAllOnlineUsersChange(callback: (allUsers: {
  groupName: string
  onlineUsers: OnlineUser[]
}[]) => void): () => void {
  const unsubscribers: (() => void)[] = []
  
  const setupListeners = async () => {
    try {
      const groups = await getAllGroups()
      
      for (const group of groups) {
        const groupName = group.n
        const onlineRef = collection(db, `groups/${groupName}/online`)
        
        const unsubscribe = onSnapshot(onlineRef, (snapshot) => {
          // Re-fetch all data when any group's online status changes
          adminGetAllOnlineUsers().then(callback).catch(console.error)
        })
        
        unsubscribers.push(unsubscribe)
      }
    } catch (error) {
      console.error("[Firebase Admin] Error setting up online status listeners:", error)
    }
  }
  
  setupListeners()
  
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe())
  }
}

export async function adminForceUserOffline(groupName: string, userId: string): Promise<void> {
  try {
    const onlineRef = doc(db, `groups/${groupName}/online`, userId)
    await deleteDoc(onlineRef)
    console.log("[Firebase Admin] Forced user offline:", userId, "from group:", groupName)
  } catch (error) {
    console.error("[Firebase Admin] Error forcing user offline:", error)
    throw error
  }
}
