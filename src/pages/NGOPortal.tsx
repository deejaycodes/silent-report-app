import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Layout } from "@/components/Layout"
import { Building2, Shield, Users, BarChart3, Bell, FileCheck, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ngoFeatures = [
  {
    icon: <FileCheck className="h-6 w-6" />,
    title: "Case Management",
    description: "Track and manage incident reports efficiently"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Victim Support",
    description: "Coordinate care and follow-up services"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics & Insights",
    description: "AI-powered analysis and reporting"
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Real-time Alerts",
    description: "Get notified of urgent cases instantly"
  }
]

export default function NGOPortal() {
  const navigate = useNavigate()

  return (
    <Layout showThemeToggle={false}>
      <div className="flex flex-col min-h-screen">
        {/* Back Button */}
        <div className="px-4 pt-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 text-center max-w-screen-sm mx-auto">
          <div className="animate-fade-in">
            <div className="mx-auto mb-6 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
              <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
              NGO Portal
            </h1>
            
            <p className="text-base text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed">
              Manage incident reports, support victims, and coordinate responses with AI-powered tools
            </p>

            {/* Auth Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto mb-8">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => navigate("/auth?mode=login")}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Login to Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/auth?mode=register")}
                className="w-full"
              >
                Register Your NGO
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {ngoFeatures.map((feature, index) => (
                <Card key={index} className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-3 text-center">
                    <div className="mb-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit mx-auto text-blue-600 dark:text-blue-400">
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
            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Verified NGOs</span>
              </div>
              <div className="flex items-center gap-1">
                <FileCheck className="h-3 w-3" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
