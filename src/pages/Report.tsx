import { useState, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Send, Shield, Lock, X, Loader2 } from "lucide-react"
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
  const [showContact, setShowContact] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState(location.state?.selectedIncidentId || "")
  const [selectedState, setSelectedState] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  const wordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const lowerText = description.toLowerCase().trim()

    if (wordCount < 10) {
      toast({ title: "Please provide more details", description: "Write at least 10 words so we can help.", variant: "destructive" })
      return
    }
    const spamPhrases = ['test', 'hello world', 'asdf', 'qwerty']
    if (spamPhrases.some(phrase => lowerText === phrase || lowerText.includes(phrase + ' '))) {
      toast({ title: "Please describe the actual incident", description: "We need real information to help.", variant: "destructive" })
      return
    }
    if (/(.)\1{5,}/.test(description)) {
      toast({ title: "Please write clearly", description: "Help us understand by using real words.", variant: "destructive" })
      return
    }
    if (!selectedState) {
      toast({ title: t('report.location_required'), description: t('report.select_state_error'), variant: "destructive" })
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
      toast({ title: t('report.submission_success'), description: t('report.submission_success_message') })
      navigate("/report/confirmation", { state: { reportId: response._id || response.id } })
    } catch (error: any) {
      toast({ title: t('report.submission_failed'), description: error?.message || t('report.submission_error'), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold flex-1">{t('report.title')}</h1>
        </div>

        {/* Trust banner */}
        <div className="flex items-center gap-2 px-3 py-2 mb-6 rounded-lg bg-primary/5 border border-primary/10">
          <Lock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{t('report.anonymous_notice')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. What happened */}
          <section className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="description" className="text-sm font-semibold">
                {t('report.tell_what_happened')} <span className="text-destructive">*</span>
              </Label>
              <span className={`text-xs ${wordCount >= 10 ? 'text-success' : 'text-muted-foreground'}`}>
                {wordCount}/10 words min
              </span>
            </div>
            <Textarea
              id="description"
              placeholder={t('report.description_placeholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={5}
              className="resize-none text-[15px] leading-relaxed"
              required
            />
            <p className="text-xs text-muted-foreground">{t('report.description_help')}</p>
          </section>

          {/* 2. Location */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">
              {t('report.location_state')} <span className="text-destructive">*</span>
            </Label>
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
          </section>

          {/* 3. Category (pre-filled from previous page) */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">{t('report.categorize_optional')}</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger><SelectValue placeholder={t('report.category_placeholder')} /></SelectTrigger>
              <SelectContent>
                {incidentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* 4. Evidence */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">{t('report.evidence_optional')}</Label>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf" onChange={handleFileChange} className="hidden" />

            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{(file.size / 1024).toFixed(0)}KB</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-muted-foreground/20 rounded-xl text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors">
              <Upload className="h-4 w-4" />
              {selectedFiles.length > 0 ? 'Add more files' : t('report.upload_files')}
            </button>
            <p className="text-xs text-muted-foreground">{t('report.file_types')}</p>
          </section>

          {/* 5. Contact (optional toggle) */}
          <section>
            {!showContact ? (
              <button type="button" onClick={() => setShowContact(true)}
                className="w-full text-left px-4 py-3 border border-border rounded-xl text-sm hover:bg-accent/50 transition-colors">
                <span className="font-medium">{t('report.contact_info')}</span>
                <span className="text-muted-foreground ml-1">— {t('report.contact_optional')}</span>
              </button>
            ) : (
              <div className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">{t('report.contact_info')}</Label>
                  <button type="button" onClick={() => setShowContact(false)} className="text-xs text-muted-foreground hover:text-foreground">Hide</button>
                </div>
                <div className="space-y-2">
                  <Input type="email" placeholder={t('report.email_placeholder')} value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Input type="tel" placeholder={t('report.phone_placeholder')} value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                </div>
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
            )}
          </section>

          {/* Submit */}
          <div className="pt-2 pb-8 space-y-3">
            <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              disabled={isSubmitting || wordCount < 10 || !selectedState}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="h-4 w-4 mr-2" /> {t('report.submit_report')}</>
              )}
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>{t('report.accuracy_notice')}</span>
            </div>
          </div>
        </form>
      </div>
      <Navigation />
    </Layout>
  )
}
