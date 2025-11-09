"use client"

import { useState } from "react"
import { createGroup, getAllGroups, getGroupPassword } from "@/lib/firebase"

export default function FirestoreTestPage() {
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testFirestore = async () => {
    setLoading(true)
    setTestResult("Testing Firestore connection...\n\n")
    
    try {
      // Test 1: Create a test group
      setTestResult(prev => prev + "✓ Test 1: Creating test group...\n")
      const testGroupName = `test-group-${Date.now()}`
      const testPassword = "test123hash"
      await createGroup(testGroupName, testPassword)
      setTestResult(prev => prev + `✓ Test 1 PASSED: Group "${testGroupName}" created\n\n`)
      
      // Test 2: Verify group was created
      setTestResult(prev => prev + "✓ Test 2: Verifying group password...\n")
      const password = await getGroupPassword(testGroupName)
      if (password === testPassword) {
        setTestResult(prev => prev + "✓ Test 2 PASSED: Password verified\n\n")
      } else {
        setTestResult(prev => prev + `✗ Test 2 FAILED: Password mismatch (expected: ${testPassword}, got: ${password})\n\n`)
      }
      
      // Test 3: Get all groups
      setTestResult(prev => prev + "✓ Test 3: Fetching all groups...\n")
      const groups = await getAllGroups()
      setTestResult(prev => prev + `✓ Test 3 PASSED: Found ${groups.length} groups\n`)
      groups.forEach(group => {
        setTestResult(prev => prev + `  - ${group.n || group.id} (created: ${new Date(group.ca || Date.now()).toLocaleString()})\n`)
      })
      
      setTestResult(prev => prev + "\n✅ ALL TESTS PASSED! Firestore is working correctly.\n")
    } catch (error: any) {
      setTestResult(prev => prev + `\n❌ ERROR: ${error.message}\n${error.stack}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 shadow-md mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Firestore Connection Test</h1>
          <p className="text-muted-foreground mb-4">
            This page tests your Firebase Firestore connection and basic operations.
          </p>
          
          <button
            onClick={testFirestore}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "Running Tests..." : "Run Firestore Tests"}
          </button>
        </div>

        {testResult && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold text-foreground mb-3">Test Results:</h2>
            <pre className="bg-muted/20 p-4 rounded text-sm text-foreground overflow-auto whitespace-pre-wrap font-mono">
              {testResult}
            </pre>
          </div>
        )}

        <div className="mt-6 bg-card border border-border rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-3">Firebase Configuration:</h2>
          <div className="bg-muted/20 p-4 rounded text-sm text-foreground">
            <p><strong>Project ID:</strong> bridge-cad2c</p>
            <p><strong>Auth Domain:</strong> bridge-cad2c.firebaseapp.com</p>
            <p><strong>Status:</strong> <span className="text-primary font-semibold">Connected</span></p>
          </div>
        </div>

        <div className="mt-6">
          <a 
            href="/admin" 
            className="text-primary hover:text-accent underline"
          >
            ← Back to Admin Login
          </a>
        </div>
      </div>
    </div>
  )
}
