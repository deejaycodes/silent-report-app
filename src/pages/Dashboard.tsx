import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { IncidentCard } from "@/components/IncidentCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, MapPin, Clock, FileText, Phone, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { IncidentType } from "@/components/IncidentCard"

export default function Dashboard() {
  const navigate = useNavigate()

  const handleIncidentSelect = (incident: IncidentType) => {
    navigate("/report", { state: { selectedIncident: incident } })
  }

  const recentReports = [
    { id: 1, type: "Domestic Violence", status: "In Review", date: "2 days ago", urgent: true },
    { id: 2, type: "Harassment", status: "Resolved", date: "1 week ago", urgent: false },
  ]

  const quickActions = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live Chat",
      description: "Talk to a counselor now",
      action: () => navigate("/chat"),
      variant: "trust" as const
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Find Resources",
      description: "Locate nearby services",
      action: () => navigate("/resources"),
      variant: "calm" as const
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Hotlines",
      description: "Emergency contact numbers",
      action: () => navigate("/hotlines"),
      variant: "info" as const
    }
  ]

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to Safe Haven</h1>
          <p className="text-muted-foreground">How can we help you today?</p>
        </div>


        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer border-0 shadow-soft hover:shadow-comfort transition-all duration-200" onClick={action.action}>
                <CardContent className="flex items-center p-4">
                  <div className="p-2 rounded-lg bg-primary-soft mr-3">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <Button variant={action.variant} size="sm">
                    Open
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Report New Incident */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Report an Incident</h2>
          <IncidentCard onSelect={handleIncidentSelect} />
        </div>

        {/* Recent Reports */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Recent Reports</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
              <Clock className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
          
          {recentReports.length > 0 ? (
            <div className="space-y-2">
              {recentReports.map((report) => (
                <Card key={report.id} className="border-0 shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{report.type}</p>
                          <p className="text-xs text-muted-foreground">{report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.urgent && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                        <Badge variant={report.status === "Resolved" ? "secondary" : "default"} className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No reports yet</p>
                <p className="text-xs text-muted-foreground">Your reported incidents will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Support Resources */}
        <Card className="border-0 shadow-soft bg-gradient-calm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5" />
              24/7 Support Available
            </CardTitle>
            <CardDescription>
              Remember: You are not alone. Help is always available.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="trust" size="sm" className="flex-1" onClick={() => navigate("/chat")}>
                Live Chat
              </Button>
              <Button variant="calm" size="sm" className="flex-1" onClick={() => navigate("/resources")}>
                Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </Layout>
  )
}