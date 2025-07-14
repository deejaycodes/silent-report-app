import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Phone, MessageSquare, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

interface EnhancedSOSButtonProps {
  className?: string
  showCountdown?: boolean
  onSOSActivated?: () => void
}

export function EnhancedSOSButton({ className, showCountdown = true, onSOSActivated }: EnhancedSOSButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isActivating, setIsActivating] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleConfirmSOS()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown])

  const handleSOSPress = () => {
    if (showCountdown) {
      setCountdown(5)
      setIsActivating(true)
    } else {
      setShowConfirmation(true)
    }
  }

  const handleConfirmSOS = () => {
    setShowConfirmation(false)
    setCountdown(0)
    setIsActivating(false)
    
    // Simulate SOS activation
    toast({
      title: "🚨 Emergency Alert Sent",
      description: "Emergency services have been notified. Help is on the way.",
      duration: 8000,
    })

    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        toast({
          title: "📍 Location Shared",
          description: `Coordinates: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          duration: 6000,
        })
      })
    }

    onSOSActivated?.()
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setCountdown(0)
    setIsActivating(false)
  }

  return (
    <>
      <motion.div
        animate={isActivating ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: isActivating ? Infinity : 0, duration: 1.5 }}
        className="w-full"
      >
        <Button
          variant="destructive"
          size="sos"
          className={`${className} relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sos transition-all duration-300 ${isActivating ? 'animate-pulse-safe' : ''}`}
          onClick={handleSOSPress}
          disabled={countdown > 0}
        >
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">
                {countdown > 0 ? `${countdown}` : 'SOS'}
              </div>
              {countdown > 0 && (
                <div className="text-xs sm:text-sm opacity-90">Activating...</div>
              )}
            </div>
          </div>
          
          {countdown > 0 && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress 
                value={(6 - countdown) * 20} 
                className="h-2 bg-red-800 rounded-none"
              />
            </div>
          )}
        </Button>
      </motion.div>

      {countdown > 0 && (
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="mt-4 w-full"
        >
          Cancel SOS
        </Button>
      )}

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Emergency Alert
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>You are about to send an emergency alert. This will:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  Contact emergency services
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Share your current location
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-red-500" />
                  Send pre-written emergency message
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  Start safety timer
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSOS}
              className="bg-red-600 hover:bg-red-700"
            >
              Send Emergency Alert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}