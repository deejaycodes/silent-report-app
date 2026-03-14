import { Card, CardContent } from "@/components/ui/card"
import { Baby, Hand, HelpCircle, Scissors, Briefcase, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

interface IncidentType {
  id: string
  title: string
  description: string
  simpleTitle: string
  icon: React.ReactNode
  emoji: string
}

const incidentTypes: IncidentType[] = [
  {
    id: "fgm",
    title: "dashboard.incident_types.fgm",
    description: "dashboard.incident_types.fgm_description",
    simpleTitle: "FGM/C",
    icon: <Scissors className="h-5 w-5" />,
    emoji: "🩺",
  },
  {
    id: "child-labour",
    title: "dashboard.incident_types.child_labour",
    description: "dashboard.incident_types.labour_description",
    simpleTitle: "Child Labour",
    icon: <Briefcase className="h-5 w-5" />,
    emoji: "👷",
  },
  {
    id: "unwanted-touching",
    title: "dashboard.incident_types.unwanted_touching",
    description: "dashboard.incident_types.touching_description",
    simpleTitle: "Sexual Abuse",
    icon: <Hand className="h-5 w-5" />,
    emoji: "🛡️",
  },
  {
    id: "harm-to-child",
    title: "dashboard.incident_types.harm_to_child",
    description: "dashboard.incident_types.child_description",
    simpleTitle: "Child Abuse",
    icon: <Baby className="h-5 w-5" />,
    emoji: "🧒",
  },
  {
    id: "other-safety",
    title: "dashboard.incident_types.other_safety",
    description: "dashboard.incident_types.other_description",
    simpleTitle: "Other Harm",
    icon: <HelpCircle className="h-5 w-5" />,
    emoji: "📋",
  }
]

interface IncidentCardProps {
  onSelect: (incidentType: IncidentType) => void
}

export function IncidentCard({ onSelect }: IncidentCardProps) {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-2">
      {incidentTypes.map((incident) => (
        <button
          key={incident.id}
          onClick={() => onSelect(incident)}
          className="w-full text-left bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:bg-accent/50 active:scale-[0.98] transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
            {incident.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-foreground leading-tight">
              {t(incident.title)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {t(incident.description)}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
      ))}
    </div>
  )
}

export type { IncidentType }
