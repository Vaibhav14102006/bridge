"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { checkRateLimit, clearRateLimit } from "@/lib/security"

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!checkRateLimit("admin_login", 5, 900000)) {
        // Silent redirect to calculator on rate limit
        router.push("/calculator")
        return
      }

      const adminPassword = "ominpotentcmdvaibhav"
      if (password === adminPassword) {
        clearRateLimit("admin_login")
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            token: `admin_${Date.now()}`,
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/admin/dashboard")
      } else {
        // Silent redirect to calculator on wrong password
        router.push("/calculator")
      }
    } catch (err) {
      // Silent redirect to calculator on any error
      router.push("/calculator")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 rounded-3xl shadow-2xl mb-4">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Secure Access Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input Card */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-pink-200 dark:border-purple-800">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
              🔐 Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900 border-2 border-pink-200 dark:border-purple-700 focus:border-pink-500 dark:focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-purple-800 transition-all text-gray-800 dark:text-white font-medium text-lg placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 text-white font-bold text-lg shadow-2xl hover:shadow-pink-300 dark:hover:shadow-purple-800 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              "🚀 Enter Admin Panel"
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl border border-pink-200 dark:border-purple-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            💡 <strong>Secure Admin Access</strong>{" "}
            <code className="bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-900 dark:to-purple-900 px-3 py-1 rounded-lg text-pink-700 dark:text-pink-300 font-mono font-bold">
              Protected Portal
            </code>
          </p>
        </div>
      </div>
    </main>
  )
}
