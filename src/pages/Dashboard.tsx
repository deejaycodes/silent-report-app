import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { IncidentCard } from "@/components/IncidentCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import type { IncidentType } from "@/components/IncidentCard"

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleIncidentSelect = (incident: IncidentType) => {
    // Navigate to report page with only the incident ID to avoid serialization issues
    navigate("/report", { state: { selectedIncidentId: incident.id } })
  }

  return (
    <Layout className="safe-bottom">
      <div className="mobile-container mobile-section">
        {/* Mobile Header */}
        <div className="text-center space-y-4 safe-top">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{t('app.name')}</h1>
          <p className="text-base sm:text-lg text-muted-foreground">{t('app.tagline')}</p>
        </div>

        {/* Main Reporting Section */}
        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-center leading-tight">
            {t('dashboard.choose_what_happened')}
          </h2>
          <IncidentCard onSelect={handleIncidentSelect} />
        </div>

        {/* Emergency Help Button - Mobile Optimized */}
        <Card className="mobile-card border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="text-center space-y-4">
            <div>
              <Phone className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200 leading-tight">
              {t('dashboard.need_help_now')}
            </h3>
            <Button 
              variant="destructive" 
              className="mobile-button w-full mobile-scale"
              onClick={() => navigate("/chat")}
            >
              {t('dashboard.get_help_now')}
            </Button>
          </CardContent>
        </Card>

        {/* Support Message - Mobile Optimized */}
        <Card className="mobile-card border-0 shadow-soft bg-gradient-calm">
          <CardContent className="text-center space-y-3">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto" />
            <p className="text-base sm:text-lg font-medium leading-tight">
              {t('dashboard.you_are_not_alone')}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('dashboard.help_available')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </Layout>
  )
}