"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Alert, AlertDescription } from './ui/alert'
import { 
  adminGetAllOnlineUsers, 
  adminOnAllOnlineUsersChange, 
  adminForceUserOffline,
  OnlineUser 
} from '@/lib/firebase'
import { UserX, Users, Clock, Wifi, WifiOff, RefreshCw } from 'lucide-react'

interface AdminOnlineMonitorProps {}

interface GroupOnlineData {
  groupName: string
  onlineUsers: OnlineUser[]
}

export default function AdminOnlineMonitor({}: AdminOnlineMonitorProps) {
  const [allOnlineData, setAllOnlineData] = useState<GroupOnlineData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const setupMonitoring = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Initial load
        const initialData = await adminGetAllOnlineUsers()
        setAllOnlineData(initialData)
        setLastUpdated(new Date())
        
        // Set up real-time monitoring
        unsubscribe = adminOnAllOnlineUsersChange((updatedData) => {
          setAllOnlineData(updatedData)
          setLastUpdated(new Date())
        })
        
        setLoading(false)
      } catch (err) {
        console.error('Error setting up online monitoring:', err)
        setError('Failed to load online user data')
        setLoading(false)
      }
    }

    setupMonitoring()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const handleForceOffline = async (groupName: string, userId: string, userName: string) => {
    try {
      setActionLoading(`${groupName}-${userId}`)
      await adminForceUserOffline(groupName, userId)
      setError(null)
      
      // Show success message
      setTimeout(() => {
        setActionLoading(null)
      }, 1000)
      
    } catch (err) {
      console.error('Error forcing user offline:', err)
      setError(`Failed to force ${userName} offline`)
      setActionLoading(null)
    }
  }

  const refreshData = async () => {
    try {
      setLoading(true)
      const data = await adminGetAllOnlineUsers()
      setAllOnlineData(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  const getTotalOnlineUsers = () => {
    return allOnlineData.reduce((total, group) => total + group.onlineUsers.length, 0)
  }

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Online Users Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading online users...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Users Monitor
              <Badge variant="secondary" className="ml-2">
                {getTotalOnlineUsers()} online
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of all online users across groups
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lastUpdated.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {getTotalOnlineUsers() === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <WifiOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No users are currently online</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {allOnlineData.map((groupData) => (
                <div key={groupData.groupName}>
                  {groupData.onlineUsers.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-semibold">{groupData.groupName}</h3>
                        <Badge variant="outline">
                          {groupData.onlineUsers.length} online
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 ml-4">
                        {groupData.onlineUsers.map((user) => (
                          <div
                            key={user.uid}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {user.un && user.un.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{user.un}</span>
                                  <Wifi className="h-4 w-4 text-green-500" />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Last active: {formatLastSeen(user.la)}
                                </div>
                              </div>
                            </div>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  disabled={actionLoading === `${groupData.groupName}-${user.uid}`}
                                >
                                  {actionLoading === `${groupData.groupName}-${user.uid}` ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserX className="h-4 w-4" />
                                  )}
                                  Force Offline
                                </Button>
                              </AlertDialogTrigger>
                              
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Force User Offline</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to force <strong>{user.un}</strong> offline from <strong>{groupData.groupName}</strong>?
                                    <br />
                                    This will immediately disconnect them from the group.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleForceOffline(groupData.groupName, user.uid, user.un)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Force Offline
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="mt-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}