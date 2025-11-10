# 🔥 Firebase Firestore Setup Guide

## Step-by-Step Setup Instructions

### 1. **Access Firebase Console**
1. Go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Find your project: `bridge-cad2c`

---

### 2. **Enable Firestore Database**

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"** button
3. Choose location: **Select closest to your users** (e.g., `us-central` or `asia-south1`)
4. Select **"Start in test mode"** for now
5. Click **"Enable"**

⏱️ This takes about 30-60 seconds to provision.

---

### 3. **Configure Security Rules**

After database is created:

1. Go to **"Rules"** tab in Firestore
2. Replace the default rules with:

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

3. Click **"Publish"**

⚠️ **Note**: These rules allow anyone to read/write. Perfect for development, but **change for production**!

---

### 4. **Verify Your Configuration**

Check that your credentials match in `lib/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBR6ya5VDU_d1f7MMAj3rTxt9i0OD3bUM8",
  authDomain: "bridge-cad2c.firebaseapp.com",
  projectId: "bridge-cad2c",
  storageBucket: "bridge-cad2c.firebasestorage.app",
  messagingSenderId: "662792565586",
  appId: "1:662792565586:web:698985074d90906240808b"
}
```

✅ **Your credentials are already configured correctly!**

---

### 5. **Test the Connection**

1. Open terminal in your project folder
2. Run: `npm run dev`
3. Open browser: `http://localhost:3000`
4. Create a test group and send a message
5. Go back to Firebase Console > Firestore Database
6. You should see:
   ```
   📁 groups
     └── 📄 {your-group-name}
         └── 📁 messages
             └── 📄 {message-id}
   ```

---

### 6. **Monitor Real-time Data**

In Firebase Console:
1. Go to **Firestore Database** tab
2. You'll see data appear in real-time as you use the app
3. Click on documents to view their contents

---

## 🎯 Expected Data Structure

After sending your first message, you should see:

```
📁 Firestore Database
│
├── 📁 groups/
│   ├── 📄 TestGroup/
│   │   ├── name: "TestGroup"
│   │   ├── passwordHash: "..."
│   │   ├── createdAt: 1699401234567
│   │   ├── updatedAt: 1699401234567
│   │   ├── admin: true
│   │   │
│   │   ├── 📁 messages/ (subcollection)
│   │   │   ├── 📄 abc123/
│   │   │   │   ├── id: "msg_1699401234567"
│   │   │   │   ├── userId: "user_1699401234567_abc123"
│   │   │   │   ├── userName: "John Doe"
│   │   │   │   ├── content: "Hello World!"
│   │   │   │   ├── timestamp: 1699401234567
│   │   │   │   └── type: "text"
│   │   │   │
│   │   │   └── 📄 def456/
│   │   │       └── ... (next message)
│   │   │
│   │   └── 📁 typing/ (subcollection)
│   │       └── 📄 user_1699401234567_abc123/
│   │           ├── userName: "John Doe"
│   │           └── timestamp: 1699401234567
│   │
│   └── 📄 AnotherGroup/
│       └── ... (similar structure)
│
└── 📁 sessions/
    └── 📄 session_1699401234567_abc123/
        ├── displayName: "John Doe"
        ├── groupName: "TestGroup"
        ├── userId: "user_1699401234567_abc123"
        ├── joinedAt: "2024-11-08T10:30:00.000Z"
        └── sessionId: "session_1699401234567_abc123"
```

---

## 🔍 Troubleshooting

### ❌ Error: "Missing or insufficient permissions"

**Solution**: Update Firestore Rules to allow access (see Step 3 above)

### ❌ Error: "FirebaseError: 7 PERMISSION_DENIED"

**Solution**: 
1. Go to Firestore Rules tab
2. Make sure rules allow `read, write: if true`
3. Click "Publish"

### ❌ Messages not saving

**Solution**:
1. Check browser console for errors
2. Verify Firestore is enabled
3. Check network tab - should see requests to `firestore.googleapis.com`

### ❌ Data not appearing in real-time

**Solution**:
1. Check if Firebase SDK is loaded properly
2. Verify onSnapshot listeners are attached
3. Check browser console for connection errors

---

## 📊 Usage Monitoring

### View Usage Stats:
1. Go to Firebase Console
2. Click **"Usage and billing"** in left sidebar
3. Monitor:
   - Document reads
   - Document writes
   - Document deletes
   - Stored data size

### Free Tier Limits (Spark Plan):
- **Stored data**: 1 GB
- **Document reads**: 50,000/day
- **Document writes**: 20,000/day
- **Document deletes**: 20,000/day

For a small app with ~100 users, this is **plenty**!

---

## 🔐 Security Best Practices

### For Development (Current):
```javascript
// Allow everything - perfect for testing
allow read, write: if true;
```

### For Production (Recommended):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read: if true;
      allow write: if request.auth != null; // Add auth later
      
      match /messages/{messageId} {
        allow read: if true;
        allow create: if request.resource.data.keys().hasAll(['content', 'userId', 'userName', 'timestamp']);
        allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      }
    }
    
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## ✅ Verification Checklist

Before launching:
- [ ] Firestore database enabled
- [ ] Test mode rules published
- [ ] Can create groups in app
- [ ] Can send messages in app
- [ ] Messages appear in Firestore Console
- [ ] Real-time updates working
- [ ] No console errors
- [ ] Data structure looks correct

---

## 🚀 You're All Set!

Your Firebase Firestore is now configured and ready to use!

**Next steps**:
1. ✅ Run `npm run dev`
2. ✅ Test the app
3. ✅ Check data in Firebase Console
4. ✅ Share with friends!

**Need help?** Check `TESTING_GUIDE.md` for comprehensive testing instructions.
