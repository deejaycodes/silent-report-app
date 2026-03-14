import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ChevronRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import apiService from "@/lib/api"

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  on_hold: { label: 'On Hold', color: 'bg-gray-100 text-gray-700' },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
  referred: { label: 'Referred', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600' },
}

const URGENCY_MAP: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}

export default function History() {
  const navigate = useNavigate()

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => apiService.getAllReports() as Promise<any[]>,
    retry: 1,
  })

  return (
    <Layout className="pb-24">
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Your Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track the status of your submitted reports</p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-sm">Loading your reports...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Could not load reports. Reports are anonymous — if you didn't provide contact info, your reports won't appear here.</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/report-start")}>Submit a Report</Button>
          </div>
        )}

        {!isLoading && !error && reports?.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium">No Reports Yet</p>
            <p className="text-sm text-muted-foreground">Reports you submit will appear here</p>
            <Button size="sm" onClick={() => navigate("/report-start")}>Submit a Report</Button>
          </div>
        )}

        {!isLoading && reports && reports.length > 0 && (
          <div className="space-y-2">
            {reports.map((report: any) => {
              const status = STATUS_MAP[report.status] || { label: report.status, color: 'bg-gray-100 text-gray-600' }
              const urgency = report.ai_analysis?.urgency
              return (
                <button key={report._id || report.id} onClick={() => navigate(`/report/${report._id || report.id}`)}
                  className="w-full text-left p-4 border border-border rounded-xl hover:bg-accent/50 active:scale-[0.98] transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold line-clamp-1">
                      {report.ai_analysis?.classification || report.incident_type || 'Report'}
                    </p>
                    <Badge className={`text-[10px] flex-shrink-0 ${status.color}`}>{status.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {report.location && <span>📍 {report.location}</span>}
                      {urgency && <Badge className={`text-[10px] ${URGENCY_MAP[urgency] || ''}`}>{urgency}</Badge>}
                    </div>
                    <span>{new Date(report.created_at || report.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Privacy */}
        <p className="text-[11px] text-muted-foreground text-center px-4">
          Your data is confidential and encrypted. Anonymous reports cannot be linked back to you.
        </p>
      </div>
      <Navigation />
    </Layout>
  )
}
