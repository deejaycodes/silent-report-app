import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/Layout"
import { LanguageSelectionModal } from "@/components/LanguageSelectionModal"
import { Shield, Phone, MapPin, Lock, ChevronRight, FileText, Eye, HeartHandshake, ArrowRight } from "lucide-react"
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
        <div className="flex flex-col min-h-screen max-w-md mx-auto overflow-hidden">

          {/* ── Hero Section ── */}
          <div className="relative flex-1 flex flex-col justify-center px-6 pt-20 pb-6">
            {/* Animated gradient orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none">
              <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
            </div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="mx-auto mb-8 w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                <Shield className="h-9 w-9 text-primary-foreground" />
              </div>

              {/* Headline */}
              <h1 className="text-center text-[2.25rem] leading-[1.15] font-extrabold tracking-tight text-foreground">
                Your voice matters.
                <br />
                <span className="text-primary">Stay anonymous.</span>
              </h1>

              <p className="text-center text-muted-foreground mt-4 text-[15px] leading-relaxed max-w-[280px] mx-auto">
                {t('landing.hero_description')}
              </p>

              {/* Primary CTA */}
              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={() => navigate("/report-start")}
                  className="w-full h-[56px] text-[15px] font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {t('landing.report_anonymously')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/resources")}
                  className="h-12 rounded-xl border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card"
                >
                  <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                  Find Help
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/track")}
                  className="h-12 rounded-xl border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card"
                >
                  <Eye className="h-4 w-4 mr-1.5 text-primary" />
                  Track Report
                </Button>
              </div>
            </div>
          </div>

          {/* ── Trust Bar ── */}
          <div className="px-6 mb-6">
            <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40">
              {[
                { icon: Lock, label: 'End-to-end encrypted' },
                { icon: Shield, label: '100% anonymous' },
                { icon: Phone, label: 'Available 24/7' },
              ].map(p => (
                <div key={p.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <p.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── How It Works ── */}
          <div className="px-6 mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-4">How it works</h2>
            <div className="relative">
              {/* Connector line */}
              <div className="absolute top-6 left-[calc(16.67%+10px)] right-[calc(16.67%+10px)] h-[2px] bg-border/60" />
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: FileText, title: 'Report', desc: 'Tell us what happened — safely and privately' },
                  { icon: Eye, title: 'Track', desc: 'Follow your case with a private code' },
                  { icon: HeartHandshake, title: 'Get Help', desc: 'Trained NGOs take action on your behalf' },
                ].map((step, i) => (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-card border border-border/60 shadow-sm flex items-center justify-center mb-2">
                      <step.icon className="h-5 w-5 text-primary" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">{step.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug px-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Testimonial ── */}
          <div className="px-6 mb-6">
            <div className="relative p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40">
              <span className="absolute -top-3 left-5 text-4xl text-primary/20 font-serif">"</span>
              <p className="text-sm text-foreground/80 italic leading-relaxed pl-2">
                I didn't think anyone would listen. This app connected me to people who actually helped.
              </p>
              <p className="text-xs text-muted-foreground mt-2 pl-2">— Anonymous survivor</p>
            </div>
          </div>

          {/* ── Emergency Strip ── */}
          <div className="px-6 pb-8">
            <a
              href="tel:112"
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">In immediate danger?</p>
                <p className="text-xs text-red-600/80 dark:text-red-300/70">Tap to call 112 — emergency services</p>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400 flex-shrink-0" />
            </a>
          </div>
        </div>
      </Layout>
    </>
  )
}
