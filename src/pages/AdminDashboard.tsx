import { useState, useEffect } from "react"
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
  AlertTriangle, Clock, CheckCircle, XCircle, FileText, 
  TrendingUp, Calendar, MapPin, User, Building2, LogOut, 
  Settings, Edit, ChevronDown, Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import apiService from "@/lib/api"

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type IncidentStatus = "pending" | "in-progress" | "completed" | "rejected"

interface Incident {
  id: string
  title: string
  description: string
  category: string
  severity: string
  status: IncidentStatus
  reportedAt: string
  location?: string
  files?: string[]
  aiAnalysis?: { urgency?: string; classification?: string; recommended_actions?: string[] }
}

function mapBackendStatus(s: string): IncidentStatus {
  if (s === 'submitted') return 'pending'
  if (s === 'accepted' || s === 'in progress') return 'in-progress'
  if (s === 'resolved') return 'completed'
  if (s === 'rejected') return 'rejected'
  return 'pending'
}

function mapDisplayToBackend(s: string): string {
  if (s === 'in-progress') return 'accepted'
  if (s === 'completed') return 'resolved'
  if (s === 'rejected') return 'rejected'
  return s
}

function mapSeverity(urgency?: string): string {
  if (urgency === 'urgent') return 'critical'
  if (urgency === 'moderate') return 'medium'
  if (urgency === 'low') return 'low'
  return 'medium'
}

