import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Send, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { IncidentType } from "@/components/IncidentCard"

export default function Report() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [includeContact, setIncludeContact] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState(
    location.state?.selectedIncident?.id || ""
  )

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

    toast({
      title: "Report submitted successfully",
      description: "Your report has been received. You will be contacted within 24 hours if you provided contact information.",
    })

    setIsSubmitting(false)
    navigate("/dashboard")
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 safe-top">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
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

          {/* Incident Type */}
          <div className="space-y-2">
            <Label htmlFor="incident-type">Type of Incident *</Label>
            <Select value={selectedType} onValueChange={setSelectedType} required>
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
            <Card className="border-dashed border-2 border-muted hover:bg-muted/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Upload photos, videos, or documents
                </p>
                <p className="text-xs text-muted-foreground">
                  Max 10MB per file. Supported: JPG, PNG, PDF, MP4
                </p>
                <Button variant="outline" size="sm" className="mt-3" type="button">
                  Choose Files
                </Button>
              </CardContent>
            </Card>
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
              disabled={isSubmitting || !selectedType || !description.trim()}
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