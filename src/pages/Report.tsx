import { useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
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
import apiService from "@/lib/api"

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'
]

const incidentTypes = [
  { id: "domestic_violence", title: "Violence at home" },
  { id: "child_abuse", title: "Harm to a child" },
  { id: "harassment", title: "Unwanted touching or harassment" },
  { id: "fgm", title: "Female Genital Mutilation (FGM)" },
  { id: "other", title: "Other safety concern" }
]

export default function Report() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [includeContact, setIncludeContact] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState(location.state?.selectedIncidentId || "")
  const [selectedState, setSelectedState] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [contactEmail, setContactEmail] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedState) {
      toast({ 
        title: t('report.location_required'), 
        description: t('report.select_state_error'), 
        variant: "destructive" 
      })
      return
    }
    setIsSubmitting(true)

    try {
      const response = await apiService.createReport({
        incident_type: selectedType || 'other',
        description,
        location: selectedState,
        files: selectedFiles.length > 0 ? selectedFiles : undefined,
      })

      toast({
        title: t('report.submission_success'),
        description: `Your report has been received. AI analysis: ${response.ai_analysis?.urgency || 'pending'}`,
      })
      navigate("/report/confirmation", { state: { reportId: response._id || response.id } })
    } catch (error) {
      toast({ 
        title: t('report.submission_failed'), 
        description: t('report.submission_error'), 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">{t('report.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anonymous Notice */}
          <Card className="border-0 shadow-soft bg-primary-soft/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{t('report.anonymous_secure')}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t('report.anonymous_notice')}</p>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t('report.tell_what_happened')}
              <span className="text-xs text-muted-foreground ml-2">({description.length}/1000)</span>
            </Label>
            <Textarea
              id="description"
              placeholder={t('report.description_placeholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={6}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">{t('report.description_help')}</p>
          </div>

          {/* Location (Nigerian State) */}
          <div className="space-y-2">
            <Label>{t('report.location_state')}</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder={t('report.select_state')} />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>{t('report.evidence_optional')}</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <Card className="border-dashed border-2 border-muted hover:bg-muted/10 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <CardContent className="p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                {selectedFiles.length > 0 ? (
                  <p className="text-sm font-medium">{selectedFiles.length} {t('report.files_selected')}</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">{t('report.upload_files')}</p>
                    <p className="text-xs text-muted-foreground">{t('report.file_types')}</p>
                  </>
                )}
                <Button variant="outline" size="sm" className="mt-3" type="button">
                  {t('report.choose_files')}
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
                  {t('report.contact_info')}
                </Label>
              </div>
              <CardDescription className="text-sm">
                {t('report.contact_optional')}
              </CardDescription>
            </CardHeader>
            {includeContact && (
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">{t('report.email')}</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder={t('report.email_placeholder')}
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">{t('report.phone')}</Label>
                  <Input id="contact-phone" type="tel" placeholder={t('report.phone_placeholder')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred-contact">{t('report.preferred_contact')}</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder={t('report.contact_method_placeholder')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">{t('report.contact_methods.email')}</SelectItem>
                      <SelectItem value="phone">{t('report.contact_methods.phone')}</SelectItem>
                      <SelectItem value="sms">{t('report.contact_methods.sms')}</SelectItem>
                      <SelectItem value="whatsapp">{t('report.contact_methods.whatsapp')}</SelectItem>
                      <SelectItem value="app_only">{t('report.contact_methods.app_only')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="best-time">{t('report.best_time')}</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder={t('report.best_time_placeholder')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">{t('report.contact_times.morning')}</SelectItem>
                      <SelectItem value="afternoon">{t('report.contact_times.afternoon')}</SelectItem>
                      <SelectItem value="evening">{t('report.contact_times.evening')}</SelectItem>
                      <SelectItem value="reach_out">{t('report.contact_times.reach_out')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Incident Type */}
          <div className="space-y-2">
            <Label htmlFor="incident-type">{t('report.categorize_optional')}</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger><SelectValue placeholder={t('report.category_placeholder')} /></SelectTrigger>
              <SelectContent>
                {incidentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('report.category_help')}
            </p>
          </div>

          {/* Submit */}
          <div className="space-y-4 pb-8">
            <Button
              type="submit"
              variant="trust"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !description.trim() || !selectedState}
            >
              {isSubmitting ? t('report.submitting') : (
                <><Send className="h-4 w-4 mr-2" />{t('report.submit_report')}</>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
              {t('report.accuracy_notice')}
            </p>
          </div>
        </form>
      </div>
      <Navigation />
    </Layout>
  )
}
