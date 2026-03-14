import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, MessageCircle, MapPin, Home, ChevronRight, Search, Copy, Check } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useState } from "react"

const nextActions = [
  { icon: Search, label: 'Track your report', desc: 'Check status and exchange messages', to: '/track', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: FileText, label: 'confirmation.report_something_else', desc: 'confirmation.report_another_description', to: '/report-start', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: MessageCircle, label: 'confirmation.talk_to_someone', desc: 'confirmation.talk_description', to: '/chat', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: MapPin, label: 'confirmation.find_help_nearby', desc: 'confirmation.help_description', to: '/resources', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Home, label: 'confirmation.go_to_main', desc: 'confirmation.main_description', to: '/', color: 'text-gray-600', bg: 'bg-gray-50' },
]

export default function ReportConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [safetyDismissed, setSafetyDismissed] = useState(false)
  const [copied, setCopied] = useState(false)
  const reportId = (location.state as any)?.reportId

  const copyId = () => {
    if (!reportId) return
    navigator.clipboard.writeText(reportId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-8 max-w-lg mx-auto space-y-6">
        {/* Success */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">{t('confirmation.thank_you')}</h1>
          <p className="text-muted-foreground">{t('confirmation.report_sent')}</p>
          {reportId && (
            <div className="inline-block px-4 py-2.5 bg-muted rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Tracking ID</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono font-bold select-all">{reportId}</p>
                <button onClick={copyId} className="p-1 rounded hover:bg-accent">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Save this — check back in 24-48 hours for updates from a case worker</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{t('confirmation.review_notice')}</p>
        </div>

        {/* Safety check */}
        {!safetyDismissed && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-center space-y-3">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{t('confirmation.safety_check')}</p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" className="flex-1" onClick={() => { setSafetyDismissed(true); navigate("/chat"); }}>
                {t('confirmation.need_help_now')}
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setSafetyDismissed(true)}>
                {t('confirmation.safe_for_now')}
              </Button>
            </div>
          </div>
        )}

        {/* Next actions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-center mb-3">{t('confirmation.what_next')}</p>
          {nextActions.map(action => (
            <button key={action.to} onClick={() => navigate(action.to)}
              className="w-full flex items-center gap-3 p-3.5 border border-border rounded-xl hover:bg-accent/50 active:scale-[0.98] transition-all text-left">
              <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0`}>
                <action.icon className={`h-4.5 w-4.5 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t(action.label)}</p>
                <p className="text-xs text-muted-foreground truncate">{t(action.desc)}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Reassurance */}
        <p className="text-center text-sm text-muted-foreground px-4">
          {t('confirmation.reassurance')}
        </p>
      </div>
      <Navigation />
    </Layout>
  )
}
