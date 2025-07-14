import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { IncidentCard } from "@/components/IncidentCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { IncidentType } from "@/components/IncidentCard"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleIncidentSelect = (incident: IncidentType) => {
    // Navigate to report page with only the incident ID to avoid serialization issues
    navigate("/report", { state: { selectedIncidentId: incident.id } })
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-8 max-w-lg mx-auto">
        {/* Simplified Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Safe Haven</h1>
          <p className="text-lg text-muted-foreground">Report what happened</p>
        </div>

        {/* Main Reporting Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">Choose what happened:</h2>
          <IncidentCard onSelect={handleIncidentSelect} />
        </div>

        {/* Emergency Help Button */}
        <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Phone className="h-16 w-16 text-red-600 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-red-800 dark:text-red-200">
              Need Help Right Now?
            </h3>
            <Button 
              variant="destructive" 
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => navigate("/chat")}
            >
              Get Help Now
            </Button>
          </CardContent>
        </Card>

        {/* Support Message */}
        <Card className="border-0 shadow-soft bg-gradient-calm">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-lg font-medium mb-2">You are not alone</p>
            <p className="text-sm text-muted-foreground">
              Help is available 24/7. Your safety matters.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </Layout>
  )
}