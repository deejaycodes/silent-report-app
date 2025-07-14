import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  Building2,
  LogOut,
  Settings,
  Edit,
  ChevronDown
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showSettings, setShowSettings] = useState(false)
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

  // Admin settings state
  const [adminSettings, setAdminSettings] = useState({
    ngoName: "Hope Foundation",
    adminName: "Sarah Johnson",
    email: "admin@hopefoundation.org",
    phone: "+234 801 234 5678",
    registrationNumber: "NGO/REG/2020/001"
  })

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

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been safely logged out of your admin account.",
    })
    navigate("/")
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Changes submitted",
      description: "Please check your email to confirm the changes made to your profile.",
    })
    setShowSettings(false)
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
      <div className="px-3 py-4 space-y-4 max-w-screen-sm mx-auto">
        {/* Header with Welcome Message */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{adminSettings.ngoName}</h1>
              <p className="text-sm text-muted-foreground">NGO Admin Dashboard</p>
            </div>
            
            {/* User Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{adminSettings.adminName}</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg font-bold">{totalIncidents}</p>
                  <p className="text-xs text-muted-foreground truncate">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-soft">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg font-bold">{pendingIncidents.length}</p>
                  <p className="text-xs text-muted-foreground truncate">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg font-bold">{inProgressIncidents.length}</p>
                  <p className="text-xs text-muted-foreground truncate">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-lg font-bold">{completedIncidents.length}</p>
                  <p className="text-xs text-muted-foreground truncate">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Pending Incident */}
        {latestPending && (
          <Card className="border-0 shadow-comfort bg-gradient-calm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Latest Pending
              </CardTitle>
              <CardDescription className="text-sm">Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="font-semibold text-base flex-1 min-w-0">{latestPending.title}</h3>
                  <Badge variant={getSeverityColor(latestPending.severity)} className="text-xs">
                    {latestPending.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{latestPending.description}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(latestPending.reportedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{latestPending.location}</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="trust" 
                  size="sm"
                  onClick={() => setSelectedIncident(latestPending)}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateIncidentStatus(latestPending.id, "in-progress")}
                  className="flex-1"
                >
                  Start Working
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Incidents Management */}
        <Tabs defaultValue="all" className="space-y-3">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs py-2">Pending</TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs py-2">Progress</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2">Done</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs py-2">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <h3 className="font-medium text-sm flex-1 min-w-0 truncate">{incident.title}</h3>
                          <div className="flex gap-1">
                            <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                              {incident.severity}
                            </Badge>
                            <Badge variant={getStatusColor(incident.status)} className="text-xs">
                              {incident.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <span>ID: {incident.id}</span>
                          <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                          <span className="truncate">{incident.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIncident(incident)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      {incident.status === "pending" && (
                        <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                          <SelectTrigger className="flex-1 h-8 text-xs">
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
                          <SelectTrigger className="flex-1 h-8 text-xs">
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

          <TabsContent value="pending" className="space-y-2">
            {pendingIncidents.map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-medium text-sm flex-1 min-w-0">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIncident(incident)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                        <SelectTrigger className="flex-1 h-8 text-xs">
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

          <TabsContent value="in-progress" className="space-y-2">
            {incidents.filter(i => i.status === "in-progress").map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-medium text-sm flex-1 min-w-0">{incident.title}</h3>
                        <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIncident(incident)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Select onValueChange={(value) => updateIncidentStatus(incident.id, value as IncidentStatus)}>
                        <SelectTrigger className="flex-1 h-8 text-xs">
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

          <TabsContent value="completed" className="space-y-2">
            {incidents.filter(i => i.status === "completed").map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-medium text-sm flex-1 min-w-0">{incident.title}</h3>
                        <div className="flex gap-1">
                          <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                            {incident.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Completed
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-2">
            {rejectedIncidents.map((incident) => (
              <Card key={incident.id} className="border-0 shadow-soft">
                <CardContent className="p-3">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-medium text-sm flex-1 min-w-0">{incident.title}</h3>
                        <div className="flex gap-1">
                          <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                            {incident.severity}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            Rejected
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>ID: {incident.id}</span>
                        <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedIncident(incident)}
                      className="w-full"
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
          <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {selectedIncident && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5" />
                        Incident #{selectedIncident.id}
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        Complete incident details and case information
                      </DialogDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={getSeverityColor(selectedIncident.severity)} className="text-xs">
                        {selectedIncident.severity.toUpperCase()} PRIORITY
                      </Badge>
                      <Badge variant={getStatusColor(selectedIncident.status)} className="text-xs">
                        {selectedIncident.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>

                {/* Title & Description */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg">{selectedIncident.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedIncident.description}</p>
                </div>

                {/* Case Information Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Case Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-muted-foreground">Category</span>
                        <span className="font-semibold">{selectedIncident.category}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-muted-foreground">Case ID</span>
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{selectedIncident.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Location */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Contact & Location
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-muted-foreground">Date & Time</span>
                        <span>{new Date(selectedIncident.reportedAt).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedIncident.reportedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {selectedIncident.location && (
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-muted-foreground">Location</span>
                          <span>{selectedIncident.location}</span>
                        </div>
                      )}
                      
                      {selectedIncident.contactInfo && (
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-muted-foreground">Contact Information</span>
                          <span>{selectedIncident.contactInfo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Victim/Subject Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Subject Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {selectedIncident.details.age && (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-muted-foreground">Age</span>
                        <span>{selectedIncident.details.age} years old</span>
                      </div>
                    )}
                    {selectedIncident.details.gender && (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-muted-foreground">Gender</span>
                        <span>{selectedIncident.details.gender}</span>
                      </div>
                    )}
                    {selectedIncident.details.relationship && (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-muted-foreground">Relationship to Perpetrator</span>
                        <span>{selectedIncident.details.relationship}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-muted-foreground">Evidence</span>
                      <div>
                        {selectedIncident.details.evidenceAttached ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Attached
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            None
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedIncident.details.additionalInfo && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">Additional Information</h4>
                    <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                      <p className="text-sm leading-relaxed">{selectedIncident.details.additionalInfo}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t">
                  {selectedIncident.status !== "completed" && selectedIncident.status !== "rejected" ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base">Case Actions</h4>
                      <div className="grid gap-2">
                        {selectedIncident.status === "pending" && (
                          <Button 
                            variant="trust" 
                            className="w-full"
                            onClick={() => {
                              updateIncidentStatus(selectedIncident.id, "in-progress")
                              setSelectedIncident(null)
                            }}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Start Working on Case
                          </Button>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              updateIncidentStatus(selectedIncident.id, "completed")
                              setSelectedIncident(null)
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={() => {
                              updateIncidentStatus(selectedIncident.id, "rejected")
                              setSelectedIncident(null)
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Case
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Badge variant={getStatusColor(selectedIncident.status)} className="text-sm px-4 py-2">
                        Case {selectedIncident.status === "completed" ? "Completed" : "Rejected"}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Settings Modal */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile
              </DialogTitle>
              <DialogDescription>
                Update your personal and organization details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-ngo-name">Organization Name</Label>
                <Input
                  id="settings-ngo-name"
                  value={adminSettings.ngoName}
                  onChange={(e) => setAdminSettings({...adminSettings, ngoName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-admin-name">Admin Name</Label>
                <Input
                  id="settings-admin-name"
                  value={adminSettings.adminName}
                  onChange={(e) => setAdminSettings({...adminSettings, adminName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-email">Organization Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={adminSettings.email}
                  onChange={(e) => setAdminSettings({...adminSettings, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-phone">Contact Phone</Label>
                <Input
                  id="settings-phone"
                  type="tel"
                  value={adminSettings.phone}
                  onChange={(e) => setAdminSettings({...adminSettings, phone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-reg-number">Registration Number</Label>
                <Input
                  id="settings-reg-number"
                  value={adminSettings.registrationNumber}
                  onChange={(e) => setAdminSettings({...adminSettings, registrationNumber: e.target.value})}
                  required
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" variant="trust" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowSettings(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}