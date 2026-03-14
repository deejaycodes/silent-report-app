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
import { ArrowLeft, Upload, Send, Shield, Lock, X, Loader2, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import apiService from "@/lib/api"
import { NIGERIAN_STATES, NIGERIAN_STATES_LGAS } from "@/lib/nigerian-locations"

const incidentTypes = [
  { id: "domestic_violence", title: "Violence at home" },
  { id: "child_abuse", title: "Harm to a child" },
  { id: "harassment", title: "Unwanted touching or harassment" },
  { id: "fgm", title: "Female Genital Mutilation (FGM)" },
  { id: "other", title: "Other safety concern" },
]

const CONTEXT_PROMPTS: Record<string, { label: string; placeholder: string }> = {
  'fgm': { label: 'Tell us about the FGM incident', placeholder: 'Who is affected? When did it happen or is it being planned? Where did it happen?' },
  'child-labour': { label: 'Tell us about the child labour', placeholder: 'What kind of work? How old is the child? Where is this happening?' },
  'domestic_violence': { label: 'Tell us about the violence', placeholder: 'What happened? Who is the abuser? Is the person safe now?' },
  'child_abuse': { label: 'Tell us about the harm to the child', placeholder: 'What happened to the child? How old are they? Who is responsible?' },
  'harassment': { label: 'Tell us about the harassment', placeholder: 'What happened? Where and when? Is the person still in danger?' },
}

const TIMING_OPTIONS = [
  { value: 'happening_now', label: 'Happening now' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This week' },
  { value: 'longer_ago', label: 'Longer ago' },
]

export default function Report() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedType, setSelectedType] = useState(location.state?.selectedIncidentId || "")
  const [selectedState, setSelectedState] = useState("")
  const [selectedLGA, setSelectedLGA] = useState("")
  const [timing, setTiming] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [address, setAddress] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  const wordCount = description.trim().split(/\s+/).filter(w => w.length > 0).length
  const totalSteps = 3 // 0: what, 1: where/when, 2: extras + submit

  const canAdvance = () => {
    if (step === 0) return wordCount >= 10
    if (step === 1) return !!selectedState
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await apiService.createReport({
        incident_type: selectedType || 'other',
        description: `${description}${timing ? `\n\n[Timing: ${timing}]` : ''}`,
        location: selectedLGA ? `${selectedState}, ${selectedLGA}` : selectedState,
        address: address || undefined,
        contact_info: contactEmail || undefined,
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

  const validateAndNext = () => {
    if (step === 0) {
      const lowerText = description.toLowerCase().trim()
      if (wordCount < 10) {
        toast({ title: "Please provide more details", description: "Write at least 10 words so we can help.", variant: "destructive" }); return
      }
      const spamPhrases = ['test', 'hello world', 'asdf', 'qwerty']
      if (spamPhrases.some(p => lowerText === p || lowerText.startsWith(p + ' '))) {
        toast({ title: "Please describe the actual incident", description: "We need real information to help.", variant: "destructive" }); return
      }
      if (/(.)\1{5,}/.test(description)) {
        toast({ title: "Please write clearly", description: "Help us understand by using real words.", variant: "destructive" }); return
      }
    }
    if (step === 1 && !selectedState) {
      toast({ title: "Location required", description: "Please select a state.", variant: "destructive" }); return
    }
    setStep(s => Math.min(s + 1, totalSteps - 1))
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/")} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold flex-1">{t('report.title')}</h1>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        {/* Step 0: What happened */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
              <Lock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{t('report.anonymous_notice')}</p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">What type of incident?</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {incidentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label className="text-sm font-semibold">
                  {CONTEXT_PROMPTS[selectedType]?.label || t('report.tell_what_happened')} <span className="text-destructive">*</span>
                </Label>
                <span className={`text-xs ${wordCount >= 10 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {wordCount}/10
                </span>
              </div>
              <Textarea
                placeholder={CONTEXT_PROMPTS[selectedType]?.placeholder || t('report.description_placeholder')}
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={1000}
                rows={6}
                className="resize-none text-[15px] leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">Share as much or as little as you feel comfortable with.</p>
            </div>
          </div>
        )}

        {/* Step 1: Where & When */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Where did this happen? <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedState} onValueChange={v => { setSelectedState(v); setSelectedLGA("") }}>
                  <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedLGA} onValueChange={setSelectedLGA} disabled={!selectedState}>
                  <SelectTrigger><SelectValue placeholder={selectedState ? "LGA" : "State first"} /></SelectTrigger>
                  <SelectContent>
                    {(NIGERIAN_STATES_LGAS[selectedState] || []).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Address or landmark <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input placeholder="e.g. behind Shoprite, opposite the mosque on Adeniyi Jones" value={address} onChange={e => setAddress(e.target.value)} className="text-sm" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">When did this happen?</Label>
              <div className="grid grid-cols-2 gap-2">
                {TIMING_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setTiming(opt.value)}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      timing === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent/50'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Evidence, Contact & Submit */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Evidence */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Evidence <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf" onChange={handleFileChange} className="hidden" />
              {selectedFiles.length > 0 && (
                <div className="space-y-1.5">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)}KB</span>
                      <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-muted-foreground/20 rounded-xl text-sm text-muted-foreground hover:border-primary/30 transition-colors">
                <Upload className="h-4 w-4" />
                {selectedFiles.length > 0 ? 'Add more files' : 'Upload photos, videos or documents'}
              </button>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Contact info <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <p className="text-xs text-muted-foreground">Only if you want updates on your case</p>
              <Input type="email" placeholder="Email address" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              <Input type="tel" placeholder="Phone number" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
            </div>

            {/* Submit */}
            <div className="pt-2 space-y-3">
              <Button onClick={handleSubmit} size="lg" className="w-full h-12 text-base font-semibold" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : <><Send className="h-4 w-4 mr-2" />{t('report.submit_report')}</>}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" /><span>{t('report.accuracy_notice')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next button (steps 0 & 1) */}
        {step < totalSteps - 1 && (
          <div className="mt-8">
            <Button onClick={validateAndNext} size="lg" className="w-full h-12 text-base font-semibold" disabled={!canAdvance()}>
              Continue <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
      <Navigation />
    </Layout>
  )
}
