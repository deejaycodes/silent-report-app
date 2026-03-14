import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/Layout"
import { LanguageSelectionModal } from "@/components/LanguageSelectionModal"
import { Shield, Phone, MapPin, Lock, ChevronRight, FileText, Eye, HeartHandshake } from "lucide-react"
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
        <div className="flex flex-col min-h-screen max-w-md mx-auto">
          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8">
            <div className="relative mb-8">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center shadow-sm">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground text-center tracking-tight leading-tight">
                  {t('app.name')}
                </h1>
                <p className="text-center text-base text-muted-foreground mt-3 leading-relaxed max-w-xs mx-auto">
                  {t('landing.hero_description')}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3 mb-8">
              <Button
                size="lg"
                onClick={() => navigate("/report-start")}
                className="w-full h-14 text-base font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                {t('landing.report_anonymously')}
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => navigate("/resources")} className="h-12 rounded-xl">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  {t('landing.find_help') || 'Find Help'}
                </Button>
                <Button variant="outline" onClick={() => navigate("/track")} className="h-12 rounded-xl">
                  <Eye className="h-4 w-4 mr-1.5" />
                  Track Report
                </Button>
              </div>
            </div>

            {/* Trust pills */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[
                { icon: Lock, label: 'Encrypted' },
                { icon: Shield, label: 'Anonymous' },
                { icon: Phone, label: '24/7' },
              ].map(p => (
                <span key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 backdrop-blur rounded-full text-xs text-muted-foreground font-medium">
                  <p.icon className="h-3 w-3" /> {p.label}
                </span>
              ))}
            </div>

            {/* How it works */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center mb-4">How it works</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FileText, title: 'Report', desc: 'Describe what happened' },
                  { icon: Eye, title: 'Track', desc: 'Follow your case' },
                  { icon: HeartHandshake, title: 'Get Help', desc: 'NGOs take action' },
                ].map((step, i) => (
                  <div key={step.title} className="relative text-center p-3 rounded-2xl bg-muted/40">
                    <div className="absolute -top-2 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <step.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground">{step.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="text-center mb-6 px-4">
              <p className="text-sm text-muted-foreground italic">"I didn't think anyone would listen. This app connected me to people who actually helped."</p>
              <p className="text-xs text-muted-foreground/60 mt-1">— Anonymous survivor</p>
            </div>
          </div>

          {/* Emergency — sticky bottom */}
          <div className="px-6 pb-6">
            <a href="tel:112" className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl transition-colors hover:bg-red-100 dark:hover:bg-red-900/30">
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
