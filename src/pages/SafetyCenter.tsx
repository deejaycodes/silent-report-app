import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { EnhancedSOSButton } from "@/components/EnhancedSOSButton"
import { EmergencyContacts } from "@/components/EmergencyContacts"
import { SafetyTimer } from "@/components/SafetyTimer"
import { LocationTracker } from "@/components/LocationTracker"
import { QuickExitButton } from "@/components/QuickExitButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Phone, MapPin, AlertTriangle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

export default function SafetyCenter() {
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [locationData, setLocationData] = useState(null)
  const { t } = useTranslation()

  const handleSOSActivated = () => {
    setEmergencyActive(true)
    // Additional emergency protocols could be triggered here
  }

  const handleTimerComplete = () => {
    // Trigger safety check protocol
    setEmergencyActive(true)
  }

  const handleCheckIn = () => {
    setEmergencyActive(false)
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Safety Center</h1>
            <QuickExitButton />
          </div>
          <p className="text-muted-foreground">
            Your personal safety toolkit and emergency features
          </p>
        </div>

        {/* Emergency Status Alert */}
        {emergencyActive && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
              <div>
                <h3 className="font-semibold text-destructive">Emergency Mode Active</h3>
                <p className="text-sm text-muted-foreground">
                  Safety protocols are running. Emergency contacts may be notified.
                </p>
              </div>
              <Badge variant="destructive" className="ml-auto">
                ACTIVE
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Emergency Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <EnhancedSOSButton
                onSOSActivated={handleSOSActivated}
                className="w-full max-w-xs"
                showCountdown={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Safety Features Tabs */}
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timer" className="gap-2">
              <Clock className="h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              <Phone className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Shield className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="mt-6">
            <SafetyTimer
              onTimerComplete={handleTimerComplete}
              onCheckIn={handleCheckIn}
            />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <EmergencyContacts
              onContactsChange={(contacts) => {
                console.log('Emergency contacts updated:', contacts)
              }}
            />
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <LocationTracker
              onLocationUpdate={(location) => {
                setLocationData(location)
                console.log('Location updated:', location)
              }}
              autoTrack={false}
              showMap={true}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Safety Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Quick Exit</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Instantly exit the app and clear data when needed
                    </p>
                    <QuickExitButton 
                      variant="outline" 
                      className="w-full"
                      showConfirmation={true}
                    />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Emergency Protocols</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic safety features and emergency response settings
                    </p>
                    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Auto-location sharing during emergencies
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Emergency contact notification system
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Safety timer check-in reminders
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Emergency Preparedness</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Keep emergency contacts updated</li>
                  <li>• Share location with trusted contacts</li>
                  <li>• Practice using safety features</li>
                  <li>• Keep device charged</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Personal Safety</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Trust your instincts</li>
                  <li>• Stay aware of surroundings</li>
                  <li>• Use safety timer when going out</li>
                  <li>• Have multiple exit strategies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </Layout>
  )
}