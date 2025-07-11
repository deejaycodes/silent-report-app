import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Search, Filter, Navigation as NavigationIcon } from "lucide-react"

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
          <h1 className="text-2xl font-bold mb-2">Find Resources</h1>
          <p className="text-muted-foreground">Locate nearby support services and organizations</p>
        </div>

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
      </div>

      <Navigation />
    </Layout>
  )
}