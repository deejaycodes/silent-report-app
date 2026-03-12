import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, Phone, AlertCircle, Eye, EyeOff, Calculator } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function SafetyCenter() {
  const navigate = useNavigate()
  const [showFakeScreen, setShowFakeScreen] = useState(false)
  const [emergencyActive, setEmergencyActive] = useState(false)

  const handleSOS = () => {
    setEmergencyActive(true)
    // Navigate to chat for immediate help
    navigate("/chat")
  }

  if (showFakeScreen) {
    return (
      <div className="min-h-screen bg-white p-4" onClick={() => setShowFakeScreen(false)}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Calculator className="h-8 w-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-700">Calculator</h1>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-right">
            <div className="text-4xl font-mono text-gray-800">0</div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
              <button key={btn} className="bg-gray-200 p-6 rounded-lg text-xl font-semibold text-gray-700">
                {btn}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">Tap anywhere to return to SafeVoice</p>
        </div>
      </div>
    )
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Shield className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Safety Center</h1>
          <p className="text-muted-foreground">
            Quick safety tools and emergency help
          </p>
        </div>

        {/* Emergency Status */}
        {emergencyActive && (
          <Card className="border-2 border-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-red-800">Emergency Mode Active</h3>
                  <p className="text-sm text-red-600">Connecting you to help...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SOS Button */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-center text-red-800">Emergency Help</CardTitle>
            <CardDescription className="text-center">
              Press if you need immediate help right now
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button
              variant="destructive"
              size="lg"
              className="h-32 w-32 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform"
              onClick={handleSOS}
            >
              <div className="flex flex-col items-center gap-2">
                <Phone className="h-12 w-12" />
                <span>SOS</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Exit */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Exit</CardTitle>
            <CardDescription>
              Hide this app quickly if someone comes near
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFakeScreen(true)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Show Fake Calculator Screen
            </Button>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Looks like a normal calculator app</span>
              </p>
              <p className="flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                <span>Tap anywhere to return to SafeVoice</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <p className="font-medium">Clear your browser history</p>
                <p className="text-muted-foreground">After using this app on a browser</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <p className="font-medium">Use a safe device</p>
                <p className="text-muted-foreground">Don't use a device your abuser can access</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🚪</div>
              <div>
                <p className="font-medium">Have an exit plan</p>
                <p className="text-muted-foreground">Know where you can go if you need to leave quickly</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">👥</div>
              <div>
                <p className="font-medium">Tell someone you trust</p>
                <p className="text-muted-foreground">Let a friend or family member know you need help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Hotlines</CardTitle>
            <CardDescription>Call these numbers if you're in immediate danger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="tel:112" className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80">
              <div>
                <p className="font-medium">Emergency Services</p>
                <p className="text-sm text-muted-foreground">Police, Ambulance, Fire</p>
              </div>
              <span className="text-xl font-bold">112</span>
            </a>
            <a href="tel:199" className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80">
              <div>
                <p className="font-medium">Police Emergency</p>
                <p className="text-sm text-muted-foreground">Nigeria Police Force</p>
              </div>
              <span className="text-xl font-bold">199</span>
            </a>
            <a href="tel:08000333333" className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80">
              <div>
                <p className="font-medium">NAPTIP Hotline</p>
                <p className="text-sm text-muted-foreground">Human Trafficking & GBV</p>
              </div>
              <span className="text-lg font-bold">0800-033-3333</span>
            </a>
          </CardContent>
        </Card>

      </div>
      
      <Navigation />
    </Layout>
  )
}
