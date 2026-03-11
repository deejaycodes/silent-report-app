import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Layout } from "@/components/Layout"
import { SOSButton } from "@/components/SOSButton"
import { LanguageSelectionModal } from "@/components/LanguageSelectionModal"
import { Shield, Phone, Heart, MapPin, MessageCircle, FileText, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const features = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Anonymous Reporting",
    description: "Report incidents safely and anonymously"
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Real-time Support",
    description: "Chat with trained professionals instantly"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Find Resources", 
    description: "Locate nearby support services"
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Safe Space",
    description: "Your privacy and safety are our priority"
  }
]

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  useEffect(() => {
    // Check if language has been selected before
    const languageSelected = localStorage.getItem('language-selected')
    if (!languageSelected) {
      setShowLanguageModal(true)
    }
  }, [])

  return (
    <>
      {showLanguageModal && (
        <LanguageSelectionModal onLanguageSelect={() => setShowLanguageModal(false)} />
      )}
      <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 text-center max-w-screen-sm mx-auto">
          <div className="animate-fade-in">
            <div className="mx-auto mb-6 p-3 bg-primary-soft rounded-full w-fit">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
              {t('app.name')}
            </h1>
            
            <p className="text-base text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
              {t('landing.hero_description')}
            </p>

            <div className="flex flex-col gap-3 max-w-xs mx-auto mb-6">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full h-14 text-lg"
              >
                {t('landing.report_anonymously')}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/resources")}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find Help Nearby
              </Button>
            </div>

            {/* Simplified Features - Single Row */}
            <div className="flex items-center justify-center gap-6 max-w-xs mx-auto text-xs text-muted-foreground mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-primary-soft rounded-lg">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>Anonymous</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-primary-soft rounded-lg">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <span>24/7 Chat</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-primary-soft rounded-lg">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <span>Safe Space</span>
              </div>
            </div>

          {/* Trust Indicators */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>Confidential</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* NGO Portal Link */}
          <div className="mt-6 pb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/ngo-portal")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Building2 className="h-3 w-3 mr-1" />
              NGO Portal
            </Button>
          </div>
        </div>
      </div>
      </Layout>
    </>
  )
}