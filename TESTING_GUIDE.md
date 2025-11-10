# 🧪 Testing Checklist for WhatsApp-Style Chat App

## ✅ Pre-Launch Checklist

### 1. **Firebase Firestore Setup**
- [ ] Firestore database created in Firebase Console
- [ ] Test mode security rules enabled (for development)
- [ ] Firebase credentials correctly configured in `lib/firebase.ts`
- [ ] No console errors related to Firebase

### 2. **Basic Functionality**
- [ ] Can create a new group
- [ ] Can join an existing group with password
- [ ] Messages save to Firestore successfully
- [ ] Messages load from Firestore on page refresh
- [ ] Real-time message updates work
- [ ] Typing indicators appear when someone is typing
- [ ] User sessions persist across page refreshes

### 3. **UI/UX Features**
- [ ] WhatsApp-style message bubbles display correctly
- [ ] Message tails (triangular pointers) show on correct side
- [ ] User avatars generate and display properly
- [ ] Avatar colors are consistent for each user
- [ ] Double checkmarks show on sent messages
- [ ] Timestamps display in correct format
- [ ] Dark/Light theme toggle works
- [ ] Theme preference saves to localStorage
- [ ] Smooth scrolling to bottom on new messages

### 4. **Advanced Features**
- [ ] Links in messages are clickable and open in new tab
- [ ] Large emojis display correctly (emoji-only messages)
- [ ] Quick emoji picker appears on hover
- [ ] Adding emojis to messages works
- [ ] Notification sound plays for new messages (from others)
- [ ] File attachment button works
- [ ] Loading states show during operations

### 5. **Responsive Design**
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Header buttons responsive
- [ ] Chat input responsive
- [ ] Message bubbles adapt to screen size

### 6. **Error Handling**
- [ ] Shows error if Firestore is not accessible
- [ ] Shows error if group doesn't exist
- [ ] Shows error if password is incorrect
- [ ] Handles network disconnection gracefully
- [ ] Shows loading states appropriately

---

## 🧪 Manual Testing Steps

### Test 1: Create and Join Group
1. Open app in browser
2. Click "Create Group"
3. Enter group name: `TestGroup`
4. Enter password: `test123`
5. **Expected**: Redirected to chat page with welcome message

### Test 2: Real-time Messages
1. Open same group in two different browsers/incognito
2. Send message from Browser 1
3. **Expected**: Message appears instantly in Browser 2
4. **Expected**: Notification sound plays in Browser 2

### Test 3: Typing Indicator
1. Open same group in two browsers
2. Start typing in Browser 1 (don't send)
3. **Expected**: "User is typing..." appears in Browser 2

### Test 4: Avatar Generation
1. Create group with different user names
2. **Expected**: Each user has unique colored avatar
3. **Expected**: Same user always gets same color

### Test 5: Message Features
1. Send a regular text message
2. Send a message with URL: `https://google.com`
   - **Expected**: URL is clickable and blue
3. Send only emojis: `😊❤️👍`
   - **Expected**: Emojis display larger (text-4xl)
4. Send message with emoji picker
   - **Expected**: Emoji inserts at cursor position

### Test 6: Theme Switching
1. Click theme toggle button (bottom-right)
2. **Expected**: App switches between light and dark mode
3. Refresh page
4. **Expected**: Theme preference persists

### Test 7: File Upload
1. Click attachment button
2. Select an image file
3. **Expected**: Image uploads and displays in message
4. **Expected**: File shows in Firestore with base64 data

---

## 🔥 Firestore Data Verification

### Check in Firebase Console

**Navigate to**: Firebase Console > Firestore Database

#### Expected Collections:

```
📁 groups/
├── 📄 {groupName}/
│   ├── name: "TestGroup"
│   ├── passwordHash: "..."
│   ├── createdAt: 1699401234567
│   └── 📁 messages/ (subcollection)
│       ├── 📄 {messageId1}/
│       │   ├── id: "msg_..."
│       │   ├── userId: "user_..."
│       │   ├── userName: "John"
│       │   ├── content: "Hello World"
│       │   ├── timestamp: 1699401234567
│       │   └── type: "text"
│       └── 📁 typing/ (subcollection)
│           └── 📄 {userId}/
│               ├── userName: "John"
│               └── timestamp: 1699401234567
```

---

## 🐛 Known Issues & Fixes

### Issue 1: Messages not appearing
**Cause**: Firestore rules may be denying access
**Fix**: Set Firestore rules to test mode:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Issue 2: Avatars not loading
**Cause**: External API blocked or slow connection
**Fix**: Fallback initials should display automatically

### Issue 3: Theme not persisting
**Cause**: localStorage may be disabled
**Fix**: Check browser settings, enable localStorage

### Issue 4: Sound not playing
**Cause**: Browser autoplay policy
**Fix**: User must interact with page first (click anywhere)

---

## 🚀 Performance Checklist

- [ ] Messages load in < 2 seconds
- [ ] Smooth scrolling (60fps)
- [ ] No layout shifts on load
- [ ] Images load progressively
- [ ] Theme toggle is instant
- [ ] No memory leaks (check DevTools)

---

## 📊 Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🔒 Security Considerations

⚠️ **IMPORTANT for Production:**

1. **Update Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read: if true;
      allow write: if true; // Add proper authentication later
      
      match /messages/{messageId} {
        allow read: if true;
        allow create: if true;
      }
      
      match /typing/{userId} {
        allow read: if true;
        allow write: if true;
      }
    }
    
    match /sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
```

2. **Environment Variables**: Move Firebase config to `.env.local`
3. **Input Sanitization**: Already implemented in message-bubble.tsx
4. **Rate Limiting**: Consider adding in production

---

## ✅ Final Verification

Before deploying:

1. Run development server: `npm run dev`
2. Test all features above
3. Check browser console for errors
4. Verify Firestore data structure
5. Test on multiple devices
6. Check network tab for failed requests
7. Verify all animations smooth
8. Test with multiple users simultaneously

---

## 📝 Additional Features to Test (Advanced)

- [ ] Message search functionality
- [ ] User profile management
- [ ] Group settings page
- [ ] Message deletion
- [ ] Media gallery view
- [ ] Notification permissions
- [ ] Service worker (PWA)
- [ ] Offline message queue

---

## 🎉 Success Criteria

Your app is ready when:
✅ All checkboxes above are checked
✅ No console errors
✅ Firestore has proper data structure
✅ Real-time updates work perfectly
✅ UI matches WhatsApp design
✅ Theme toggle works
✅ Avatars display correctly
✅ Sound notifications play
✅ Everything is responsive

**Good luck with your launch! 🚀**
