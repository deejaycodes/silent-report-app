import { useState, useRef } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { IncidentCard } from "@/components/IncidentCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, MapPin, Clock, FileText, Phone, Heart, ArrowLeft, Upload, Send, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import type { IncidentType } from "@/components/IncidentCard"

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [includeContact, setIncludeContact] = useState(false)
  const [description, setDescription] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleIncidentSelect = (incident: IncidentType) => {
    setSelectedIncident(incident)
    setShowForm(true)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const resetForm = () => {
    setDescription("")
    setIncludeContact(false)
    setSelectedIncident(null)
    setSelectedFiles([])
    setShowConfirmation(false)
  }

  const incidentTypes = [
    { id: "domestic-violence", title: "Domestic Violence" },
    { id: "fgm", title: "FGM/Cutting" },
    { id: "child-abuse", title: "Child Abuse" },
    { id: "harassment", title: "Harassment" },
    { id: "other", title: "Other" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowForm(false)
    setShowConfirmation(true)
  }

  const quickActions = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live Chat",
      description: "Talk to a counselor now",
      action: () => navigate("/chat"),
      variant: "trust" as const
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Find Resources",
      description: "Locate nearby services",
      action: () => navigate("/resources"),
      variant: "calm" as const
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Hotlines",
      description: "Emergency contact numbers",
      action: () => navigate("/hotlines"),
      variant: "info" as const
    }
  ]

  // Confirmation page after successful submission
  if (showConfirmation) {
    return (
      <Layout className="pb-20">
        <div className="px-4 py-6 flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col justify-center text-center space-y-6">
            <div className="animate-fade-in">
              <div className="mx-auto mb-6 p-4 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
                <Shield className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Thank You for Your Courage
              </h1>
              
              <p className="text-lg text-muted-foreground mb-2 max-w-md mx-auto">
                Your report has been received safely and securely. Taking this step shows incredible strength.
              </p>
              
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Our trained professionals will review your report within 24 hours. If you provided contact information, we'll reach out to you.
              </p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              <h2 className="text-xl font-semibold mb-4">What would you like to do next?</h2>
              
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className="w-full"
              >
                <FileText className="h-5 w-5 mr-2" />
                Report Another Incident
              </Button>
              
              <Button 
                variant="trust" 
                size="lg"
                onClick={() => navigate("/chat")}
                className="w-full"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Live Chat with Counselor
              </Button>
              
              <Button 
                variant="calm" 
                size="lg"
                onClick={() => navigate("/resources")}
                className="w-full"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Find Help Nearby
              </Button>
            </div>

            {/* Support reminder */}
            <Card className="border-0 shadow-soft bg-gradient-calm max-w-md mx-auto mt-8">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium mb-2">Remember: You are not alone</p>
                <p className="text-xs text-muted-foreground">
                  Help is available 24/7. Your safety and wellbeing matter.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Navigation />
      </Layout>
    )
  }

  if (showForm && selectedIncident) {
    return (
      <Layout className="pb-20">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowForm(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Submit Report</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Notice */}
            <Card className="border-0 shadow-soft bg-primary-soft/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Anonymous & Secure</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your report is completely anonymous unless you choose to provide contact information below.
                </p>
              </CardContent>
            </Card>

            {/* Pre-selected Incident Type */}
            <div className="space-y-2">
              <Label htmlFor="incident-type">Type of Incident *</Label>
              <Select value={selectedIncident.id} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description *
                <span className="text-xs text-muted-foreground ml-2">
                  ({description.length}/1000)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe the incident in as much detail as you feel comfortable sharing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={6}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                Include when, where, and what happened. Only share what you're comfortable with.
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Evidence (Optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov"
                onChange={handleFileChange}
                className="hidden"
              />
              <Card 
                className="border-dashed border-2 border-muted hover:bg-muted/10 transition-colors cursor-pointer"
                onClick={handleFileUpload}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Upload photos, videos, or documents
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max 10MB per file. Supported: JPG, PNG, PDF, MP4
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" type="button" onClick={handleFileUpload}>
                    Choose Files
                  </Button>
                </CardContent>
              </Card>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-contact"
                    checked={includeContact}
                    onCheckedChange={(checked) => setIncludeContact(checked === true)}
                  />
                  <Label htmlFor="include-contact" className="font-medium">
                    Include contact information for follow-up
                  </Label>
                </div>
                <CardDescription className="text-sm">
                  Optional: Provide your contact details if you want us to follow up on your report
                </CardDescription>
              </CardHeader>
              
              {includeContact && (
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="How would you like to be contacted?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="sms">Text Message</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="best-time">Best Time to Contact</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="When is it safe to contact you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                        <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Submit */}
            <div className="space-y-4">
              <Button
                type="submit"
                variant="trust"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !description.trim()}
              >
                {isSubmitting ? (
                  "Submitting Report..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground px-4">
                By submitting this report, you acknowledge that the information provided is accurate to the best of your knowledge.
              </p>
            </div>
          </form>
        </div>

        <Navigation />
      </Layout>
    )
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-8 max-w-lg mx-auto">
        {/* Simplified Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Safe Haven</h1>
          <p className="text-lg text-muted-foreground">What happened to you?</p>
        </div>

        {/* Main Reporting Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">Choose what happened:</h2>
          <IncidentCard onSelect={handleIncidentSelect} />
        </div>

        {/* Emergency Help Button */}
        <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Phone className="h-16 w-16 text-red-600 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-red-800 dark:text-red-200">
              Need Help Right Now?
            </h3>
            <Button 
              variant="destructive" 
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => navigate("/chat")}
            >
              Get Help Now
            </Button>
          </CardContent>
        </Card>

        {/* Support Message */}
        <Card className="border-0 shadow-soft bg-gradient-calm">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-lg font-medium mb-2">You are not alone</p>
            <p className="text-sm text-muted-foreground">
              Help is available 24/7. Your safety matters.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </Layout>
  )
}