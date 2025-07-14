import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { MediaCapture } from "@/components/MediaCapture"
import { PrivacyShield } from "@/components/PrivacyShield"
import { QuickExitButton } from "@/components/QuickExitButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Vault, Shield, Camera, FileText, Download, Trash2, Eye } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast"

interface Evidence {
  id: string
  type: 'photo' | 'video' | 'audio' | 'document' | 'note'
  name: string
  description?: string
  timestamp: number
  size: number
  encrypted: boolean
  tags: string[]
  metadata?: any
}

export default function EvidenceVault() {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [storageUsed, setStorageUsed] = useState(0)
  const [privacySettings, setPrivacySettings] = useState(null)
  const { toast } = useToast()
  const { t } = useTranslation()

  const maxStorage = 100 // MB
  const storagePercentage = (storageUsed / maxStorage) * 100

  useEffect(() => {
    calculateStorageUsage()
  }, [evidence])

  const calculateStorageUsage = () => {
    const totalSize = evidence.reduce((sum, item) => sum + item.size, 0)
    setStorageUsed(totalSize / (1024 * 1024)) // Convert to MB
  }

  const handleMediaCapture = (media: any) => {
    const evidenceItem: Evidence = {
      id: media.id,
      type: media.type,
      name: media.name,
      timestamp: media.timestamp,
      size: media.size,
      encrypted: privacySettings?.dataEncryption || false,
      tags: [],
      metadata: media.metadata
    }

    setEvidence(prev => [evidenceItem, ...prev])
    
    toast({
      title: "📁 Evidence Saved",
      description: `${media.name} has been securely stored`,
      duration: 3000,
    })
  }

  const deleteEvidence = (id: string) => {
    const item = evidence.find(e => e.id === id)
    if (!item) return

    setEvidence(prev => prev.filter(e => e.id !== id))
    
    toast({
      title: "🗑️ Evidence Deleted",
      description: `${item.name} has been permanently deleted`,
      duration: 3000,
    })
  }

  const exportEvidence = () => {
    // In a real app, this would create a secure export
    const exportData = {
      exported: new Date().toISOString(),
      evidence: evidence.map(e => ({
        ...e,
        note: "Evidence exported from secure vault"
      }))
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `evidence-export-${Date.now()}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    toast({
      title: "📤 Evidence Exported",
      description: "Evidence package has been created",
      duration: 5000,
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return '📸'
      case 'video': return '🎥'
      case 'audio': return '🎤'
      case 'document': return '📄'
      case 'note': return '📝'
      default: return '📁'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'bg-blue-500'
      case 'video': return 'bg-green-500'
      case 'audio': return 'bg-purple-500'
      case 'document': return 'bg-orange-500'
      case 'note': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Vault className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Evidence Vault</h1>
            <QuickExitButton />
          </div>
          <p className="text-muted-foreground">
            Secure collection and storage of evidence and documentation
          </p>
        </div>

        {/* Storage Usage */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>{storageUsed.toFixed(1)} MB / {maxStorage} MB</span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{evidence.length} items stored</span>
                <span>{(maxStorage - storageUsed).toFixed(1)} MB remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="capture" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="capture" className="gap-2">
              <Camera className="h-4 w-4" />
              Capture
            </TabsTrigger>
            <TabsTrigger value="vault" className="gap-2">
              <Vault className="h-4 w-4" />
              Vault ({evidence.length})
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="mt-6">
            <MediaCapture
              onMediaCapture={handleMediaCapture}
              allowedTypes={['photo', 'video', 'audio', 'document']}
              maxFileSize={10} // 10MB max per file
            />
          </TabsContent>

          <TabsContent value="vault" className="mt-6">
            <div className="space-y-4">
              
              {/* Vault Controls */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Stored Evidence</h3>
                {evidence.length > 0 && (
                  <Button onClick={exportEvidence} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                )}
              </div>

              {/* Evidence List */}
              {evidence.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Vault className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Evidence Stored</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use the Capture tab to start collecting evidence
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {evidence.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(item.type)}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getTypeIcon(item.type)}</span>
                                <h4 className="font-medium truncate">{item.name}</h4>
                                {item.encrypted && (
                                  <Badge variant="secondary" className="text-xs">
                                    🔒 Encrypted
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(item.size)} • {new Date(item.timestamp).toLocaleString()}
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              onClick={() => deleteEvidence(item.id)}
                              variant="ghost" 
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <PrivacyShield 
              onPrivacyChange={(settings) => setPrivacySettings(settings)}
            />
          </TabsContent>
        </Tabs>

        {/* Important Notice */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Evidence Collection Notice
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  All evidence is stored securely on your device. Consider backing up important evidence to a secure external location. This tool is for documentation purposes and does not replace legal advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </Layout>
  )
}