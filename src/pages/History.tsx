import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageCircle, Calendar, Star, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Report {
  id: string
  type: string
  status: "submitted" | "in-review" | "resolved" | "closed"
  date: string
  urgent: boolean
  description: string
  lastUpdate: string
}

interface ChatSession {
  id: string
  counselor: string
  date: string
  duration: string
  status: "completed" | "ongoing"
  summary: string
}

const mockReports: Report[] = [
  {
    id: "R001",
    type: "Domestic Violence",
    status: "in-review",
    date: "2024-01-15",
    urgent: true,
    description: "Reported incident of domestic violence requiring immediate attention",
    lastUpdate: "Case assigned to specialist counselor"
  },
  {
    id: "R002", 
    type: "Harassment",
    status: "resolved",
    date: "2024-01-10",
    urgent: false,
    description: "Workplace harassment case resolved through mediation",
    lastUpdate: "Case closed successfully with follow-up scheduled"
  },
  {
    id: "R003",
    type: "Child Abuse",
    status: "submitted",
    date: "2024-01-12",
    urgent: true,
    description: "Child welfare concern reported and under investigation",
    lastUpdate: "Report received and being processed"
  }
]

const mockChatSessions: ChatSession[] = [
  {
    id: "C001",
    counselor: "Sarah Johnson",
    date: "2024-01-15",
    duration: "45 minutes",
    status: "completed",
    summary: "Discussed coping strategies and safety planning"
  },
  {
    id: "C002",
    counselor: "Michael Chen",
    date: "2024-01-12",
    duration: "30 minutes", 
    status: "completed",
    summary: "Initial consultation and resource recommendations"
  }
]

export default function History() {
  const navigate = useNavigate()
  const [feedbackGiven, setFeedbackGiven] = useState<string[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "default"
      case "in-review": return "default"
      case "resolved": return "secondary" 
      case "closed": return "secondary"
      default: return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted": return "Submitted"
      case "in-review": return "In Review"
      case "resolved": return "Resolved"
      case "closed": return "Closed"
      default: return status
    }
  }

  const handleFeedback = (reportId: string) => {
    setFeedbackGiven(prev => [...prev, reportId])
    // In a real app, this would open a feedback form
  }

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Your History</h1>
          <p className="text-muted-foreground">Track your reports and chat sessions</p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="chats">Chat Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {mockReports.length > 0 ? (
              <div className="space-y-3">
                {mockReports.map((report) => (
                  <Card key={report.id} className="border-0 shadow-soft">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">{report.type}</CardTitle>
                            <CardDescription className="text-xs">
                              ID: {report.id} • {new Date(report.date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          <Badge variant={getStatusColor(report.status)} className="text-xs">
                            {getStatusLabel(report.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>

                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Last Update:
                        </p>
                        <p className="text-sm">{report.lastUpdate}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                        
                        {report.status === "resolved" && !feedbackGiven.includes(report.id) && (
                          <Button 
                            variant="trust" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleFeedback(report.id)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Give Feedback
                          </Button>
                        )}
                        
                        {feedbackGiven.includes(report.id) && (
                          <Badge variant="secondary" className="text-xs px-3 py-1">
                            ✓ Feedback Given
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Reports Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your submitted reports will appear here
                  </p>
                  <Button variant="trust" onClick={() => navigate("/report")}>
                    Submit Your First Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-4">
            {mockChatSessions.length > 0 ? (
              <div className="space-y-3">
                {mockChatSessions.map((session) => (
                  <Card key={session.id} className="border-0 shadow-soft">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-success" />
                          <div>
                            <CardTitle className="text-base">
                              Chat with {session.counselor}
                            </CardTitle>
                            <CardDescription className="text-xs flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(session.date).toLocaleDateString()} • {session.duration}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={session.status === "completed" ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Session Summary:
                        </p>
                        <p className="text-sm">{session.summary}</p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        View Transcript
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Chat Sessions Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your chat history will appear here
                  </p>
                  <Button variant="trust" onClick={() => navigate("/chat")}>
                    Start Your First Chat
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Privacy Notice */}
        <Card className="border-0 shadow-soft bg-primary-soft/30">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">Privacy & Data Retention</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your data is kept confidential and secure. Reports are retained for follow-up purposes. 
              Chat transcripts are anonymized after 30 days. You can request data deletion at any time.
            </p>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </Layout>
  )
}