import aproposData from "@/public/a-propos/a-propos.json"
import { PageHeader } from '../components/PageHeader/PageHeader'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import Link from "next/link"

export default function About() {
  return (
    <div>
      <PageHeader title="A propos" description="Quelques informations sur mon parcours..." />
    <div className="max-w-7xl mx-auto px-4 space-y-8">

      {/* Photo + Bio */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="bg-muted px-8 py-6 flex items-center justify-center shrink-0">
            <Image
              src={aproposData.photo}
              alt="fcoindre"
              width={200}
              height={200}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="p-6 flex items-center">
            <p className="leading-relaxed">{aproposData.bio}</p>
          </div>
        </div>
      </div>

      {/* Expériences */}
      <div className="rounded-2xl border border-border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Expériences professionnelles</h2>
        <div className="space-y-6">
          {aproposData.experiences.map((exp, index) => (
            <div key={index}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{exp.titre}</h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.periode[0]}{exp.periode[1] ? ` — ${exp.periode[1]}` : ""}
                  </span>
                </div>
                <p className="text-sm font-medium">{exp.etablissement}</p>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {exp.competences.map((tech, i) => (
                    <Badge variant="secondary" key={i}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formations */}
      <div className="rounded-2xl border border-border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Formations</h2>
        <div className="space-y-6">
          {aproposData.formations.map((exp, index) => (
            <div key={index}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{exp.titre}</h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.periode[0]}{exp.periode[1] ? ` — ${exp.periode[1]}` : ""}
                  </span>
                </div>
                <p className="text-sm font-medium">{exp.etablissement}</p>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {exp.competences.map((tech, i) => (
                    <Badge variant="secondary" key={i}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Réseaux + CV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Réseaux</h2>
          <div className="flex gap-4">
            <Link href={aproposData.reseaux.linkedin}>
              <Image
                src="/logos/logo_linkedin.png"
                width={40}
                height={40}
                alt="LinkedIn"
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
            <Link href={aproposData.reseaux.github}>
              <Image
                src="/logos/logo_github.png"
                width={40}
                height={40}
                alt="GitHub"
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Télécharger mon CV</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={aproposData.cv.francais}>
              <Button>Version française</Button>
            </Link>
            <Link href={aproposData.cv.anglais}>
              <Button variant="outline">Version anglaise</Button>
            </Link>
          </div>
        </div>

      </div>

    </div>
    </div>
  )
}
