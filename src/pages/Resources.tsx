import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, Search, Filter, Navigation as NavigationIcon, Shield, Scale, Heart, FileText } from "lucide-react"

interface Resource {
  id: string
  name: string
  type: string
  address: string
  phone: string
  hours: string
  distance: string
  description: string
  services: string[]
}

const mockResources: Resource[] = [
  {
    id: "1",
    name: "Lagos Crisis Center",
    type: "Emergency Shelter",
    address: "123 Victoria Island, Lagos",
    phone: "+234 801 234 5678",
    hours: "24/7",
    distance: "2.3 km",
    description: "Emergency shelter and counseling services for domestic violence survivors",
    services: ["Emergency Shelter", "Counseling", "Legal Aid"]
  },
  {
    id: "2", 
    name: "Women's Rights Legal Clinic",
    type: "Legal Support",
    address: "45 Ikoyi Road, Lagos",
    phone: "+234 802 345 6789",
    hours: "Mon-Fri 9AM-5PM",
    distance: "4.1 km",
    description: "Free legal consultation and representation for gender-based violence cases",
    services: ["Legal Consultation", "Court Representation", "Documentation"]
  },
  {
    id: "3",
    name: "Community Health Center",
    type: "Medical Care",
    address: "78 Allen Avenue, Ikeja",
    phone: "+234 803 456 7890", 
    hours: "24/7",
    distance: "6.8 km",
    description: "Medical care and psychological support for trauma survivors",
    services: ["Medical Care", "Trauma Counseling", "Mental Health"]
  }
]

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [location, setLocation] = useState("")

  const serviceTypes = [
    { value: "all", label: "All Services" },
    { value: "emergency", label: "Emergency Shelter" },
    { value: "legal", label: "Legal Support" },
    { value: "medical", label: "Medical Care" },
    { value: "counseling", label: "Counseling" },
    { value: "hotline", label: "Hotline" }
  ]

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || resource.type.toLowerCase().includes(selectedType)
    return matchesSearch && matchesType
  })

  return (
    <Layout className="pb-20">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Resources & Support</h1>
          <p className="text-muted-foreground">Find help, learn your rights, and plan for safety</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="find">
              <MapPin className="h-4 w-4 mr-1" />
              Find Help
            </TabsTrigger>
            <TabsTrigger value="rights">
              <Scale className="h-4 w-4 mr-1" />
              Your Rights
            </TabsTrigger>
            <TabsTrigger value="safety">
              <Shield className="h-4 w-4 mr-1" />
              Safety Plan
            </TabsTrigger>
          </TabsList>

          {/* FIND HELP TAB */}
          <TabsContent value="find" className="space-y-6 mt-6">

        {/* Search and Filters */}
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services, organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your location or use GPS"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button variant="trust" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredResources.length} resource(s) found
          </p>
          <Button variant="outline" size="sm">
            <NavigationIcon className="h-4 w-4 mr-1" />
            Map View
          </Button>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="border-0 shadow-soft hover:shadow-comfort transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {resource.distance} away
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>

                {/* Services */}
                <div className="flex flex-wrap gap-1">
                  {resource.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{resource.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{resource.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{resource.hours}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="trust" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex-1">
                    <NavigationIcon className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Notice */}
        <Card className="border-0 shadow-comfort bg-destructive/10">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-destructive mb-2">Emergency Situation?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you're in immediate danger, contact emergency services right away
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" className="flex-1">
                Call 199 (Police)
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
                Call 112 (Emergency)
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* YOUR RIGHTS TAB */}
      <TabsContent value="rights" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Know Your Rights in Nigeria</CardTitle>
            <CardDescription>Understanding the law can help protect you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                FGM is Illegal
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• The Violence Against Persons Prohibition (VAPP) Act 2015 criminalizes FGM</p>
                <p>• Anyone who performs FGM can face up to 4 years in prison or a fine</p>
                <p>• It's illegal even if the person consents or if it's for "cultural reasons"</p>
                <p>• You have the right to refuse FGM for yourself or your daughter</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Domestic Violence is a Crime
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Physical, emotional, sexual, and economic abuse are all illegal</p>
                <p>• You can get a protection order to keep your abuser away</p>
                <p>• Police must respond to domestic violence calls</p>
                <p>• You don't need to be married for it to be domestic violence</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Your Rights as a Survivor
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• You have the right to free medical care after assault</p>
                <p>• You have the right to free legal aid</p>
                <p>• You can report without giving your name</p>
                <p>• You can change your mind about pressing charges</p>
                <p>• You have the right to a safe shelter</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Child Labour & Protection
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Child labour is illegal in Nigeria (Labour Act, Child Rights Act)</p>
                <p>• Children under 12 cannot work at all</p>
                <p>• Children 12-18 cannot do hazardous work (mining, factories, night work)</p>
                <p>• Children must attend school - education is a right</p>
                <p>• Worst forms: trafficking, forced labour, sexual exploitation, armed conflict</p>
                <p>• Report to Ministry of Labour, NAPTIP, or local child protection services</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                🌍 ILO Convention 182 (Nigeria ratified 2002)
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Nigeria committed to eliminating worst forms of child labour including trafficking, forced labour, and hazardous work.
              </p>
              <div className="space-y-1 text-xs text-blue-600">
                <p>• National Action Plan on Child Labour (2021-2025)</p>
                <p>• Free education through Universal Basic Education (UBE)</p>
                <p>• Child helpline: 6700 (toll-free)</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Need Legal Help?</p>
              <p className="text-sm text-muted-foreground mb-3">
                Free legal aid is available through FIDA, Legal Aid Council, and other organizations
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Find Legal Aid Near You
              </Button>
            </div>

          </CardContent>
        </Card>
      </TabsContent>

      {/* SAFETY PLAN TAB */}
      <TabsContent value="safety" className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Safety Plan</CardTitle>
            <CardDescription>
              ⚠️ Don't save this on your device if your abuser can access it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div>
              <h3 className="font-semibold mb-3">1. Safe Places to Go</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Think of 3 places you can go if you need to leave quickly:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• A friend or family member's house</li>
                <li>• A shelter or safe house</li>
                <li>• A public place (police station, hospital, church/mosque)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">2. Important Documents</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Keep copies of these in a safe place (with a trusted friend):
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Your ID card or passport</li>
                <li>• Children's birth certificates</li>
                <li>• Bank account information</li>
                <li>• Marriage certificate (if applicable)</li>
                <li>• Medical records</li>
                <li>• Photos of injuries (if any)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">3. Emergency Bag</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Pack a bag and hide it or leave it with someone you trust:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Change of clothes for you and children</li>
                <li>• Money or ATM card</li>
                <li>• Phone charger</li>
                <li>• Medications</li>
                <li>• Keys (house, car)</li>
                <li>• Important phone numbers written down</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">4. Trusted Contacts</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Tell 2-3 people you trust about your situation:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Someone who can help you leave quickly</li>
                <li>• Someone who can keep your documents</li>
                <li>• Someone who can check on you regularly</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">5. If Violence Starts</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Try to move to a room with an exit</li>
                <li>• Avoid rooms with weapons (kitchen, bathroom)</li>
                <li>• Protect your head and face</li>
                <li>• Call for help when it's safe</li>
                <li>• Leave as soon as you can</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">
                ⚠️ Remember: Your safety comes first
              </p>
              <p className="text-sm text-amber-700">
                The most dangerous time is when you're trying to leave. Plan carefully and get help from professionals.
              </p>
            </div>

          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>

        {/* Emergency Notice */}
        <Card className="border-0 shadow-comfort bg-destructive/10">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-destructive mb-2">Emergency Situation?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you're in immediate danger, contact emergency services right away
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" className="flex-1">
                Call 199 (Police)
              </Button>
              <Button variant="destructive" size="sm" className="flex-1">
                Call 112 (Emergency)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </Layout>
  )
}