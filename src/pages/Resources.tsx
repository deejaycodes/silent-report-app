import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Scale, Shield, Heart, FileText, Loader2, ExternalLink, ArrowLeft, Navigation2 } from "lucide-react"
import { NIGERIAN_STATES } from "@/lib/nigerian-locations"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface NgoResource {
  id: string; name: string; state: string; city?: string; address?: string;
  phone?: string; email?: string; services: string[]; incidentTypes: string[];
}

const NATIONAL_RESOURCES = [
  { name: 'NAPTIP', phone: '0800-0000-0001', hours: '24/7', desc: 'Trafficking, child abuse & FGM cases' },
  { name: 'Police Emergency', phone: '112', hours: '24/7', desc: 'Immediate danger — police & ambulance' },
  { name: 'FIDA Legal Aid', phone: '+234-1-460-2089', hours: 'Mon–Fri 9AM–5PM', desc: 'Free legal help for women & children' },
  { name: 'Child Helpline', phone: '0800-2255-4453', hours: '24/7', desc: 'Report child abuse — toll free' },
  { name: 'Lagos DSVRT', phone: '0800-0000-0341', hours: '24/7', desc: 'Domestic & sexual violence response' },
]

const rightsData = [
  { icon: FileText, title: 'FGM is Illegal', items: ['VAPP Act 2015 criminalizes FGM', 'Up to 4 years imprisonment for perpetrators', "Illegal even for 'cultural reasons'", 'You can refuse FGM for yourself or your daughter'] },
  { icon: Shield, title: 'Domestic Violence is a Crime', items: ['Physical, emotional and sexual abuse are all illegal', 'You can get a protection order from the court', 'Police are required to respond to DV calls', "You don't need to be married to be protected"] },
  { icon: Heart, title: 'Your Rights as a Survivor', items: ['Free medical care after an assault', 'Free legal aid is available to you', 'You can report without giving your name', 'You have the right to a safe shelter'] },
  { icon: Shield, title: 'Child Protection', items: ['Child labour is illegal under the Child Rights Act', 'Children under 12 cannot work at all', 'Every child has the right to attend school', 'Report violations to NAPTIP or child protection services'] },
]

const safetyPlan = [
  { title: 'Safe Places', items: ["A trusted friend or family member's house", 'A shelter or safe house near you', 'Police station, hospital, church or mosque'] },
  { title: 'Important Documents', items: ['ID card or passport', "Children's birth certificates", 'Bank account information', 'Medical records and photos of injuries'] },
  { title: 'Emergency Bag', items: ['Change of clothes for you and children', 'Money or ATM card', 'Phone charger and medications', 'Important phone numbers written down'] },
  { title: 'If Violence Starts', items: ['Move to a room with an exit — avoid being trapped', 'Stay away from kitchen and bathroom (potential weapons)', 'Protect your head and face', 'Call for help when safe and leave as soon as possible'] },
]

