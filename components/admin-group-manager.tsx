"use client"

import { useState, useEffect } from "react"
import { adminGetAllGroupsWithMessages, adminDeleteMessage, adminDeleteGroup, adminBulkDeleteMessages, type MediaMessage } from "@/lib/firebase"
import { Trash2, Eye, Users, MessageSquare, AlertTriangle, Search, CheckSquare, Square, Trash, Database } from "lucide-react"
import DatabaseVerifier from "./database-verifier"

interface GroupWithMessages {
  groupName: string
  messages: (MediaMessage & { id: string })[]
}

export default function AdminGroupManager() {
  const [groups, setGroups] = useState<GroupWithMessages[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'message' | 'group' | 'bulk'
    id?: string
    groupName: string
    count?: number
  } | null>(null)

  useEffect(() => {
    loadAllGroups()
  }, [])

  const loadAllGroups = async () => {
    try {
      setLoading(true)
      const allGroups = await adminGetAllGroupsWithMessages()
      setGroups(allGroups)
    } catch (error) {
      console.error("Error loading groups:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (groupName: string, messageId: string) => {
    try {
      console.log("[Admin UI] Deleting message from Firestore:", messageId)
      await adminDeleteMessage(groupName, messageId)
      console.log("[Admin UI] Message successfully deleted from database")
      await loadAllGroups() // Refresh data to confirm deletion
      setShowDeleteConfirm(null)
      alert("Message successfully deleted from Firestore database!")
    } catch (error) {
      console.error("Error deleting message from Firestore:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to delete message from database: ${errorMessage}`)
    }
  }

  const handleBulkDeleteMessages = async (groupName: string, messageIds: string[]) => {
    try {
      console.log("[Admin UI] Bulk deleting messages from Firestore:", messageIds.length)
      await adminBulkDeleteMessages(groupName, messageIds)
      console.log("[Admin UI] Messages successfully bulk deleted from database")
      await loadAllGroups() // Refresh data to confirm deletions
      setSelectedMessages(new Set())
      setBulkDeleteMode(false)
      setShowDeleteConfirm(null)
      alert(`${messageIds.length} messages successfully deleted from Firestore database!`)
    } catch (error) {
      console.error("Error bulk deleting messages from Firestore:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to bulk delete messages from database: ${errorMessage}`)
    }
  }

  const handleDeleteGroup = async (groupName: string) => {
    try {
      await adminDeleteGroup(groupName)
      await loadAllGroups() // Refresh data
      setShowDeleteConfirm(null)
      setSelectedGroup(null)
      setSelectedMessages(new Set())
      setBulkDeleteMode(false)
    } catch (error) {
      console.error("Error deleting group:", error)
      alert("Failed to delete group")
    }
  }

  const toggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages)
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId)
    } else {
      newSelected.add(messageId)
    }
    setSelectedMessages(newSelected)
  }

  const selectAllMessages = () => {
    if (selectedGroupData) {
      const allMessageIds = new Set(selectedGroupData.messages.map(m => m.id))
      setSelectedMessages(allMessageIds)
    }
  }

  const clearSelection = () => {
    setSelectedMessages(new Set())
    setBulkDeleteMode(false)
  }

  const filteredGroups = groups.filter(group =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.messages.some(msg => 
      (msg.c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.un || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const selectedGroupData = groups.find(g => g.groupName === selectedGroup)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading groups...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Group Management
        </h2>
        <div className="flex items-center gap-4">
          {bulkDeleteMode && selectedMessages.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
              <CheckSquare className="w-4 h-4" />
              {selectedMessages.size} selected
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups or messages..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
          <button
            onClick={loadAllGroups}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Groups ({filteredGroups.length})
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredGroups.map((group) => (
              <div
                key={group.groupName}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedGroup === group.groupName
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedGroup(group.groupName)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {group.groupName}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm({
                        type: 'group',
                        id: group.groupName,
                        groupName: group.groupName
                      })
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    title="Delete entire group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {group.messages.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {new Set(group.messages.map(m => m.un || 'Unknown')).size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages View */}
        <div className="lg:col-span-2">
          {selectedGroupData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Messages in "{selectedGroupData.groupName}"
                </h3>
                <div className="flex items-center gap-3">
                  <DatabaseVerifier 
                    groupName={selectedGroupData.groupName}
                    onMessageCountChange={(count) => console.log(`Database verified: ${count} messages`)}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedGroupData.messages.length} messages
                  </span>
                  {selectedGroupData.messages.length > 0 && (
                    <div className="flex items-center gap-2">
                      {!bulkDeleteMode ? (
                        <button
                          onClick={() => setBulkDeleteMode(true)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Select Multiple
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={selectAllMessages}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Select All
                          </button>
                          <button
                            onClick={clearSelection}
                            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          {selectedMessages.size > 0 && (
                            <button
                              onClick={() => setShowDeleteConfirm({
                                type: 'bulk',
                                groupName: selectedGroupData.groupName,
                                count: selectedMessages.size
                              })}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                            >
                              <Trash className="w-3 h-3" />
                              Delete ({selectedMessages.size})
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                {selectedGroupData.messages.length > 0 ? (
                  selectedGroupData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 p-3 rounded-lg group transition-colors ${
                        selectedMessages.has(message.id)
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {bulkDeleteMode && (
                        <button
                          onClick={() => toggleMessageSelection(message.id)}
                          className="mt-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {selectedMessages.has(message.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {message.un || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(message.ts || 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {message.c || '[No content]'}
                        </p>
                        {(message.rb && message.rb.length > 0) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Read by {message.rb.length} users
                          </p>
                        )}
                      </div>
                      
                      {!bulkDeleteMode && (
                        <button
                          onClick={() => setShowDeleteConfirm({
                            type: 'message',
                            id: message.id,
                            groupName: selectedGroupData.groupName
                          })}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded transition-opacity"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No messages in this group
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a group to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Confirm Deletion
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {showDeleteConfirm.type === 'group' 
                ? `Are you sure you want to delete the entire group "${showDeleteConfirm.groupName}" and all its messages? This action cannot be undone.`
                : showDeleteConfirm.type === 'bulk'
                ? `Are you sure you want to delete ${showDeleteConfirm.count} selected messages? This action cannot be undone and will remove them from the entire database.`
                : `Are you sure you want to delete this message? This action cannot be undone and will remove it from the entire database.`
              }
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'group') {
                    handleDeleteGroup(showDeleteConfirm.groupName)
                  } else if (showDeleteConfirm.type === 'bulk') {
                    handleBulkDeleteMessages(showDeleteConfirm.groupName, Array.from(selectedMessages))
                  } else if (showDeleteConfirm.id) {
                    handleDeleteMessage(showDeleteConfirm.groupName, showDeleteConfirm.id)
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete {showDeleteConfirm.type === 'group' ? 'Group' : showDeleteConfirm.type === 'bulk' ? `${showDeleteConfirm.count} Messages` : 'Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}