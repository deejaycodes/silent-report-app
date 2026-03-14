import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Send, Loader2, MessageCircle, Shield, Clock, CheckCircle2, AlertCircle, FileSearch } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import apiService from "@/lib/api"

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'text-blue-600', icon: Clock },
  pending_review: { label: 'Pending Review', color: 'text-amber-600', icon: FileSearch },
  under_review: { label: 'Under Review', color: 'text-yellow-600', icon: FileSearch },
  active: { label: 'Active', color: 'text-green-600', icon: CheckCircle2 },
  on_hold: { label: 'On Hold', color: 'text-orange-600', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'text-emerald-600', icon: CheckCircle2 },
  referred: { label: 'Referred', color: 'text-purple-600', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'text-gray-500', icon: CheckCircle2 },
}

const capitalize = (s: string) => s?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || ''

export default function TrackReport() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [trackingId, setTrackingId] = useState("")
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const lookup = async () => {
    if (!trackingId.trim()) return
    setLoading(true)
    try {
      const data = await apiService.trackReport(trackingId.trim())
      setReport(data)
    } catch {
      toast({ title: "Not found", description: "Check your tracking ID and try again.", variant: "destructive", duration: 3000 })
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const sendMsg = async () => {
    if (!message.trim()) return
    setSending(true)
    try {
      await apiService.sendTrackingMessage(report.tracking_code || report.id, message.trim())
      setMessage("")
      const data = await apiService.trackReport(report.tracking_code || report.id)
      setReport(data)
      toast({ title: "Message sent", duration: 2000 })
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const statusCfg = STATUS_CONFIG[report?.status] || { label: capitalize(report?.status), color: 'text-gray-600', icon: Clock }
  const StatusIcon = statusCfg.icon

  return (
    <Layout className="pb-24">
      <div className="px-5 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-lg hover:bg-accent"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-xl font-bold">Track Report</h1>
        </div>

        {/* Lookup */}
        {!report && (
          <div className="space-y-4">
            <p className="text-base text-foreground/60">Enter the tracking ID you received when you submitted your report.</p>
            <Input placeholder="e.g. SV-A3K9M2" value={trackingId} onChange={e => setTrackingId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()} className="font-mono text-base h-12" />
            <Button onClick={lookup} disabled={loading || !trackingId.trim()} className="w-full h-12 text-base font-semibold">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Looking up...</> : <><Search className="h-4 w-4 mr-2" />Find My Report</>}
            </Button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /><span>No login required. Your identity stays anonymous.</span>
            </div>
          </div>
        )}

        {/* Report found */}
        {report && (
          <div className="space-y-6">
            {/* Status header */}
            <div className="bg-card rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center`}>
                  <StatusIcon className={`h-5 w-5 ${statusCfg.color}`} />
                </div>
                <div>
                  <p className="text-base font-semibold">{capitalize(report.incident_type)}</p>
                  <p className={`text-sm font-medium ${statusCfg.color}`}>{statusCfg.label}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/50">Submitted {new Date(report.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <button onClick={() => { setReport(null); setTrackingId("") }} className="text-sm text-primary mt-2 inline-block">← Track a different report</button>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Timeline
              </h2>
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                <div className="space-y-5">
                  {/* Report created — always first */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-primary bg-primary/20" />
                    <p className="text-sm font-medium text-foreground">Report submitted</p>
                    <p className="text-sm text-foreground/50">{new Date(report.created_at).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  {/* Messages as timeline events */}
                  {report.messages?.map((msg: any) => (
                    <div key={msg.id} className="relative">
                      <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                        msg.type === 'caseworker_reply' ? 'border-emerald-500 bg-emerald-100' : 'border-blue-400 bg-blue-100'
                      }`} />
                      <div>
                        <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-0.5">
                          {msg.type === 'caseworker_reply' ? 'Case Worker' : 'You'}
                        </p>
                        <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                          msg.type === 'caseworker_reply' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-foreground' : 'bg-primary/5 text-foreground'
                        }`}>
                          {msg.content}
                        </div>
                        <p className="text-xs text-foreground/40 mt-1">
                          {new Date(msg.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Status update if changed */}
                  {report.status !== 'submitted' && (
                    <div className="relative">
                      <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-amber-400 bg-amber-100`} />
                      <p className="text-sm font-medium text-foreground">Status changed to <span className={statusCfg.color}>{statusCfg.label}</span></p>
                      <p className="text-sm text-foreground/50">{new Date(report.updated_at).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  )}

                  {/* No activity yet */}
                  {report.messages?.length === 0 && report.status === 'submitted' && (
                    <div className="relative">
                      <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-border bg-muted" />
                      <p className="text-sm text-foreground/40 italic">Waiting for a case worker to review your report...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Send message */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Send a Message
              </h2>
              <Textarea placeholder="Add more information or ask a question..." value={message}
                onChange={e => setMessage(e.target.value)} rows={3} maxLength={2000} className="resize-none text-sm" />
              <Button onClick={sendMsg} disabled={sending || !message.trim()} className="w-full h-11">
                {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : <><Send className="h-4 w-4 mr-2" />Send Message</>}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Navigation />
    </Layout>
  )
}
