import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Resources & Support</h1>
            <p className="text-base text-muted-foreground">Find help, learn your rights, plan for safety</p>
          </div>
        </div>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-11">
            <TabsTrigger value="find" className="text-sm"><MapPin className="h-4 w-4 mr-1.5" />Find Help</TabsTrigger>
            <TabsTrigger value="rights" className="text-sm"><Scale className="h-4 w-4 mr-1.5" />Rights</TabsTrigger>
            <TabsTrigger value="safety" className="text-sm"><Shield className="h-4 w-4 mr-1.5" />Safety Plan</TabsTrigger>
          </TabsList>

          {/* FIND HELP */}
          <TabsContent value="find" className="space-y-5 mt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">Select your state to find nearby support</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Choose a state..." /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map(s => <SelectItem key={s} value={s} className="text-base">{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Your selection stays on your device — never tracked
              </p>

              {/* Location button — prominent */}
              {!userCoords ? (
                <Button
                  variant="outline"
                  className="w-full h-12 text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary"
                  onClick={requestLocation}
                  disabled={geoLoading}
                >
                  {geoLoading
                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Finding your location...</>
                    : <><Navigation2 className="h-4 w-4 mr-2" />Use my location to sort by distance</>
                  }
                </Button>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Sorting by distance — your location stays on this device only</p>
                </div>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-base text-muted-foreground">Finding support near you...</span>
              </div>
            )}

            {!loading && selectedState && ngos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Organizations in {selectedState}</h3>
                {sortedNgos.map(ngo => (
                  <div key={ngo.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-base font-semibold">{ngo.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {ngo.city && <span className="text-sm text-muted-foreground">{ngo.city}, {ngo.state}</span>}
                        {userCoords && distanceTo(ngo.state) != null && (
                          <Badge variant="outline" className="text-xs">~{distanceTo(ngo.state)} km</Badge>
                        )}
                      </div>
                    </div>
                    {ngo.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {ngo.services.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    )}
                    {ngo.address && <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" />{ngo.address}</p>}
                    <div className="flex gap-2">
                      {ngo.phone && (
                        <a href={`tel:${ngo.phone.replace(/\s/g, '')}`} className="flex-1">
                          <Button variant="default" className="w-full h-10"><Phone className="h-4 w-4 mr-1.5" />Call</Button>
                        </a>
                      )}
                      <Button variant="outline" className="flex-1 h-10" onClick={() => openDirections(ngo.address || '', ngo.state)}>
                        <ExternalLink className="h-4 w-4 mr-1.5" />Directions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && selectedState && ngos.length === 0 && (
              <div className="text-center py-8">
                <p className="text-base text-muted-foreground">No registered organizations found in {selectedState} yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Try the national helplines below.</p>
              </div>
            )}

            {/* National — always visible */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">National Helplines</h3>
              {NATIONAL_RESOURCES.map(r => (
                <div key={r.name} className="border border-border rounded-xl p-4 space-y-2.5">
                  <p className="text-base font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.services.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                  </div>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{r.hours}</span>
                  <a href={`tel:${r.phone.replace(/[\s-]/g, '')}`}>
                    <Button variant="default" className="w-full h-10 mt-1"><Phone className="h-4 w-4 mr-1.5" />{r.phone}</Button>
                  </a>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-base font-semibold text-red-800 dark:text-red-200 mb-3">Emergency?</p>
              <div className="flex gap-2">
                <a href="tel:199" className="flex-1"><Button variant="destructive" className="w-full h-10">Call 199</Button></a>
                <a href="tel:112" className="flex-1"><Button variant="destructive" className="w-full h-10">Call 112</Button></a>
              </div>
            </div>
          </TabsContent>

          {/* RIGHTS */}
          <TabsContent value="rights" className="space-y-4 mt-4">
            {rightsData.map(section => (
              <div key={section.title} className="border border-border rounded-xl p-5">
                <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                  <section.icon className="h-5 w-5 text-primary" />{section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map(item => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2 leading-relaxed"><span className="text-primary mt-0.5">•</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-sm font-medium mb-1">Need Legal Help?</p>
              <p className="text-sm text-muted-foreground">Free legal aid through FIDA, Legal Aid Council, and other organizations.</p>
            </div>
          </TabsContent>

          {/* SAFETY PLAN */}
          <TabsContent value="safety" className="space-y-4 mt-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-800 dark:text-amber-200">⚠️ Don't save this on a device your abuser can access</p>
            </div>
            {safetyPlan.map(section => (
              <div key={section.title} className="border border-border rounded-xl p-5">
                <h3 className="text-base font-semibold mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map(item => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2 leading-relaxed"><span className="text-primary mt-0.5">•</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Your safety comes first</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">The most dangerous time is when leaving. Plan carefully and get professional help.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </Layout>
  )
}
