import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TimelineItem {
  titre: string
  periode: string[]
  description: string
  etablissement: string
  competences: string[]
}

interface TimelineSectionProps {
  title: string
  items: TimelineItem[]
}

export function TimelineSection({ title, items }: TimelineSectionProps) {
  return (
    <div className="rounded-2xl border border-border p-6 space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index}>
            {index > 0 && <Separator className="mb-6" />}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{item.titre}</h3>
                <span className="text-sm text-muted-foreground">
                  {item.periode[0]}{item.periode[1] ? ` — ${item.periode[1]}` : ""}
                </span>
              </div>
              <p className="text-sm font-medium">{item.etablissement}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.competences.map((competence) => (
                  <Badge variant="secondary" key={competence}>{competence}</Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
