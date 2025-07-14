import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Baby, Hand, HelpCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

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
    title: "dashboard.incident_types.violence_at_home",
    simpleTitle: "Violence at Home",
    icon: <Home className="h-12 w-12" />,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
  },
  {
    id: "harm-to-child",
    title: "dashboard.incident_types.harm_to_child",
    simpleTitle: "Child Harm",
    icon: <Baby className="h-12 w-12" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
  },
  {
    id: "unwanted-touching",
    title: "dashboard.incident_types.unwanted_touching",
    simpleTitle: "Unwanted Touch",
    icon: <Hand className="h-12 w-12" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
  },
  {
    id: "other-safety",
    title: "dashboard.incident_types.other_safety",
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
  const { t } = useTranslation()
  
  return (
    <div className="mobile-grid">
      {incidentTypes.map((incident) => (
        <Card 
          key={incident.id} 
          className={`mobile-card cursor-pointer touch-target mobile-scale mobile-highlight border-2 ${incident.bgColor}`}
          onClick={() => onSelect(incident)}
        >
          <CardContent className="text-center space-y-4">
            <div className={`mx-auto ${incident.color}`}>
              {incident.icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold leading-tight">
              {t(incident.title)}
            </h3>
            <Button 
              variant="default" 
              className="mobile-button w-full mobile-scale"
            >
              {t('dashboard.report_this')}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export type { IncidentType }