export default function Resources() {
  const navigate = useNavigate()
  const [selectedState, setSelectedState] = useState("")
  const [ngos, setNgos] = useState<NgoResource[]>([])
  const [loading, setLoading] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const requestLocation = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => { setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoLoading(false) },
      () => setGeoLoading(false),
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }

  const STATE_COORDS: Record<string, [number, number]> = {
    'Abia': [5.45, 7.52], 'Adamawa': [9.33, 12.5], 'Akwa Ibom': [5.01, 7.85], 'Anambra': [6.21, 6.94],
    'Bauchi': [10.31, 9.84], 'Bayelsa': [4.77, 6.07], 'Benue': [7.34, 8.77], 'Borno': [11.85, 13.15],
    'Cross River': [5.87, 8.6], 'Delta': [5.53, 5.9], 'Ebonyi': [6.26, 8.09], 'Edo': [6.63, 5.93],
    'Ekiti': [7.72, 5.31], 'Enugu': [6.44, 7.5], 'FCT': [9.06, 7.49], 'Gombe': [10.29, 11.17],
    'Imo': [5.57, 7.06], 'Jigawa': [12.23, 9.56], 'Kaduna': [10.52, 7.43], 'Kano': [12.0, 8.52],
    'Katsina': [13.0, 7.6], 'Kebbi': [12.45, 4.2], 'Kogi': [7.73, 6.69], 'Kwara': [8.97, 4.96],
    'Lagos': [6.52, 3.38], 'Nasarawa': [8.54, 8.52], 'Niger': [9.93, 5.6], 'Ogun': [7.16, 3.35],
    'Ondo': [7.25, 5.19], 'Osun': [7.56, 4.52], 'Oyo': [7.84, 3.93], 'Plateau': [9.22, 9.52],
    'Rivers': [4.84, 6.92], 'Sokoto': [13.06, 5.24], 'Taraba': [7.87, 9.78], 'Yobe': [12.29, 11.44],
    'Zamfara': [12.17, 6.66],
  }

  const distanceTo = (stateName: string): number | null => {
    if (!userCoords) return null
    const c = STATE_COORDS[stateName]
    if (!c) return null
    const R = 6371
    const dLat = (c[0] - userCoords.lat) * Math.PI / 180
    const dLng = (c[1] - userCoords.lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(userCoords.lat * Math.PI / 180) * Math.cos(c[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
  }

  const sortedNgos = userCoords
    ? [...ngos].sort((a, b) => (distanceTo(a.state) ?? 999) - (distanceTo(b.state) ?? 999))
    : ngos

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
      <div className="px-5 py-6 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resources & Support</h1>
            <p className="text-base text-foreground/60 mt-0.5">Find help, learn your rights, plan for safety</p>
          </div>
        </div>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 mb-5">
            <TabsTrigger value="find" className="text-sm"><MapPin className="h-4 w-4 mr-1.5" />Find Help</TabsTrigger>
            <TabsTrigger value="rights" className="text-sm"><Scale className="h-4 w-4 mr-1.5" />Rights</TabsTrigger>
            <TabsTrigger value="safety" className="text-sm"><Shield className="h-4 w-4 mr-1.5" />Safety</TabsTrigger>
          </TabsList>

          {/* ── FIND HELP ── */}
          <TabsContent value="find" className="space-y-6 mt-0">
            {/* State picker + location */}
            <div className="space-y-3">
              <p className="text-base font-medium text-foreground">Where are you located?</p>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Choose your state..." /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map(s => <SelectItem key={s} value={s} className="text-base py-2">{s}</SelectItem>)}
                </SelectContent>
              </Select>

              {!userCoords ? (
                <button
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 hover:border-primary/50 transition-all disabled:opacity-50"
                >
                  {geoLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" />Finding your location...</>
                    : <><Navigation2 className="h-4 w-4" />Or use my location to sort by distance</>
                  }
                </button>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Sorting by distance · stays on your device only</p>
                </div>
              )}

              <p className="text-xs text-foreground/40 text-center">Your location is never tracked or stored</p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-base text-foreground/60">Finding support near you...</span>
              </div>
            )}

            {/* Local NGOs */}
            {!loading && selectedState && ngos.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3">In {selectedState}</p>
                <div className="space-y-4">
                  {sortedNgos.map(ngo => (
                    <div key={ngo.id} className="bg-card rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-base font-semibold text-foreground">{ngo.name}</p>
                          <p className="text-sm text-foreground/50 mt-0.5">
                            {ngo.city ? `${ngo.city}, ${ngo.state}` : ngo.state}
                            {userCoords && distanceTo(ngo.state) != null && ` · ~${distanceTo(ngo.state)} km`}
                          </p>
                        </div>
                      </div>
                      {ngo.services.length > 0 && (
                        <p className="text-sm text-foreground/60 mb-3">{ngo.services.join(' · ')}</p>
                      )}
                      {ngo.address && (
                        <p className="text-sm text-foreground/50 flex items-start gap-2 mb-3">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />{ngo.address}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {ngo.phone && (
                          <a href={`tel:${ngo.phone.replace(/\s/g, '')}`} className="flex-1">
                            <Button className="w-full h-11 rounded-xl"><Phone className="h-4 w-4 mr-2" />Call</Button>
                          </a>
                        )}
                        <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => openDirections(ngo.address || '', ngo.state)}>
                          <ExternalLink className="h-4 w-4 mr-2" />Directions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && selectedState && ngos.length === 0 && (
              <div className="text-center py-10">
                <p className="text-base text-foreground/60">No organizations found in {selectedState} yet.</p>
                <p className="text-sm text-foreground/40 mt-1">Try the national helplines below.</p>
              </div>
            )}

            {/* National helplines */}
            <div>
              <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3">National Helplines</p>
              <div className="bg-card rounded-2xl shadow-sm divide-y divide-border/50">
                {NATIONAL_RESOURCES.map(r => (
                  <a key={r.name} href={`tel:${r.phone.replace(/[\s-]/g, '')}`} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-sm text-foreground/50">{r.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-primary">{r.phone}</p>
                      <p className="text-xs text-foreground/40">{r.hours}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency */}
            <div className="p-5 bg-red-50 dark:bg-red-950/30 rounded-2xl">
              <p className="text-base font-semibold text-red-800 dark:text-red-200 mb-1">In immediate danger?</p>
              <p className="text-sm text-red-600/80 dark:text-red-300/70 mb-4">Call emergency services right now.</p>
              <div className="flex gap-3">
                <a href="tel:199" className="flex-1"><Button variant="destructive" className="w-full h-12 rounded-xl text-base">199</Button></a>
                <a href="tel:112" className="flex-1"><Button variant="destructive" className="w-full h-12 rounded-xl text-base">112</Button></a>
              </div>
            </div>
          </TabsContent>

          {/* ── RIGHTS ── */}
          <TabsContent value="rights" className="space-y-5 mt-0">
            {rightsData.map((section, i) => (
              <div key={section.title} className="bg-card rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <section.icon className="h-4 w-4 text-primary" />
                  </div>
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map(item => (
                    <li key={item} className="text-[15px] text-foreground/70 flex gap-3 leading-relaxed">
                      <span className="text-primary mt-1 text-lg leading-none">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-card rounded-2xl p-5 shadow-sm">
              <p className="text-base font-medium text-foreground mb-1">Need Legal Help?</p>
              <p className="text-[15px] text-foreground/60 leading-relaxed">Free legal aid is available through FIDA, the Legal Aid Council, and other organizations across Nigeria.</p>
            </div>
          </TabsContent>

          {/* ── SAFETY PLAN ── */}
          <TabsContent value="safety" className="space-y-5 mt-0">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">⚠️ Don't save this on a device your abuser can access</p>
            </div>
            {safetyPlan.map((section, i) => (
              <div key={section.title} className="bg-card rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</span>
                  <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map(item => (
                    <li key={item} className="text-[15px] text-foreground/70 flex gap-3 leading-relaxed">
                      <span className="text-primary mt-1 text-lg leading-none">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
              <p className="text-base font-medium text-amber-800 dark:text-amber-200 mb-1">Your safety comes first</p>
              <p className="text-[15px] text-amber-700 dark:text-amber-300 leading-relaxed">The most dangerous time is when leaving. Plan carefully and get professional help.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </Layout>
  )
}
