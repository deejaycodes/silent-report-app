import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Baby, Hand, UserX, HelpCircle } from "lucide-react"

interface IncidentType {
  id: string
  title: string
  simpleTitle: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const incidentTypes: IncidentType[] = [
  {
    id: "violence-at-home",
    title: "Violence at home",
    simpleTitle: "Home Violence",
    icon: <Home className="h-12 w-12" />,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
  },
  {
    id: "harm-to-child",
    title: "Harm to a child",
    simpleTitle: "Child Hurt",
    icon: <Baby className="h-12 w-12" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
  },
  {
    id: "unwanted-touching",
    title: "Unwanted touching or harassment",
    simpleTitle: "Unwanted Touch",
    icon: <Hand className="h-12 w-12" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
  },
  {
    id: "other-safety",
    title: "Other safety concern",
    simpleTitle: "Other Problem",
    icon: <HelpCircle className="h-12 w-12" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
  }
]

interface IncidentCardProps {
  onSelect: (incidentType: IncidentType) => void
}

export function IncidentCard({ onSelect }: IncidentCardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-3">
      {incidentTypes.map((incident) => (
        <Card 
          key={incident.id} 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 border-2 ${incident.bgColor}`}
          onClick={() => onSelect(incident)}
        >
          <CardContent className="p-8 text-center">
            <div className={`mx-auto mb-4 ${incident.color}`}>
              {incident.icon}
            </div>
            <h3 className="text-2xl font-bold mb-2 leading-tight">
              {incident.title}
            </h3>
            <Button 
              variant="default" 
              size="lg"
              className="w-full mt-4 text-lg py-6"
            >
              Report This
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export type { IncidentType }