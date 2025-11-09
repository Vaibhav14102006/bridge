"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  adminGetAllOnlineUsers, 
  adminOnAllOnlineUsersChange, 
  getAllGroups,
  getMessages,
  OnlineUser,
  Group 
} from '@/lib/firebase'
import { 
  Users, 
  MessageCircle, 
  Shield, 
  Activity, 
  Clock, 
  Wifi, 
  TrendingUp,
  Eye,
  UserCheck
} from 'lucide-react'

interface AdminOverviewProps {}

interface GroupOnlineData {
  groupName: string
  onlineUsers: OnlineUser[]
}

interface SystemStats {
  totalGroups: number
  totalMessages: number
  totalUniqueUsers: number
  totalOnlineUsers: number
  groupStats: Array<{
    name: string
    messageCount: number
    userCount: number
    onlineCount: number
  }>
}

export default function AdminOverview({}: AdminOverviewProps) {
  const [allOnlineData, setAllOnlineData] = useState<GroupOnlineData[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const loadSystemData = async () => {
      try {
        setLoading(true)
        
        // Load groups
        const groups = await getAllGroups()
        
        // Load online users
        const onlineData = await adminGetAllOnlineUsers()
        setAllOnlineData(onlineData)
        
        // Calculate comprehensive stats
        const stats: SystemStats = {
          totalGroups: groups.length,
          totalMessages: 0,
          totalUniqueUsers: 0,
          totalOnlineUsers: onlineData.reduce((sum, group) => sum + group.onlineUsers.length, 0),
          groupStats: []
        }
        
        const allUsers = new Set<string>()
        
        for (const group of groups) {
          const groupName = group.n
          const messages = await getMessages(groupName)
          const groupUsers = new Set(messages.map(m => m.un || 'User'))
          const onlineGroup = onlineData.find(od => od.groupName === groupName)
          
          // Add to global stats
          stats.totalMessages += messages.length
          messages.forEach(m => {
            if (m.un) allUsers.add(m.un)
          })
          
          stats.groupStats.push({
            name: groupName,
            messageCount: messages.length,
            userCount: groupUsers.size,
            onlineCount: onlineGroup?.onlineUsers.length || 0
          })
        }
        
        stats.totalUniqueUsers = allUsers.size
        setSystemStats(stats)
        setLastUpdated(new Date())
        
        // Set up real-time monitoring for online users
        unsubscribe = adminOnAllOnlineUsersChange((updatedData) => {
          setAllOnlineData(updatedData)
          setSystemStats(prev => prev ? {
            ...prev,
            totalOnlineUsers: updatedData.reduce((sum, group) => sum + group.onlineUsers.length, 0),
            groupStats: prev.groupStats.map(gs => ({
              ...gs,
              onlineCount: updatedData.find(od => od.groupName === gs.name)?.onlineUsers.length || 0
            }))
          } : null)
          setLastUpdated(new Date())
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading system data:', error)
        setLoading(false)
      }
    }

    loadSystemData()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  if (loading || !systemStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const getOnlinePercentage = () => {
    if (systemStats.totalUniqueUsers === 0) return 0
    return Math.round((systemStats.totalOnlineUsers / systemStats.totalUniqueUsers) * 100)
  }

  const getMostActiveGroup = () => {
    return systemStats.groupStats.reduce((prev, current) => 
      (prev.messageCount > current.messageCount) ? prev : current
    )
  }

  const getMostPopularGroup = () => {
    return systemStats.groupStats.reduce((prev, current) => 
      (prev.onlineCount > current.onlineCount) ? prev : current
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Groups</p>
                <p className="text-3xl font-bold gradient-text mt-2">{systemStats.totalGroups}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Messages</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{systemStats.totalMessages.toLocaleString()}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{systemStats.totalUniqueUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Online Now</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-emerald-500">{systemStats.totalOnlineUsers}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getOnlinePercentage()}%
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <Wifi className="h-8 w-8 text-emerald-500" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Most Active Group</span>
              <Badge variant="outline">{getMostActiveGroup().name}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Most Popular Group</span>
              <Badge variant="outline">{getMostPopularGroup().name}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Average Messages/Group</span>
              <Badge variant="outline">
                {Math.round(systemStats.totalMessages / systemStats.totalGroups)}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Online Activity Rate</span>
              <Badge variant={getOnlinePercentage() > 50 ? "default" : "secondary"}>
                {getOnlinePercentage()}% active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Activity
              <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                <Clock className="h-4 w-4" />
                {lastUpdated.toLocaleTimeString()}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allOnlineData
                .filter(group => group.onlineUsers.length > 0)
                .map((group, index) => (
                <div key={group.groupName} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">{group.groupName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {group.onlineUsers.slice(0, 3).map((user, userIndex) => (
                        <Avatar key={userIndex} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {user.un && user.un.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.onlineUsers.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+{group.onlineUsers.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {group.onlineUsers.length}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {allOnlineData.every(group => group.onlineUsers.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">
                  <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No users currently online</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Group Analytics
          </CardTitle>
          <CardDescription>
            Detailed view of each group's activity and online status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm bg-muted/50">
              <div>Group Name</div>
              <div className="text-center">Messages</div>
              <div className="text-center">Total Users</div>
              <div className="text-center">Online Now</div>
            </div>
            {systemStats.groupStats.map((group) => (
              <div key={group.name} className="grid grid-cols-4 gap-4 p-4 border-t">
                <div className="font-medium">{group.name}</div>
                <div className="text-center">{group.messageCount.toLocaleString()}</div>
                <div className="text-center">{group.userCount}</div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span>{group.onlineCount}</span>
                    {group.onlineCount > 0 && (
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}