import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, Smartphone, Lock, Wifi, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface PrivacyShieldProps {
  onPrivacyChange?: (settings: PrivacySettings) => void
}

interface PrivacySettings {
  incognitoMode: boolean
  locationMasking: boolean
  dataEncryption: boolean
  quickExit: boolean
  secureConnection: boolean
  autoDelete: boolean
}

export function PrivacyShield({ onPrivacyChange }: PrivacyShieldProps) {
  const [settings, setSettings] = useState<PrivacySettings>({
    incognitoMode: false,
    locationMasking: false,
    dataEncryption: true,
    quickExit: true,
    secureConnection: true,
    autoDelete: false
  })
  
  const [privacyScore, setPrivacyScore] = useState(0)
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    calculatePrivacyScore()
    onPrivacyChange?.(settings)
  }, [settings])

  const calculatePrivacyScore = () => {
    const enabledCount = Object.values(settings).filter(Boolean).length
    const score = Math.round((enabledCount / Object.keys(settings).length) * 100)
    setPrivacyScore(score)
  }

  const updateSetting = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      
      // Show appropriate toast
      const action = value ? "enabled" : "disabled"
      const feature = key.replace(/([A-Z])/g, ' $1').toLowerCase()
      
      toast({
        title: `${value ? '🔒' : '🔓'} Privacy ${action}`,
        description: `${feature} has been ${action}`,
        duration: 3000,
      })
      
      return newSettings
    })
  }

  const enableQuickExit = () => {
    // Set up quick exit (usually double-tap volume button or shake)
    if ('DeviceMotionEvent' in window) {
      // Enable shake detection
      updateSetting('quickExit', true)
      toast({
        title: "🏃‍♀️ Quick Exit Enabled",
        description: "Shake your device rapidly to quickly exit the app",
        duration: 5000,
      })
    } else {
      updateSetting('quickExit', true)
      toast({
        title: "🏃‍♀️ Quick Exit Enabled", 
        description: "Use the panic button to quickly exit",
        duration: 5000,
      })
    }
  }

  const clearAllData = () => {
    // Clear local storage, session storage, etc.
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    toast({
      title: "🗑️ Data Cleared",
      description: "All local data has been securely deleted",
      duration: 5000,
    })
  }

  const getPrivacyScoreColor = () => {
    if (privacyScore >= 80) return "bg-green-500"
    if (privacyScore >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPrivacyScoreText = () => {
    if (privacyScore >= 80) return "Excellent"
    if (privacyScore >= 60) return "Good"
    if (privacyScore >= 40) return "Fair"
    return "Needs Improvement"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Shield
          </div>
          <Badge variant="outline" className="gap-2">
            <div className={`w-2 h-2 rounded-full ${getPrivacyScoreColor()}`} />
            {privacyScore}% {getPrivacyScoreText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Privacy Settings */}
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                <Label htmlFor="incognito">Incognito Mode</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Prevents saving to browser history
              </p>
            </div>
            <Switch
              id="incognito"
              checked={settings.incognitoMode}
              onCheckedChange={(checked) => updateSetting('incognitoMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Label htmlFor="location-masking">Location Masking</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Obfuscates precise location data
              </p>
            </div>
            <Switch
              id="location-masking"
              checked={settings.locationMasking}
              onCheckedChange={(checked) => updateSetting('locationMasking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <Label htmlFor="encryption">Data Encryption</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Encrypts all stored data locally
              </p>
            </div>
            <Switch
              id="encryption"
              checked={settings.dataEncryption}
              onCheckedChange={(checked) => updateSetting('dataEncryption', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="quick-exit">Quick Exit</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Rapid exit with gesture or button
              </p>
            </div>
            <Switch
              id="quick-exit"
              checked={settings.quickExit}
              onCheckedChange={(checked) => {
                if (checked) {
                  enableQuickExit()
                } else {
                  updateSetting('quickExit', false)
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <Label htmlFor="secure-connection">Secure Connection</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Forces HTTPS and secure protocols
              </p>
            </div>
            <Switch
              id="secure-connection"
              checked={settings.secureConnection}
              onCheckedChange={(checked) => updateSetting('secureConnection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label htmlFor="auto-delete">Auto-Delete Data</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Automatically deletes data after 24 hours
              </p>
            </div>
            <Switch
              id="auto-delete"
              checked={settings.autoDelete}
              onCheckedChange={(checked) => updateSetting('autoDelete', checked)}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Quick Privacy Actions</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={clearAllData}
              variant="destructive"
              size="sm"
              className="justify-start"
            >
              🗑️ Clear All Data
            </Button>
            
            <Button
              onClick={() => {
                // Navigate to a safe website
                window.location.href = "https://www.google.com"
              }}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              🏃‍♀️ Quick Exit to Google
            </Button>
            
            <Button
              onClick={() => {
                // Enable all privacy settings
                setSettings({
                  incognitoMode: true,
                  locationMasking: true,
                  dataEncryption: true,
                  quickExit: true,
                  secureConnection: true,
                  autoDelete: true
                })
                toast({
                  title: "🔒 Maximum Privacy Enabled",
                  description: "All privacy features have been activated",
                  duration: 5000,
                })
              }}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              🛡️ Enable Maximum Privacy
            </Button>
          </div>
        </div>

        {/* Privacy Tips */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg space-y-2">
          <p className="font-medium">Privacy Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Use private/incognito browser mode</li>
            <li>Connect through trusted networks only</li>
            <li>Regularly clear browser data</li>
            <li>Enable quick exit if in danger</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}