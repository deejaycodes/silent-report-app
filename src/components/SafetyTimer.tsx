import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Play, Pause, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

interface SafetyTimerProps {
  onTimerComplete?: () => void
  onCheckIn?: () => void
  autoStart?: boolean
}

export function SafetyTimer({ onTimerComplete, onCheckIn, autoStart = false }: SafetyTimerProps) {
  const [duration, setDuration] = useState(30) // in minutes
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [checkInPrompted, setCheckInPrompted] = useState(false)
  
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    if (autoStart && duration > 0) {
      startTimer()
    }
  }, [autoStart, duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining])

  const startTimer = () => {
    setTimeRemaining(duration * 60) // Convert minutes to seconds
    setIsActive(true)
    setIsComplete(false)
    setCheckInPrompted(false)
    
    toast({
      title: "⏰ Safety Timer Started",
      description: `Timer set for ${duration} minutes`,
      duration: 3000,
    })
  }

  const pauseTimer = () => {
    setIsActive(false)
    toast({
      title: "⏸️ Timer Paused",
      description: "Safety timer has been paused",
      duration: 2000,
    })
  }

  const resumeTimer = () => {
    setIsActive(true)
    toast({
      title: "▶️ Timer Resumed",
      description: "Safety timer is running again",
      duration: 2000,
    })
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeRemaining(0)
    setIsComplete(false)
    setCheckInPrompted(false)
    
    toast({
      title: "🔄 Timer Reset",
      description: "Safety timer has been reset",
      duration: 2000,
    })
  }

  const handleTimerComplete = () => {
    setIsActive(false)
    setIsComplete(true)
    setCheckInPrompted(true)
    
    // Show urgent notification
    toast({
      title: "🚨 Safety Check Required",
      description: "Please check in to confirm you are safe",
      duration: 10000,
    })

    // Browser notification (if permission granted)
    if (Notification.permission === 'granted') {
      new Notification('Safety Timer Expired', {
        body: 'Please check in to confirm you are safe',
        icon: '/favicon.ico',
        requireInteraction: true
      })
    }

    onTimerComplete?.()
  }

  const handleCheckIn = () => {
    setCheckInPrompted(false)
    setIsComplete(false)
    
    toast({
      title: "✅ Check-in Successful",
      description: "Thank you for checking in. Stay safe!",
      duration: 5000,
    })

    onCheckIn?.()
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    if (duration === 0) return 0
    const totalSeconds = duration * 60
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100
  }

  const presetDurations = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Safety Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Check-in Alert */}
        {checkInPrompted && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <h4 className="font-semibold text-destructive">Safety Check Required</h4>
                <p className="text-sm text-muted-foreground">Please confirm you are safe</p>
              </div>
            </div>
            <Button onClick={handleCheckIn} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              I'm Safe - Check In
            </Button>
          </motion.div>
        )}

        {/* Timer Configuration */}
        {!isActive && timeRemaining === 0 && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="duration">Timer Duration</Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {presetDurations.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value.toString()}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="custom-duration">Or set custom duration (minutes)</Label>
              <Input
                id="custom-duration"
                type="number"
                min="1"
                max="1440"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                placeholder="Minutes"
              />
            </div>
          </div>
        )}

        {/* Timer Display */}
        {(isActive || timeRemaining > 0) && (
          <div className="text-center space-y-3">
            <div className="text-4xl font-mono font-bold">
              {formatTime(timeRemaining)}
            </div>
            
            <Progress 
              value={getProgress()} 
              className="h-3"
            />
            
            <div className="text-sm text-muted-foreground">
              {isComplete ? "Timer Complete" : isActive ? "Timer Running" : "Timer Paused"}
            </div>
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex gap-2">
          {!isActive && timeRemaining === 0 ? (
            <Button onClick={startTimer} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          ) : (
            <>
              <Button
                onClick={isActive ? pauseTimer : resumeTimer}
                variant="outline"
                className="flex-1"
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              
              <Button onClick={resetTimer} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Notification Permission */}
        {Notification.permission === 'default' && (
          <Button
            onClick={requestNotificationPermission}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            Enable notifications for timer alerts
          </Button>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <p>The safety timer helps ensure your wellbeing. When it expires, you'll be prompted to check in. If you don't respond, emergency contacts can be notified.</p>
        </div>
      </CardContent>
    </Card>
  )
}