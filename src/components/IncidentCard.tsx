import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Heart, Phone } from "lucide-react"

interface IncidentType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  severity: "high" | "medium" | "low"
  color: string
}

const incidentTypes: IncidentType[] = [
  {
    id: "domestic-violence",
    title: "Domestic Violence",
    description: "Report domestic abuse or violence in the home",
    icon: <Shield className="h-6 w-6" />,
    severity: "high",
    color: "destructive"
  },
  {
    id: "fgm",
    title: "FGM/Cutting",
    description: "Female genital mutilation or cutting incidents",
    icon: <AlertTriangle className="h-6 w-6" />,
    severity: "high", 
    color: "destructive"
  },
  {
    id: "child-abuse",
    title: "Child Abuse",
    description: "Report child abuse or neglect",
    icon: <Heart className="h-6 w-6" />,
    severity: "high",
    color: "destructive"
  },
  {
    id: "harassment",
    title: "Harassment",
    description: "Sexual or psychological harassment",
    icon: <Phone className="h-6 w-6" />,
    severity: "medium",
    color: "warning"
  }
]

interface IncidentCardProps {
  onSelect: (incidentType: IncidentType) => void
}

export function IncidentCard({ onSelect }: IncidentCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {incidentTypes.map((incident) => (
        <Card 
          key={incident.id} 
          className="cursor-pointer transition-all duration-200 hover:shadow-comfort hover:scale-102 border-0 shadow-soft"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary-soft">
                {incident.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{incident.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm mb-4">
              {incident.description}
            </CardDescription>
            <Button 
              variant="trust" 
              className="w-full"
              onClick={() => onSelect(incident)}
            >
              Report This Incident
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export type { IncidentType }