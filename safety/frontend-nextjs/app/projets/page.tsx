import type { Metadata } from "next"
import projectsData from '@/public/projets/projects.json'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { Separator } from "@/components/ui/separator"

import CardImage from "./CardImage"

export const metadata: Metadata = {
  title: "À propos | Publec.ch",
  description: "Parcours, expériences et formations de François Coindreau, développeur full-stack.",
}

interface Project {
  "id": number,
  "type": string,
  "slug": string,
  "title": string,
  "shortDescription": string,
  "longDescription": string,
  "image": string,
  "tags": string[],
  "github": string,
  "demo": string,
  "github_exists": boolean,
  "demo_exists": boolean,
  "subject_exists": boolean,
  "tutoriel_exists": boolean
}

export default function Projects() {
  const set_projects_types = new Set(projectsData.map(p=>p.type))
  const project_types = [...set_projects_types];
  const test = projectsData.filter(e => e.type === "Projets personnels")
  console.log(test)
  

  return (
    <div className="relative min-h-screen">

      

      <section className="relative overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="max-w-7xl mx-auto text-center">
          <PageHeader title="Mes Projets" description="Découvrez les projets sur lesquels j'ai travaillé" />
        </div>
      </section>


      {project_types.map((type, index) => (
        <div key={type}>
          <section className="py-6 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-2">{type}</h2>
              <p className="text-center text-muted-foreground mb-10 text-sm">
                {projectsData.filter(p => p.type === type).length} projet{projectsData.filter(p => p.type === type).length > 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {
                  projectsData
                  .filter(e => e.type === type)
                  .map
                  (
                    (p) =>
                    (
                      <CardImage
                        key={p.id}
                        image={p.image}
                        title={p.title}
                        description={p.shortDescription}
                        tags={p.tags}
                        slug={p.slug}
                      />
                    )
                  )

                }
              </div>
            </div>
          </section>
          {index < projectsData.length - 1 && <Separator />}
        </div>
      ))}

    </div>
  )
}
