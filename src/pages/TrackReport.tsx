import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Send, Loader2, MessageCircle, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import apiService from "@/lib/api"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700' },
  referred: { label: 'Referred', color: 'bg-purple-100 text-purple-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600' },
}

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
      toast({ title: "Not found", description: "Check your tracking ID and try again.", variant: "destructive" })
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const sendMsg = async () => {
    if (!message.trim()) return
    setSending(true)
    try {
      await apiService.sendTrackingMessage(report.id, message.trim())
      setMessage("")
      const data = await apiService.trackReport(report.id)
      setReport(data)
      toast({ title: "Message sent" })
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const status = STATUS_LABELS[report?.status] || { label: report?.status, color: 'bg-gray-100 text-gray-600' }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-accent"><ArrowLeft className="h-5 w-5" /></button>
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
          <div className="space-y-5">
            {/* Status card */}
            <div className="border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{report.incident_type}</p>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Submitted {new Date(report.created_at).toLocaleDateString()}</span>
                <span>Updated {new Date(report.updated_at).toLocaleDateString()}</span>
              </div>
              <button onClick={() => { setReport(null); setTrackingId("") }} className="text-xs text-primary">← Look up a different report</button>
            </div>

            {/* Messages */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />Messages
              </h2>

              {report.messages?.length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">No messages yet. You can send additional information or ask a question below.</p>
              )}

              {report.messages?.map((msg: any) => (
                <div key={msg.id} className={`p-3 rounded-xl text-sm ${
                  msg.type === 'reporter_message'
                    ? 'bg-primary/10 ml-8'
                    : 'bg-muted mr-8'
                }`}>
                  <p className="text-[11px] font-medium mb-1 text-muted-foreground">
                    {msg.type === 'reporter_message' ? 'You' : 'Case Worker'}
                  </p>
                  <p>{msg.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Send message */}
            <div className="space-y-2">
              <Textarea placeholder="Add more information or ask a question..." value={message}
                onChange={e => setMessage(e.target.value)} rows={3} maxLength={2000} className="resize-none text-sm" />
              <Button onClick={sendMsg} disabled={sending || !message.trim()} className="w-full">
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
