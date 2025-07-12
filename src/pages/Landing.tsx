import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Layout } from "@/components/Layout"
import { SOSButton } from "@/components/SOSButton"
import { Shield, Phone, Heart, MapPin, MessageCircle, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

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

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 text-center">
          <div className="animate-fade-in">
            <div className="mx-auto mb-8 p-4 bg-primary-soft rounded-full w-fit">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              Safe Haven
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              A secure platform for anonymous reporting and getting the support you need
            </p>

            <div className="flex flex-col gap-4 max-w-sm mx-auto mb-12">
              <Button 
                variant="trust" 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="w-full"
              >
                NGO Login/Signup
              </Button>
              
              <Button 
                variant="calm" 
                size="lg"
                onClick={() => navigate("/report")}
                className="w-full"
              >
                Report Anonymously
              </Button>
            </div>
          </div>


          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="mb-3 p-2 bg-primary-soft rounded-lg w-fit mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center gap-4 text-xs text-muted-foreground">
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
  )
}