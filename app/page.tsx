'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, X, Search, Save, Trash2 } from 'lucide-react'

// Simulated API calls
const validateApiKey = (apiKey: string) =>
    new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
const startTimeTracking = (activity: string, taskId: string, duration?: number) =>
    new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
const stopTimeTracking = (activity: string) =>
    new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
const saveTimeTracking = (activity: string, taskId: string, duration: number) =>
    new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))

interface ActivityState {
  isTracking: boolean
  duration: number | null
  taskId: string
  elapsedTime: number
  description: string
}

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [activities, setActivities] = useState<Record<string, ActivityState>>({
    work: { isTracking: false, duration: null, taskId: '', elapsedTime: 0, description: '' },
    break: { isTracking: false, duration: null, taskId: '', elapsedTime: 0, description: '' },
    meeting: { isTracking: false, duration: null, taskId: '', elapsedTime: 0, description: '' },
  })
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [newActivityName, setNewActivityName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [jsonConfig, setJsonConfig] = useState('')
  const [isCompactView, setIsCompactView] = useState(false)
  const [defaultTaskId, setDefaultTaskId] = useState('')
  const [isRemoveMode, setIsRemoveMode] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const updated = { ...prev }
        let changed = false
        Object.keys(updated).forEach(activity => {
          if (updated[activity].isTracking) {
            updated[activity].elapsedTime += 1
            changed = true
          }
        })
        return changed ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setJsonConfig(JSON.stringify({ apiKey, defaultTaskId, activities }, null, 2))
  }, [apiKey, defaultTaskId, activities])

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    try {
      const response = await validateApiKey(apiKey)
      if (response.success) {
        setIsApiKeyValid(true)
        toast({
          title: "API Key Validated",
          description: "You can now use the time tracker.",
        })
      } else {
        toast({
          title: "Invalid API Key",
          description: "Please check your API key and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('API key validation failed:', error)
      toast({
        title: "Validation Error",
        description: "An error occurred while validating your API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleStartTracking = useCallback(async (activity: string) => {
    setIsLoading(activity)
    try {
      const { duration, taskId } = activities[activity]
      const effectiveTaskId = taskId || defaultTaskId
      const response = await startTimeTracking(activity, effectiveTaskId, duration || undefined)
      if (response.success) {
        setActivities(prev => ({
          ...prev,
          [activity]: { ...prev[activity], isTracking: true, elapsedTime: 0 }
        }))
        toast({
          title: `${activity} tracking started`,
          description: `Tracking ${activity}${effectiveTaskId ? ` for task ${effectiveTaskId}` : ''}${duration ? ` for ${duration} minutes` : ''}.`,
        })
      }
    } catch (error) {
      console.error(`Failed to start ${activity} tracking:`, error)
      toast({
        title: "Error",
        description: `Failed to start ${activity} tracking. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }, [activities, defaultTaskId])

  const handleStopTracking = useCallback(async (activity: string) => {
    setIsLoading(activity)
    try {
      const response = await stopTimeTracking(activity)
      if (response.success) {
        setActivities(prev => ({
          ...prev,
          [activity]: { ...prev[activity], isTracking: false }
        }))
        toast({
          title: `${activity} tracking stopped`,
          description: `Your ${activity} time tracking has been stopped.`,
        })
      }
    } catch (error) {
      console.error(`Failed to stop ${activity} tracking:`, error)
      toast({
        title: "Error",
        description: `Failed to stop ${activity} tracking. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }, [])

  const handleSaveTime = useCallback(async (activity: string) => {
    setIsLoading(activity)
    try {
      const { duration, taskId } = activities[activity]
      const effectiveTaskId = taskId || defaultTaskId
      if (!duration) {
        throw new Error('Duration is required to save time')
      }
      const response = await saveTimeTracking(activity, effectiveTaskId, duration)
      if (response.success) {
        toast({
          title: `${activity} time saved`,
          description: `Saved ${duration} minutes for ${activity}${effectiveTaskId ? ` (Task: ${effectiveTaskId})` : ''}.`,
        })
      }
    } catch (error) {
      console.error(`Failed to save time for ${activity}:`, error)
      toast({
        title: "Error",
        description: `Failed to save time for ${activity}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }, [activities, defaultTaskId])

  const handleDurationChange = useCallback((activity: string, value: string) => {
    const duration = parseInt(value, 10)
    setActivities(prev => ({
      ...prev,
      [activity]: { ...prev[activity], duration: isNaN(duration) ? null : duration }
    }))
  }, [])

  const handleTaskIdChange = useCallback((activity: string, value: string) => {
    setActivities(prev => ({
      ...prev,
      [activity]: { ...prev[activity], taskId: value }
    }))
  }, [])

  const handleDescriptionChange = useCallback((activity: string, value: string) => {
    setActivities(prev => ({
      ...prev,
      [activity]: { ...prev[activity], description: value }
    }))
  }, [])

  const handleAddActivity = useCallback(() => {
    if (newActivityName && !activities[newActivityName]) {
      setActivities(prev => ({
        ...prev,
        [newActivityName]: { isTracking: false, duration: null, taskId: '', elapsedTime: 0, description: '' }
      }))
      setNewActivityName('')
      toast({
        title: "New activity added",
        description: `${newActivityName} has been added to your tracking list.`,
      })
    } else if (activities[newActivityName]) {
      toast({
        title: "Activity already exists",
        description: "Please choose a different name for your new activity.",
        variant: "destructive",
      })
    }
  }, [newActivityName, activities])

  const handleRemoveActivity = useCallback((activity: string) => {
    if (activities[activity].isTracking) {
      toast({
        title: "Cannot remove active tracking",
        description: "Please stop tracking before removing this activity.",
        variant: "destructive",
      })
      return
    }
    setActivities(prev => {
      const { [activity]: _, ...rest } = prev
      return rest
    })
    toast({
      title: "Activity removed",
      description: `${activity} has been removed from your tracking list.`,
    })
  }, [activities])

  const handleJsonConfigChange = (value: string) => {
    setJsonConfig(value)
    try {
      const parsedConfig = JSON.parse(value)
      setApiKey(parsedConfig.apiKey || '')
      setDefaultTaskId(parsedConfig.defaultTaskId || '')
      setActivities(parsedConfig.activities || {})
      toast({
        title: "Configuration updated",
        description: "The tracker configuration has been updated successfully.",
      })
    } catch (error) {
      console.error('Failed to parse JSON configuration:', error)
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON configuration and try again.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const filteredActivities = Object.entries(activities).filter(([activity]) =>
      activity.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isApiKeyValid) {
    return (
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle>Welcome to Time Tracker</CardTitle>
            <CardDescription>Please enter your API key to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                    id="apiKey"
                    type="text"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isValidating}>
                {isValidating ? 'Validating...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
    )
  }

  return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Custom Activity Time Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activities">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="json">JSON Configuration</TabsTrigger>
            </TabsList>
            <TabsContent value="activities">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <Switch
                        id="compact-view"
                        checked={isCompactView}
                        onCheckedChange={setIsCompactView}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-task-id">Default Task ID</Label>
                  <Input
                      id="default-task-id"
                      type="text"
                      placeholder="Enter default task ID"
                      value={defaultTaskId}
                      onChange={(e) => setDefaultTaskId(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                      onClick={() => setIsRemoveMode(!isRemoveMode)}
                      variant={isRemoveMode ? "destructive" : "outline"}
                  >
                    {isRemoveMode ? "Cancel Remove" : "Remove Activities"}
                  </Button>
                </div>
                {filteredActivities.map(([activity, state]) => (
                    <div key={activity} className={`space-y-2 p-4 bg-secondary rounded-lg ${isCompactView ? 'py-2' : ''}`}>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${activity}-duration`} className="text-base capitalize">{activity}</Label>
                        <div className="space-x-2">
                          {isRemoveMode ? (
                              <Button
                                  onClick={() => handleRemoveActivity(activity)}
                                  variant="destructive"
                                  size="sm"
                                  disabled={state.isTracking}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove activity</span>
                              </Button>
                          ) : (
                              <>
                                <Button
                                    onClick={() => state.isTracking ? handleStopTracking(activity) : handleStartTracking(activity)}
                                    disabled={isLoading !== null}
                                    variant={state.isTracking ? "destructive" : "default"}
                                    size="sm"
                                >
                                  {isLoading === activity ? 'Processing...' : state.isTracking ? 'Stop' : 'Start'}
                                </Button>
                                {state.duration && (
                                    <Button
                                        onClick={() => handleSaveTime(activity)}
                                        disabled={isLoading !== null || state.isTracking}
                                        variant="outline"
                                        size="sm"
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      Save
                                    </Button>
                                )}
                              </>
                          )}
                        </div>
                      </div>
                      {!isCompactView && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Input
                                  id={`${activity}-duration`}
                                  type="number"
                                  placeholder="Duration (minutes)"
                                  value={state.duration || ''}
                                  onChange={(e) => handleDurationChange(activity, e.target.value)}
                                  disabled={state.isTracking}
                              />
                              <Input
                                  id={`${activity}-taskid`}
                                  type="text"
                                  placeholder="Task ID"
                                  value={state.taskId}
                                  onChange={(e) => handleTaskIdChange(activity, e.target.value)}
                                  disabled={state.isTracking}
                              />
                            </div>
                            <Textarea
                                id={`${activity}-description`}
                                placeholder="Activity description"
                                value={state.description}
                                onChange={(e) => handleDescriptionChange(activity, e.target.value)}
                                disabled={state.isTracking}
                                rows={2}
                            />
                          </>
                      )}
                      <div className="text-right">
                        <span className="text-lg font-mono">{formatTime(state.elapsedTime)}</span>
                      </div>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                      type="text"
                      placeholder="New activity name"
                      value={newActivityName}
                      onChange={(e) => setNewActivityName(e.target.value)}
                      className="w-full"
                  />
                  <Button onClick={handleAddActivity} disabled={!newActivityName}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Currently tracking: {Object.entries(activities)
                    .filter(([_, state]) => state.isTracking)
                    .map(([activity, state]) => `${activity}${state.taskId ? ` (Task: ${state.taskId})` : ''} - ${formatTime(state.elapsedTime)}`)
                    .join(', ') || 'None'}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="json">
              <div className="space-y-4">
                <Textarea
                    value={jsonConfig}
                    onChange={(e) => handleJsonConfigChange(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                    placeholder="Enter JSON configuration here"
                />
                <p className="text-sm text-gray-500">
                  Edit the JSON configuration above to update the tracker. Changes will be applied immediately.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  )
}
