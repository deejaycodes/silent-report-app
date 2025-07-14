import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, AlertCircle, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
  address?: string
}

interface LocationTrackerProps {
  onLocationUpdate?: (location: LocationData) => void
  autoTrack?: boolean
  showMap?: boolean
}

export function LocationTracker({ onLocationUpdate, autoTrack = false, showMap = false }: LocationTrackerProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    if (autoTrack) {
      startTracking()
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [autoTrack])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setIsTracking(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        }
        
        setLocation(locationData)
        setIsTracking(false)
        onLocationUpdate?.(locationData)
        
        // Try to get address from coordinates
        reverseGeocode(locationData)
        
        toast({
          title: "📍 Location Updated",
          description: `Accuracy: ±${Math.round(position.coords.accuracy)}m`,
          duration: 3000,
        })
      },
      (error) => {
        setIsTracking(false)
        let errorMessage = "Unable to get location"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        
        setError(errorMessage)
        toast({
          title: "⚠️ Location Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        }
        
        setLocation(locationData)
        onLocationUpdate?.(locationData)
      },
      (error) => {
        console.error("Location tracking error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    )

    setWatchId(id)
    setIsTracking(true)
  }

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
  }

  const reverseGeocode = async (locationData: LocationData) => {
    try {
      // This would normally use a geocoding service
      // For demo purposes, we'll just show coordinates
      const address = `${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`
      setLocation(prev => prev ? { ...prev, address } : null)
    } catch (error) {
      console.error("Reverse geocoding error:", error)
    }
  }

  const shareLocation = () => {
    if (!location) return

    const locationText = `My current location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
    
    if (navigator.share) {
      navigator.share({
        title: "My Location",
        text: locationText,
      })
    } else {
      navigator.clipboard.writeText(locationText)
      toast({
        title: "📋 Location Copied",
        description: "Location link copied to clipboard",
        duration: 3000,
      })
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={getCurrentLocation}
            disabled={isTracking}
            variant="outline"
            size="sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isTracking ? "Getting Location..." : "Get Current Location"}
          </Button>
          
          {location && (
            <Button
              onClick={shareLocation}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {location && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Latitude:</span>
                <div className="font-mono">{location.latitude.toFixed(6)}</div>
              </div>
              <div>
                <span className="font-medium">Longitude:</span>
                <div className="font-mono">{location.longitude.toFixed(6)}</div>
              </div>
            </div>
            
            <div>
              <span className="font-medium">Accuracy:</span>
              <span className="ml-1">±{Math.round(location.accuracy)}m</span>
            </div>
            
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-1">{formatTime(location.timestamp)}</span>
            </div>

            {location.address && (
              <div>
                <span className="font-medium">Address:</span>
                <div className="text-muted-foreground">{location.address}</div>
              </div>
            )}
          </div>
        )}

        {showMap && location && (
          <div className="mt-4">
            <Button
              onClick={() => {
                const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
                window.open(url, '_blank')
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              View on Map
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}