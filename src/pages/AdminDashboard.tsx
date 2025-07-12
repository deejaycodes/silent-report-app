import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  Phone,
  User,
  Building2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type IncidentStatus = "pending" | "in-progress" | "completed" | "rejected"
type IncidentSeverity = "low" | "medium" | "high" | "critical"

interface Incident {
  id: string
  title: string
  description: string
  category: string
  severity: IncidentSeverity
  status: IncidentStatus
  reportedAt: string
  reportedBy: string
  location?: string
  contactInfo?: string
  assignedTo: string
  details: {
    age?: string
    gender?: string
    relationship?: string
    additionalInfo?: string
    evidenceAttached?: boolean
  }
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-001",
      title: "Domestic Violence Report",
      description: "Ongoing physical and emotional abuse by partner",
      category: "Domestic Violence",
      severity: "high",
      status: "pending",
      reportedAt: "2024-01-15T10:30:00Z",
      reportedBy: "Anonymous User",
      location: "Downtown Area, Block 5",
      contactInfo: "Safe contact: neighbor at 555-0123",
      assignedTo: "current-admin",
      details: {
        age: "28",
        gender: "Female",
        relationship: "Romantic Partner",
        additionalInfo: "Escalating violence over past 3 months. Seeking safe exit strategy.",
        evidenceAttached: true
      }
    },
    {
      id: "INC-002", 
      title: "Workplace Harassment",
      description: "Sexual harassment by supervisor",
      category: "Sexual Harassment",
      severity: "medium",
      status: "in-progress",
      reportedAt: "2024-01-14T14:20:00Z",
      reportedBy: "Anonymous User",
      location: "Corporate Office District",
      assignedTo: "current-admin",
      details: {
        age: "32",
        gender: "Female", 
        relationship: "Supervisor",
        additionalInfo: "Inappropriate comments and unwanted physical contact during meetings.",
        evidenceAttached: false
      }
    },
    {
      id: "INC-003",
      title: "Child Abuse Concern",
      description: "Suspected child neglect in neighborhood",
      category: "Child Abuse",
      severity: "critical",
      status: "completed",
      reportedAt: "2024-01-12T09:15:00Z",
      reportedBy: "Concerned Neighbor",
      location: "Residential Area, Maple Street",
      assignedTo: "current-admin",
      details: {
        age: "8",
        gender: "Male",
        relationship: "Guardian",
        additionalInfo: "Child appears malnourished and often unsupervised for long periods.",
        evidenceAttached: true
      }
    },
    {
      id: "INC-004",
      title: "False Complaint",
      description: "Unsubstantiated domestic violence claim",
      category: "Domestic Violence",
      severity: "low",
      status: "rejected",
      reportedAt: "2024-01-10T16:45:00Z",
      reportedBy: "Anonymous User",
      location: "Suburban Area, Oak Drive",
      assignedTo: "current-admin",
      details: {
        age: "35",
        gender: "Male",
        relationship: "Ex-Partner",
        additionalInfo: "Investigation revealed this was a false accusation made during custody dispute.",
        evidenceAttached: false
      }
    }
  ])

  const updateIncidentStatus = (incidentId: string, newStatus: IncidentStatus) => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === incidentId 
          ? { ...incident, status: newStatus }
          : incident
      )
    )
    
    toast({
      title: "Status Updated",
      description: `Incident ${incidentId} status changed to ${newStatus}`,
    })
  }

  const getSeverityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case "critical": return "destructive"
      case "high": return "destructive" 
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case "pending": return "secondary"
      case "in-progress": return "default"
      case "completed": return "outline"
      case "rejected": return "destructive"
      default: return "outline"
    }
  }

  const pendingIncidents = incidents.filter(i => i.status === "pending")
  const inProgressIncidents = incidents.filter(i => i.status === "in-progress")
  const completedIncidents = incidents.filter(i => i.status === "completed")
  const rejectedIncidents = incidents.filter(i => i.status === "rejected")
  
  const latestPending = pendingIncidents[0]
  const totalIncidents = incidents.length

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        {/* Header with Welcome Message */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Hope Foundation</h1>
              <p className="text-muted-foreground">NGO Admin Dashboard</p>
            </div>
            <Button variant="outline" size="sm">
              <Building2 className="h-4 w-4 mr-2" />
              NGO Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalIncidents}</p>
                  <p className="text-xs text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingIncidents.length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{inProgressIncidents.length}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{completedIncidents.length}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{rejectedIncidents.length}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Pending Incident */}
        {latestPending && (
          <Card className="border-0 shadow-comfort bg-gradient-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Latest Pending Assignment
              </CardTitle>
              <CardDescription>Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{latestPending.title}</h3>
                    <Badge variant={getSeverityColor(latestPending.severity)}>
                      {latestPending.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{latestPending.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(latestPending.reportedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {latestPending.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="trust" 
                  size="sm"
                  onClick={() => setSelectedIncident(latestPending)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateIncidentStatus(latestPending.id, "in-progress")}
                >
                  Start Working
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Incidents Management */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                        <Badge variant={getStatusColor(incident.status)} className="text-xs">
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                        <span>{incident.category}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        View
                      </Button>
                      {incident.status === "pending" && (
                        <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-progress">Start</SelectItem>
                            <SelectItem value="completed">Complete</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {incident.status === "in-progress" && (
                        <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Complete</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {pendingIncidents.map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        View Details
                      </Button>
                      <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">Start Working</SelectItem>
                          <SelectItem value="completed">Mark Complete</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-3">
            {incidents.filter(i => i.status === "in-progress").map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        View Details
                      </Button>
                      <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Mark Complete</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {incidents.filter(i => i.status === "completed").map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3">
            {rejectedIncidents.map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                        <Badge variant="destructive" className="text-xs">
                          Rejected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Incident Details Modal */}
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Incident Details
              </DialogTitle>
              <DialogDescription>
                {selectedIncident?.id} - {selectedIncident?.category}
              </DialogDescription>
            </DialogHeader>
            
            {selectedIncident && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity} severity
                  </Badge>
                  <Badge variant={getStatusColor(selectedIncident.status)}>
                    {selectedIncident.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Incident Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium">Reported</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedIncident.reportedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Reporter</p>
                      <p className="text-muted-foreground">{selectedIncident.reportedBy}</p>
                    </div>
                  </div>

                  {selectedIncident.location && (
                    <div>
                      <p className="font-medium text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedIncident.location}</p>
                    </div>
                  )}

                  {selectedIncident.contactInfo && (
                    <div>
                      <p className="font-medium text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Contact Information
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedIncident.contactInfo}</p>
                    </div>
                  )}

                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">Victim Details</h4>
                    <div className="space-y-2 text-sm">
                      {selectedIncident.details.age && (
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="text-muted-foreground">{selectedIncident.details.age}</span>
                        </div>
                      )}
                      {selectedIncident.details.gender && (
                        <div className="flex justify-between">
                          <span>Gender:</span>
                          <span className="text-muted-foreground">{selectedIncident.details.gender}</span>
                        </div>
                      )}
                      {selectedIncident.details.relationship && (
                        <div className="flex justify-between">
                          <span>Relationship to Perpetrator:</span>
                          <span className="text-muted-foreground">{selectedIncident.details.relationship}</span>
                        </div>
                      )}
                      {selectedIncident.details.evidenceAttached && (
                        <div className="flex justify-between">
                          <span>Evidence Attached:</span>
                          <Badge variant="outline" className="text-xs">Yes</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedIncident.details.additionalInfo && (
                    <div>
                      <p className="font-medium text-sm">Additional Information</p>
                      <p className="text-sm text-muted-foreground">{selectedIncident.details.additionalInfo}</p>
                    </div>
                  )}
                </div>

                {selectedIncident.status !== "completed" && selectedIncident.status !== "rejected" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Select onValueChange={(value) => {
                      updateIncidentStatus(selectedIncident.id, value as IncidentStatus)
                      setSelectedIncident(null)
                    }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedIncident.status === "pending" && (
                          <SelectItem value="in-progress">Start Working</SelectItem>
                        )}
                        <SelectItem value="completed">Mark Complete</SelectItem>
                        <SelectItem value="rejected">Reject Incident</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}