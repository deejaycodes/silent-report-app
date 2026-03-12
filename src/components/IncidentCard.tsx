import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Baby, Hand, HelpCircle, Scissors, Briefcase } from "lucide-react"
import { useTranslation } from "react-i18next"

interface IncidentType {
  id: string
  title: string
  description: string
  simpleTitle: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const incidentTypes: IncidentType[] = [
  {
    id: "fgm",
    title: "dashboard.incident_types.fgm",
    description: "dashboard.incident_types.fgm_description",
    simpleTitle: "FGM/C",
    icon: <Scissors className="h-12 w-12" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800"
  },
  {
    id: "child-labour",
    title: "dashboard.incident_types.child_labour",
    description: "dashboard.incident_types.labour_description",
    simpleTitle: "Child Labour",
    icon: <Briefcase className="h-12 w-12" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
  },
  {
    id: "unwanted-touching",
    title: "dashboard.incident_types.unwanted_touching",
    description: "dashboard.incident_types.touching_description",
    simpleTitle: "Sexual Abuse",
    icon: <Hand className="h-12 w-12" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
  },
  {
    id: "harm-to-child",
    title: "dashboard.incident_types.harm_to_child",
    description: "dashboard.incident_types.child_description",
    simpleTitle: "Child Abuse",
    icon: <Baby className="h-12 w-12" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
  },
  {
    id: "other-safety",
    title: "dashboard.incident_types.other_safety",
    description: "dashboard.incident_types.other_description",
    simpleTitle: "Other Harm",
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
              {t(incident.title)}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t(incident.description)}
            </p>
            <Button 
              variant="default" 
              size="lg"
              className="w-full mt-4 text-lg py-6"
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