function mapReport(r: any): Incident {
  return {
    id: r._id,
    title: r.ai_analysis?.classification || r.incident_type || 'Incident Report',
    description: r.description,
    category: r.incident_type || 'Unknown',
    severity: mapSeverity(r.ai_analysis?.urgency),
    status: mapBackendStatus(r.status),
    reportedAt: r.created_at || r.createdAt,
    location: r.location,
    files: r.files,
    aiAnalysis: r.ai_analysis,
  }
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  const stored = localStorage.getItem('user')
  const userData = stored ? JSON.parse(stored) : {}

  const [adminSettings, setAdminSettings] = useState({
    ngoName: userData.ngo || "My Organization",
    adminName: userData.admin_name || "Admin",
    email: userData.email || "",
    phone: userData.admin_phone || "",
  })

  useEffect(() => {
    apiService.getAllReports()
      .then((data: any) => {
        const arr = Array.isArray(data) ? data : []
        setIncidents(arr.map(mapReport))
      })
      .catch(() => {
        toast({ title: "Failed to load reports", variant: "destructive" })
      })
      .finally(() => setLoading(false))
  }, [])

  const updateIncidentStatus = async (incidentId: string, newStatus: IncidentStatus) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE_URL}/reports/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: mapDisplayToBackend(newStatus) }),
      })
      if (!res.ok) throw new Error('Update failed')
      setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: newStatus } : i))
      toast({ title: "Status Updated", description: `Report status changed to ${newStatus}` })
    } catch {
      toast({ title: "Update failed", description: "Could not update report status.", variant: "destructive" })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    apiService.setToken(null)
    toast({ title: "Logged out successfully" })
    navigate("/")
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE_URL}/ngo/update-ngo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ngo_name: adminSettings.ngoName,
          admin_name: adminSettings.adminName,
        }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Profile updated" })
      setShowSettings(false)
    } catch {
      toast({ title: "Update failed", variant: "destructive" })
    }
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical' || severity === 'high') return "destructive" as const
    if (severity === 'medium') return "secondary" as const
    return "outline" as const
  }

  const getStatusColor = (status: IncidentStatus) => {
    if (status === 'pending') return "secondary" as const
    if (status === 'in-progress') return "default" as const
    if (status === 'completed') return "outline" as const
    if (status === 'rejected') return "destructive" as const
    return "outline" as const
  }

  const pendingIncidents = incidents.filter(i => i.status === "pending")
  const inProgressIncidents = incidents.filter(i => i.status === "in-progress")
  const completedIncidents = incidents.filter(i => i.status === "completed")
  const rejectedIncidents = incidents.filter(i => i.status === "rejected")
  const latestPending = pendingIncidents[0]

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    )
  }

  const renderIncidentCard = (incident: Incident, showActions = true) => (
    <Card key={incident.id} className="border-0 shadow-soft">
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="font-medium text-sm flex-1 min-w-0 truncate">{incident.title}</h3>
              <div className="flex gap-1">
                <Badge variant={getSeverityColor(incident.severity)} className="text-xs">{incident.severity}</Badge>
                <Badge variant={getStatusColor(incident.status)} className="text-xs">{incident.status}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>{new Date(incident.reportedAt).toLocaleDateString()}</span>
              {incident.location && <span className="truncate">{incident.location}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)} className="flex-1">View</Button>
            {showActions && (incident.status === "pending" || incident.status === "in-progress") && (
              <Select onValueChange={(v) => updateIncidentStatus(incident.id, v as IncidentStatus)}>
                <SelectTrigger className="flex-1 h-8 text-xs"><SelectValue placeholder="Update" /></SelectTrigger>
                <SelectContent>
                  {incident.status === "pending" && <SelectItem value="in-progress">Start</SelectItem>}
                  <SelectItem value="completed">Complete</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      <div className="px-3 py-4 space-y-4 max-w-screen-sm mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{adminSettings.ngoName}</h1>
              <p className="text-sm text-muted-foreground">NGO Admin Dashboard</p>
            </div>
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
                  <Settings className="h-4 w-4 mr-2" />Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-0 shadow-soft"><CardContent className="p-3"><div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
            <div><p className="text-lg font-bold">{incidents.length}</p><p className="text-xs text-muted-foreground">Total Reports</p></div>
          </div></CardContent></Card>
          <Card className="border-0 shadow-soft"><CardContent className="p-3"><div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div><p className="text-lg font-bold">{pendingIncidents.length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </div></CardContent></Card>
          <Card className="border-0 shadow-soft"><CardContent className="p-3"><div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div><p className="text-lg font-bold">{inProgressIncidents.length}</p><p className="text-xs text-muted-foreground">In Progress</p></div>
          </div></CardContent></Card>
          <Card className="border-0 shadow-soft"><CardContent className="p-3"><div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div><p className="text-lg font-bold">{completedIncidents.length}</p><p className="text-xs text-muted-foreground">Completed</p></div>
          </div></CardContent></Card>
        </div>

        {/* Latest Pending */}
        {latestPending && (
          <Card className="border-0 shadow-comfort bg-gradient-calm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-4 w-4 text-amber-500" />Latest Pending
              </CardTitle>
              <CardDescription className="text-sm">Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="font-semibold text-base flex-1 min-w-0">{latestPending.title}</h3>
                  <Badge variant={getSeverityColor(latestPending.severity)} className="text-xs">{latestPending.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{latestPending.description}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(latestPending.reportedAt).toLocaleDateString()}</span>
                  {latestPending.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span className="truncate">{latestPending.location}</span></span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="trust" size="sm" onClick={() => setSelectedIncident(latestPending)} className="flex-1">View Details</Button>
                <Button variant="outline" size="sm" onClick={() => updateIncidentStatus(latestPending.id, "in-progress")} className="flex-1">Start Working</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-3">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs py-2">Pending</TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs py-2">Progress</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs py-2">Done</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs py-2">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-2">{incidents.map(i => renderIncidentCard(i))}</TabsContent>
          <TabsContent value="pending" className="space-y-2">{pendingIncidents.map(i => renderIncidentCard(i))}</TabsContent>
          <TabsContent value="in-progress" className="space-y-2">{inProgressIncidents.map(i => renderIncidentCard(i))}</TabsContent>
          <TabsContent value="completed" className="space-y-2">{completedIncidents.map(i => renderIncidentCard(i, false))}</TabsContent>
          <TabsContent value="rejected" className="space-y-2">{rejectedIncidents.map(i => renderIncidentCard(i, false))}</TabsContent>
        </Tabs>

        {/* Incident Detail Modal */}
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {selectedIncident && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5" />Report Details
                      </DialogTitle>
                      <DialogDescription className="text-base">Complete incident details</DialogDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={getSeverityColor(selectedIncident.severity)} className="text-xs">{selectedIncident.severity.toUpperCase()} PRIORITY</Badge>
                      <Badge variant={getStatusColor(selectedIncident.status)} className="text-xs">{selectedIncident.status.replace('-', ' ').toUpperCase()}</Badge>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg">{selectedIncident.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedIncident.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base flex items-center gap-2"><Building2 className="h-4 w-4" />Case Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col gap-1"><span className="font-medium text-muted-foreground">Category</span><span className="font-semibold">{selectedIncident.category}</span></div>
                      <div className="flex flex-col gap-1"><span className="font-medium text-muted-foreground">Date</span><span>{new Date(selectedIncident.reportedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                      {selectedIncident.location && <div className="flex flex-col gap-1"><span className="font-medium text-muted-foreground">Location</span><span>{selectedIncident.location}</span></div>}
                    </div>
                  </div>

                  {selectedIncident.aiAnalysis && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" />AI Analysis</h4>
                      <div className="space-y-3 text-sm">
                        {selectedIncident.aiAnalysis.urgency && <div className="flex flex-col gap-1"><span className="font-medium text-muted-foreground">Urgency</span><Badge variant={getSeverityColor(mapSeverity(selectedIncident.aiAnalysis.urgency))} className="w-fit text-xs">{selectedIncident.aiAnalysis.urgency}</Badge></div>}
                        {selectedIncident.aiAnalysis.classification && <div className="flex flex-col gap-1"><span className="font-medium text-muted-foreground">Classification</span><span>{selectedIncident.aiAnalysis.classification}</span></div>}
                        {selectedIncident.aiAnalysis.recommended_actions && selectedIncident.aiAnalysis.recommended_actions.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-muted-foreground">Recommended Actions</span>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedIncident.aiAnalysis.recommended_actions.map((a, i) => <li key={i} className="text-xs">{a}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedIncident.files && selectedIncident.files.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-base">Attached Evidence</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedIncident.files.map((f, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />File {i + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t">
                  {(selectedIncident.status === "pending" || selectedIncident.status === "in-progress") ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base">Case Actions</h4>
                      <div className="grid gap-2">
                        {selectedIncident.status === "pending" && (
                          <Button variant="trust" className="w-full" onClick={() => { updateIncidentStatus(selectedIncident.id, "in-progress"); setSelectedIncident(null) }}>
                            <TrendingUp className="h-4 w-4 mr-2" />Start Working on Case
                          </Button>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="w-full" onClick={() => { updateIncidentStatus(selectedIncident.id, "completed"); setSelectedIncident(null) }}>
                            <CheckCircle className="h-4 w-4 mr-2" />Mark Complete
                          </Button>
                          <Button variant="destructive" className="w-full" onClick={() => { updateIncidentStatus(selectedIncident.id, "rejected"); setSelectedIncident(null) }}>
                            <XCircle className="h-4 w-4 mr-2" />Reject Case
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
              <DialogTitle className="flex items-center gap-2"><User className="h-5 w-5" />Edit Profile</DialogTitle>
              <DialogDescription>Update your personal and organization details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-ngo-name">Organization Name</Label>
                <Input id="settings-ngo-name" value={adminSettings.ngoName} onChange={(e) => setAdminSettings({...adminSettings, ngoName: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-admin-name">Admin Name</Label>
                <Input id="settings-admin-name" value={adminSettings.adminName} onChange={(e) => setAdminSettings({...adminSettings, adminName: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Organization Email</Label>
                <Input id="settings-email" type="email" value={adminSettings.email} onChange={(e) => setAdminSettings({...adminSettings, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-phone">Contact Phone</Label>
                <Input id="settings-phone" type="tel" value={adminSettings.phone} onChange={(e) => setAdminSettings({...adminSettings, phone: e.target.value})} required />
              </div>
              <Separator />
              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" variant="trust" className="w-full"><Edit className="h-4 w-4 mr-2" />Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setShowSettings(false)} className="w-full">Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
