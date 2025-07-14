import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { LogOut, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"

interface QuickExitButtonProps {
  exitUrl?: string
  className?: string
  variant?: "destructive" | "outline" | "secondary" | "ghost"
  size?: "sm" | "default" | "lg"
  showConfirmation?: boolean
}

export function QuickExitButton({ 
  exitUrl = "https://www.google.com",
  className = "",
  variant = "outline",
  size = "sm",
  showConfirmation = false
}: QuickExitButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [shakeCount, setShakeCount] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    // Set up shake detection for quick exit
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity
      if (!acceleration) return

      const { x, y, z } = acceleration
      const totalAcceleration = Math.sqrt(x! * x! + y! * y! + z! * z!)

      // Detect significant shake (adjust threshold as needed)
      if (totalAcceleration > 25) {
        setShakeCount(prev => {
          const newCount = prev + 1
          
          // If shaken rapidly 3 times, trigger quick exit
          if (newCount >= 3) {
            handleQuickExit()
            return 0
          }
          
          // Reset shake count after 2 seconds of no shaking
          setTimeout(() => setShakeCount(0), 2000)
          
          return newCount
        })
      }
    }

    // Set up keyboard shortcuts
    const handleKeyPress = (event: KeyboardEvent) => {
      // Alt + Q for quick exit
      if (event.altKey && event.key.toLowerCase() === 'q') {
        event.preventDefault()
        if (showConfirmation) {
          setShowDialog(true)
        } else {
          handleQuickExit()
        }
      }
      
      // Triple Escape for emergency exit
      if (event.key === 'Escape') {
        // This would need more sophisticated implementation
        // to detect triple press within a time window
      }
    }

    // Add event listeners
    window.addEventListener('devicemotion', handleDeviceMotion)
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [showConfirmation])

  const handleQuickExit = () => {
    // Clear sensitive data before exiting
    clearSensitiveData()
    
    // Navigate to safe URL
    window.location.replace(exitUrl)
  }

  const clearSensitiveData = () => {
    try {
      // Clear localStorage
      localStorage.clear()
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Clear any form data
      const forms = document.querySelectorAll('form')
      forms.forEach(form => {
        if (form instanceof HTMLFormElement) {
          form.reset()
        }
      })
      
      // Clear any input values
      const inputs = document.querySelectorAll('input, textarea')
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          input.value = ''
        }
      })
      
      // Clear browser history (this has limitations due to security)
      if (history.replaceState) {
        history.replaceState(null, '', exitUrl)
      }
      
    } catch (error) {
      console.error('Error clearing sensitive data:', error)
    }
  }

  const handleButtonClick = () => {
    if (showConfirmation) {
      setShowDialog(true)
    } else {
      handleQuickExit()
    }
  }

  return (
    <>
      <Button
        onClick={handleButtonClick}
        variant={variant}
        size={size}
        className={`${className} gap-2`}
        title="Quick Exit (Alt+Q or shake device)"
      >
        <LogOut className="h-4 w-4" />
        Quick Exit
        <ExternalLink className="h-3 w-3" />
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Quick Exit
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately exit the app and clear all data. You will be redirected to a safe website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleQuickExit}>
              Exit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}