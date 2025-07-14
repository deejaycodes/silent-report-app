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

            <div className="flex flex-col gap-3 max-w-xs mx-auto mb-8">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                {t('landing.report_anonymously')}
              </Button>
              
              {/* NGO Organization Section */}
              <div className="border rounded-lg p-4 bg-card/50 backdrop-blur-sm mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">For NGO Organizations</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Manage incidents, support victims, coordinate responses
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate("/auth?mode=login")}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate("/auth?mode=register")}
                  >
                    Register NGO
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                <CardContent className="p-3 text-center">
                  <div className="mb-2 p-2 bg-primary-soft rounded-lg w-fit mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xs mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>Anonymous</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </>
  )
}