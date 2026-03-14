import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Scale, Shield, Heart, FileText, Loader2, ExternalLink, ArrowLeft } from "lucide-react"
import { NIGERIAN_STATES } from "@/lib/nigerian-locations"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface NgoResource {
  id: string; name: string; state: string; city?: string; address?: string;
  phone?: string; email?: string; services: string[]; incidentTypes: string[];
}

const NATIONAL_RESOURCES = [
  { name: 'NAPTIP (Trafficking & Abuse)', phone: '0800-0000-0001', hours: '24/7', desc: 'National Agency for the Prohibition of Trafficking in Persons', services: ['Trafficking', 'Child Abuse', 'FGM'] },
  { name: 'Nigeria Police Emergency', phone: '112', hours: '24/7', desc: 'National emergency line for immediate danger', services: ['Emergency'] },
  { name: 'FIDA Nigeria (Legal Aid)', phone: '+234-1-460-2089', hours: 'Mon–Fri 9AM–5PM', desc: 'Free legal aid for women and children', services: ['Legal Aid', 'Court Support'] },
  { name: 'Child Helpline', phone: '0800-2255-4453', hours: '24/7', desc: 'Toll-free helpline for child abuse reporting', services: ['Child Protection'] },
  { name: 'Lagos DSVRT', phone: '0800-0000-0341', hours: '24/7', desc: 'Lagos Domestic & Sexual Violence Response Team', services: ['Counseling', 'Legal Aid', 'Medical'] },
]

const rightsData = [
  { icon: FileText, title: 'FGM is Illegal', items: ['VAPP Act 2015 criminalizes FGM', 'Up to 4 years in prison for perpetrators', "Illegal even for 'cultural reasons'", 'You can refuse FGM for yourself or your daughter'] },
  { icon: Shield, title: 'Domestic Violence is a Crime', items: ['Physical, emotional, sexual abuse are illegal', 'You can get a protection order', 'Police must respond to DV calls', "You don't need to be married"] },
  { icon: Heart, title: 'Your Rights as a Survivor', items: ['Free medical care after assault', 'Free legal aid available', 'Report without giving your name', 'Right to a safe shelter'] },
  { icon: Shield, title: 'Child Labour & Protection', items: ['Child labour is illegal (Child Rights Act)', 'Children under 12 cannot work at all', 'Children must attend school', 'Report to NAPTIP or child protection services'] },
]

const safetyPlan = [
  { title: '1. Safe Places', items: ["Friend or family member's house", 'A shelter or safe house', 'Police station, hospital, church/mosque'] },
  { title: '2. Important Documents', items: ['ID card or passport', "Children's birth certificates", 'Bank account info', 'Medical records, photos of injuries'] },
  { title: '3. Emergency Bag', items: ['Change of clothes', 'Money or ATM card', 'Phone charger, medications', 'Important phone numbers written down'] },
  { title: '4. If Violence Starts', items: ['Move to a room with an exit', 'Avoid kitchen/bathroom (weapons)', 'Protect your head and face', 'Call for help when safe, leave ASAP'] },
]

export default function Resources() {
  const navigate = useNavigate()
  const [selectedState, setSelectedState] = useState("")
  const [ngos, setNgos] = useState<NgoResource[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedState) { setNgos([]); return }
    setLoading(true)
    fetch(`${API_BASE}/resources/ngos?state=${encodeURIComponent(selectedState)}`)
      .then(r => r.json())
      .then(data => setNgos(Array.isArray(data) ? data : []))
      .catch(() => setNgos([]))
      .finally(() => setLoading(false))
  }, [selectedState])

  const openDirections = (address: string, state: string) => {
    const q = encodeURIComponent(`${address || ''} ${state}, Nigeria`.trim())
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank')
  }

  return (
    <Layout className="pb-24">
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Resources & Support</h1>
            <p className="text-sm text-muted-foreground">Find help, learn your rights, plan for safety</p>
          </div>
        </div>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="find" className="text-xs"><MapPin className="h-3.5 w-3.5 mr-1" />Find Help</TabsTrigger>
            <TabsTrigger value="rights" className="text-xs"><Scale className="h-3.5 w-3.5 mr-1" />Rights</TabsTrigger>
            <TabsTrigger value="safety" className="text-xs"><Shield className="h-3.5 w-3.5 mr-1" />Safety Plan</TabsTrigger>
          </TabsList>

          {/* FIND HELP */}
          <TabsContent value="find" className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Select your state to find nearby support</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger><SelectValue placeholder="Choose a state..." /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Your selection stays on your device — never tracked
              </p>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Finding support near you...</span>
              </div>
            )}

            {!loading && selectedState && ngos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organizations in {selectedState}</h3>
                {ngos.map(ngo => (
                  <div key={ngo.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold">{ngo.name}</p>
                      {ngo.city && <p className="text-xs text-muted-foreground">{ngo.city}, {ngo.state}</p>}
                    </div>
                    {ngo.services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ngo.services.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                      </div>
                    )}
                    {ngo.address && <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" />{ngo.address}</p>}
                    <div className="flex gap-2">
                      {ngo.phone && (
                        <a href={`tel:${ngo.phone.replace(/\s/g, '')}`} className="flex-1">
                          <Button variant="default" size="sm" className="w-full"><Phone className="h-3.5 w-3.5 mr-1" />Call</Button>
                        </a>
                      )}
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openDirections(ngo.address || '', ngo.state)}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />Directions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && selectedState && ngos.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No registered organizations found in {selectedState} yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Try the national helplines below.</p>
              </div>
            )}

            {/* National — always visible */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">National Helplines</h3>
              {NATIONAL_RESOURCES.map(r => (
                <div key={r.name} className="border border-border rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.services.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{r.hours}</span>
                  <a href={`tel:${r.phone.replace(/[\s-]/g, '')}`}>
                    <Button variant="default" size="sm" className="w-full mt-1"><Phone className="h-3.5 w-3.5 mr-1" />{r.phone}</Button>
                  </a>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Emergency?</p>
              <div className="flex gap-2">
                <a href="tel:199" className="flex-1"><Button variant="destructive" size="sm" className="w-full">Call 199</Button></a>
                <a href="tel:112" className="flex-1"><Button variant="destructive" size="sm" className="w-full">Call 112</Button></a>
              </div>
            </div>
          </TabsContent>

          {/* RIGHTS */}
          <TabsContent value="rights" className="space-y-4 mt-4">
            {rightsData.map(section => (
              <div key={section.title} className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <section.icon className="h-4 w-4 text-primary" />{section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary mt-0.5">•</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="p-3 bg-muted rounded-xl">
              <p className="text-xs font-medium mb-1">Need Legal Help?</p>
              <p className="text-[11px] text-muted-foreground">Free legal aid through FIDA, Legal Aid Council, and other organizations.</p>
            </div>
          </TabsContent>

          {/* SAFETY PLAN */}
          <TabsContent value="safety" className="space-y-4 mt-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-xs text-amber-800 dark:text-amber-200">⚠️ Don't save this on a device your abuser can access</p>
            </div>
            {safetyPlan.map(section => (
              <div key={section.title} className="border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item} className="text-xs text-muted-foreground flex gap-2"><span className="text-primary mt-0.5">•</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Your safety comes first</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">The most dangerous time is when leaving. Plan carefully and get professional help.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </Layout>
  )
}
