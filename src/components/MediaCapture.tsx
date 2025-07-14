import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, Mic, Image, FileText, X, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import Webcam from "react-webcam"

interface MediaFile {
  id: string
  type: 'photo' | 'video' | 'audio' | 'document'
  url: string
  name: string
  size: number
  timestamp: number
  metadata?: any
}

interface MediaCaptureProps {
  onMediaCapture?: (media: MediaFile) => void
  allowedTypes?: ('photo' | 'video' | 'audio' | 'document')[]
  maxFileSize?: number // in MB
}

export function MediaCapture({ 
  onMediaCapture, 
  allowedTypes = ['photo', 'video', 'audio', 'document'],
  maxFileSize = 50
}: MediaCaptureProps) {
  const [capturedMedia, setCapturedMedia] = useState<MediaFile[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { toast } = useToast()
  const { t } = useTranslation()

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    const mediaFile: MediaFile = {
      id: generateId(),
      type: 'photo',
      url: imageSrc,
      name: `photo_${Date.now()}.jpg`,
      size: Math.round(imageSrc.length * 0.75), // Rough estimate
      timestamp: Date.now(),
      metadata: {
        captured: true,
        device: 'camera'
      }
    }

    setCapturedMedia(prev => [...prev, mediaFile])
    onMediaCapture?.(mediaFile)
    setShowCamera(false)

    toast({
      title: "📸 Photo Captured",
      description: "Photo saved securely",
      duration: 3000,
    })
  }, [onMediaCapture])

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        
        const mediaFile: MediaFile = {
          id: generateId(),
          type: 'video',
          url,
          name: `video_${Date.now()}.webm`,
          size: blob.size,
          timestamp: Date.now(),
          metadata: {
            duration: recordingTime,
            format: 'webm'
          }
        }

        setCapturedMedia(prev => [...prev, mediaFile])
        onMediaCapture?.(mediaFile)
        
        stream.getTracks().forEach(track => track.stop())
        
        toast({
          title: "🎥 Video Recorded",
          description: `Duration: ${recordingTime}s`,
          duration: 3000,
        })
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      toast({
        title: "⚠️ Recording Error",
        description: "Unable to access camera/microphone",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        
        const mediaFile: MediaFile = {
          id: generateId(),
          type: 'audio',
          url,
          name: `audio_${Date.now()}.webm`,
          size: blob.size,
          timestamp: Date.now(),
          metadata: {
            duration: recordingTime,
            format: 'webm'
          }
        }

        setCapturedMedia(prev => [...prev, mediaFile])
        onMediaCapture?.(mediaFile)
        
        stream.getTracks().forEach(track => track.stop())
        
        toast({
          title: "🎤 Audio Recorded",
          description: `Duration: ${recordingTime}s`,
          duration: 3000,
        })
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      toast({
        title: "⚠️ Recording Error",
        description: "Unable to access microphone",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: "⚠️ File Too Large",
          description: `File must be smaller than ${maxFileSize}MB`,
          variant: "destructive",
          duration: 5000,
        })
        return
      }

      const url = URL.createObjectURL(file)
      const mediaFile: MediaFile = {
        id: generateId(),
        type: 'document',
        url,
        name: file.name,
        size: file.size,
        timestamp: Date.now(),
        metadata: {
          originalFile: file,
          mimeType: file.type
        }
      }

      setCapturedMedia(prev => [...prev, mediaFile])
      onMediaCapture?.(mediaFile)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeMedia = (id: string) => {
    setCapturedMedia(prev => {
      const updated = prev.filter(media => media.id !== id)
      return updated
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Evidence Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Capture Controls */}
        <div className="grid grid-cols-2 gap-2">
          {allowedTypes.includes('photo') && (
            <Button
              onClick={() => setShowCamera(true)}
              variant="outline"
              size="sm"
              disabled={isRecording}
            >
              <Camera className="h-4 w-4 mr-2" />
              Photo
            </Button>
          )}
          
          {allowedTypes.includes('video') && (
            <Button
              onClick={isRecording ? stopVideoRecording : startVideoRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
            >
              <Video className="h-4 w-4 mr-2" />
              {isRecording ? `Stop (${formatTime(recordingTime)})` : 'Video'}
            </Button>
          )}
          
          {allowedTypes.includes('audio') && (
            <Button
              onClick={isRecording ? stopVideoRecording : startAudioRecording}
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
            >
              <Mic className="h-4 w-4 mr-2" />
              {isRecording ? `Stop (${formatTime(recordingTime)})` : 'Audio'}
            </Button>
          )}
          
          {allowedTypes.includes('document') && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                disabled={isRecording}
              >
                <FileText className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </>
          )}
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg p-4 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Take Photo</h3>
                <Button
                  onClick={() => setShowCamera(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg mb-4"
              />
              
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
                <Button onClick={() => setShowCamera(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Media List */}
        {capturedMedia.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Captured Evidence ({capturedMedia.length})</h4>
            {capturedMedia.map((media) => (
              <div key={media.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {media.type === 'photo' && <Image className="h-5 w-5 text-blue-500" />}
                    {media.type === 'video' && <Video className="h-5 w-5 text-green-500" />}
                    {media.type === 'audio' && <Mic className="h-5 w-5 text-purple-500" />}
                    {media.type === 'document' && <FileText className="h-5 w-5 text-orange-500" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{media.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(media.size)} • {new Date(media.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {media.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  {media.type === 'photo' && (
                    <Button
                      onClick={() => window.open(media.url, '_blank')}
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = media.url
                      a.download = media.name
                      a.click()
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => removeMedia(media.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}