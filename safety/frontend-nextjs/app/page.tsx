
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, Briefcase, FlaskConical, Sparkles } from "lucide-react"
import data from "@/public/accueil.json"
import { PageHeader } from './components/PageHeader/PageHeader'

const techLogos: Record<string, string> = {
  "C":           "/logos/a/logo_c.png",
  "C++":         "/logos/a/logo_cpp.png",
  "Python":      "/logos/a/logo_python.png",
  "Rust":        "/logos/a/logo_rust.png",
  "TypeScript":  "/logos/a/logo_typescript.png",
  "Java":        "/logos/a/logo_java.png",
  "Docker":      "/logos/a/logo_docker.png",
  "Kubernetes":  "/logos/a/logo_kubernetes.png",
  "Git":         "/logos/a/logo_git.png",
  "Github":      "/logos/a/logo_github.png",
  "Virtual Box": "/logos/a/logo_virtualbox.png",
  "Bash":        "/logos/a/logo_bash.png",
  "FastAPI":     "/logos/a/logo_fastapi.png",
  "Spring Boot": "/logos/a/logo_springboot.png",
  "Django":      "/logos/a/logo_django.png",
  "React":       "/logos/a/logo_react.png",
  "Nextjs":      "/logos/a/logo_nextjs.png",
  "D3JS":        "/logos/a/logo_d3js.png",
  "PostgreSQL":  "/logos/a/logo_postgresql.png",
  "VS Code":     "/logos/a/logo_vscode.png",
  "Jupyter":     "/logos/a/logo_jupyter.png",
}

const allLogos = Object.entries(techLogos)

function TechCard({ category, techs }: { category: string; techs: string[] }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider">
          <h3>{category}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {techs.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1 hover:bg-muted transition-colors"
            >
              {techLogos[tech] && (
                <Image
                  src={techLogos[tech]}
                  alt={tech}
                  width={16}
                  height={16}
                  className="object-contain"
                />
              )}
              <span className="text-xs font-medium">{tech}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const goalIcons: Record<string, React.ReactNode> = {
  "Pour les étudiant de l'Ecole 42": <GraduationCap className="w-5 h-5" />,
  "Pour les recruteurs":             <Briefcase className="w-5 h-5" />,
  "Pour tout le monde":                        <FlaskConical className="w-5 h-5" />,
}

function GoalCard({ goal, description }: { goal: string; description: string }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
            {goalIcons[goal] ?? <h3 className="w-5 h-5" />}
          </div>
          <CardTitle className="text-sm font-semibold leading-snug">
            <h3>{goal}</h3>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const categories = Object.keys(data.techs)
  const goals = Object.keys(data.description)

  return (
    <div className="relative min-h-screen">

      {/* Floating logos (decorative) – full page */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        {allLogos.map(([name, logo], i) => (
          <div
            key={name}
            className="absolute opacity-[0.07]"
            style={{
              left:  `${(i * 11 + 3)  % 92}%`,
              top:   `${(i * 17 + 7)  % 88}%`,
              transform: `rotate(${(i * 43) % 360}deg)`,
            }}
          >
            <Image src={logo} alt="" width={72} height={72} className="object-contain" />
          </div>
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6">

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-secondary/10" />

        <div className="max-w-7xl mx-auto text-center">

          <PageHeader title={data.title} description={data["sub-title"]} />

        </div>
      </section>

      {/* <Separator /> */}

      {/* ── Description ── */}
      <section className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Objectifs</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">Apprendre et partager</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              goals.map
              (
                (goal) =>
                (
                  <GoalCard key={goal} goal={goal} description={(data.description as Record<string, string>)[goal]} />
                )
              )
            }
          </div>

        </div>
          
        <div className="flex flex-col sm:flex-row gap-4 justify-center py-6">
            <Link href="/projets">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Voir les projets
              </Button>
            </Link>
            <Link href="/a-propos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                En savoir plus
              </Button>
            </Link>
          </div>
      </section>

      <Separator />

      {/* ── Stack technique ── */}
      <section className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Stack Technique</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">
            Technologies explorées dans ce laboratoire
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <TechCard
                key={cat}
                category={cat}
                techs={(data.techs as Record<string, string[]>)[cat]}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
