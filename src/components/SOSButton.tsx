import { useState } from "react"
import { AlertTriangle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface SOSButtonProps {
  className?: string
}

export function SOSButton({ className }: SOSButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()

  const handleSOSPress = () => {
    setShowConfirmation(true)
  }

  const handleConfirmSOS = () => {
    // In a real app, this would:
    // 1. Get user's location
    // 2. Send alert to emergency contacts
    // 3. Contact emergency services
    
    toast({
      title: "SOS Alert Sent",
      description: "Emergency services and your contacts have been notified. Help is on the way.",
      variant: "default",
    })
    
    setShowConfirmation(false)
  }

  return (
    <>
      <div className={className}>
        <Button
          variant="sos"
          size="sos"
          onClick={handleSOSPress}
          className="mx-auto block animate-pulse-safe"
        >
          <AlertTriangle className="h-8 w-8" />
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-2 font-medium">
          Emergency SOS
        </p>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Phone className="h-5 w-5" />
              Emergency SOS
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately alert emergency services and your emergency contacts with your current location. 
              
              Are you sure you want to send an SOS alert?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSOS}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Send SOS Alert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}