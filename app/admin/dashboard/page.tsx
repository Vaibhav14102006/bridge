"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import GroupPasswordChanger from "@/components/group-password-changer"
import CreateGroupForm from "@/components/create-group-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AdminGroupManager from "@/components/admin-group-manager"
import AdminOnlineMonitor from "@/components/admin-online-monitor"
import AdminOverview from "@/components/admin-overview"
import { getAllGroups, getMessages, type Group } from "@/lib/firebase"

interface GroupStats {
  name: string
  messageCount: number
  userCount: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [stats, setStats] = useState<Map<string, GroupStats>>(new Map())
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'online' | 'groups' | 'manage'>('overview')

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
    loadGroups()
  }, [router])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const fetchedGroups = await getAllGroups()
      setGroups(fetchedGroups)

      // Calculate stats for each group
      const statsMap = new Map<string, GroupStats>()
      for (const group of fetchedGroups) {
        const groupName = group.n // Use the shortened field name
        const messages = await getMessages(groupName)
        const users = new Set(messages.map((m) => m.un || 'User')) // Use shortened field name
        statsMap.set(groupName, {
          name: groupName,
          messageCount: messages.length,
          userCount: users.size,
        })
      }
      setStats(statsMap)
    } catch (error) {
      console.error("[Admin] Error loading groups:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGroupCreated = () => {
    setShowCreateForm(false)
    // Refresh groups list from Firestore
    loadGroups()
  }

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    router.push("/admin")
  }

  const totalStats = Array.from(stats.values()).reduce(
    (acc, group) => ({
      totalGroups: acc.totalGroups + 1,
      totalMessages: acc.totalMessages + group.messageCount,
      totalUsers: acc.totalUsers + group.userCount,
    }),
    { totalGroups: 0, totalMessages: 0, totalUsers: 0 },
  )

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Full control over groups and messages</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'online'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Online Users
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'groups'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Group Settings
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'manage'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Message Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <AdminOverview />
        )}

        {activeTab === 'online' && (
          <div>
            <AdminOnlineMonitor />
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Group Settings</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-accent text-white hover:shadow-lg transition-all text-sm font-medium"
              >
                {showCreateForm ? "Cancel" : "Create Group"}
              </button>
            </div>

            {showCreateForm && <CreateGroupForm onGroupCreated={handleGroupCreated} />}

            <div className="grid gap-6">
              {groups.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-lg">No groups created yet</p>
                  <p className="text-muted-foreground text-sm mt-2">Click "Create Group" to get started!</p>
                </div>
              ) : (
                groups.map((group) => <GroupPasswordChanger key={group.id} groupName={group.n} />)
              )}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            <AdminGroupManager />
          </div>
        )}
      </div>
    </main>
  )
}
