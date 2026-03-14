import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, Search, Scale, Shield, Heart, FileText, ChevronRight } from "lucide-react"

interface Resource {
  id: string; name: string; type: string; address: string; phone: string; hours: string; distance: string; description: string; services: string[]
}

const mockResources: Resource[] = [
  { id: "1", name: "Lagos Crisis Center", type: "Emergency Shelter", address: "Victoria Island, Lagos", phone: "+234 801 234 5678", hours: "24/7", distance: "2.3 km", description: "Emergency shelter and counseling for domestic violence survivors", services: ["Shelter", "Counseling", "Legal Aid"] },
  { id: "2", name: "Women's Rights Legal Clinic", type: "Legal Support", address: "Ikoyi Road, Lagos", phone: "+234 802 345 6789", hours: "Mon-Fri 9AM-5PM", distance: "4.1 km", description: "Free legal consultation for gender-based violence cases", services: ["Legal Aid", "Court Support", "Documentation"] },
  { id: "3", name: "Community Health Center", type: "Medical Care", address: "Allen Avenue, Ikeja", phone: "+234 803 456 7890", hours: "24/7", distance: "6.8 km", description: "Medical care and psychological support for trauma survivors", services: ["Medical Care", "Counseling", "Mental Health"] },
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
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = mockResources.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout className="pb-24">
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Resources & Support</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find help, learn your rights, plan for safety</p>
        </div>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="find" className="text-xs"><MapPin className="h-3.5 w-3.5 mr-1" />Find Help</TabsTrigger>
            <TabsTrigger value="rights" className="text-xs"><Scale className="h-3.5 w-3.5 mr-1" />Rights</TabsTrigger>
            <TabsTrigger value="safety" className="text-xs"><Shield className="h-3.5 w-3.5 mr-1" />Safety Plan</TabsTrigger>
          </TabsList>

          {/* FIND HELP */}
          <TabsContent value="find" className="space-y-3 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>

            {filtered.map(r => (
              <div key={r.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                      <span className="text-[11px] text-muted-foreground">{r.distance}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{r.description}</p>
                <div className="flex flex-wrap gap-1">
                  {r.services.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{r.address}</p>
                  <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{r.hours}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full"><Phone className="h-3.5 w-3.5 mr-1" />Call</Button>
                  </a>
                  <Button variant="outline" size="sm" className="flex-1">Directions</Button>
                </div>
              </div>
            ))}

            {/* Emergency */}
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
                    <li key={item} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">•</span>{item}
                    </li>
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
                    <li key={item} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">•</span>{item}
                    </li>
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
