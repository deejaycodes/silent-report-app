import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { IncidentCard } from "@/components/IncidentCard"
import { Button } from "@/components/ui/button"
import { Phone, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import type { IncidentType } from "@/components/IncidentCard"

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleIncidentSelect = (incident: IncidentType) => {
    navigate("/report", { state: { selectedIncidentId: incident.id } })
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="mx-auto mb-3 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('dashboard.choose_what_happened')}</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.anonymity_reminder')}</p>
        </div>

        {/* Incident Types */}
        <IncidentCard onSelect={handleIncidentSelect} />

        {/* Emergency */}
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">{t('dashboard.need_help_now')}</p>
            <p className="text-xs text-red-600/80 dark:text-red-300/80">{t('dashboard.emergency_description')}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => navigate("/chat")}>
            {t('dashboard.get_help_now')}
          </Button>
        </div>

        {/* Reassurance */}
        <p className="text-center text-sm text-muted-foreground px-4">
          {t('dashboard.you_are_not_alone')}. {t('dashboard.help_available')}
        </p>
      </div>
      
      <Navigation />
    </Layout>
  )
}
