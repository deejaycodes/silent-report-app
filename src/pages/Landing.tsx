import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/Layout"
import { LanguageSelectionModal } from "@/components/LanguageSelectionModal"
import { Shield, Phone, MapPin, Lock, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  useEffect(() => {
    const languageSelected = localStorage.getItem('language-selected')
    if (!languageSelected) setShowLanguageModal(true)
  }, [])

  return (
    <>
      {showLanguageModal && (
        <LanguageSelectionModal onLanguageSelect={() => setShowLanguageModal(false)} />
      )}
      <Layout>
        <div className="flex flex-col min-h-screen px-6 py-12 max-w-md mx-auto">
          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center text-center">
            <div className="mx-auto mb-5 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">{t('app.name')}</h1>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              {t('landing.hero_description')}
            </p>

            <div className="space-y-3 mb-10">
              <Button size="lg" onClick={() => navigate("/report-start")} className="w-full h-14 text-base font-semibold">
                {t('landing.report_anonymously')}
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/resources")} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                {t('landing.find_help') || 'Find Help Nearby'}
              </Button>
            </div>

            {/* Trust pills */}
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 px-2.5 py-1 bg-muted rounded-full">
                <Lock className="h-3 w-3" /> Encrypted
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-muted rounded-full">
                <Shield className="h-3 w-3" /> Anonymous
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-muted rounded-full">
                <Phone className="h-3 w-3" /> 24/7
              </span>
            </div>
          </div>

          {/* Emergency */}
          <div className="mt-8 mb-4">
            <a href="tel:112" className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">In immediate danger?</p>
                <p className="text-xs text-red-600/80">Call 112 for emergency services</p>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400" />
            </a>
          </div>
        </div>
      </Layout>
    </>
  )
}
