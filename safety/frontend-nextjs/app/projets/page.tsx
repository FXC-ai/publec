import Link from 'next/link'

import projectsData from '@/public/projets/projects.json'
import { PageHeader } from '../components/PageHeader/PageHeader'
import { Separator } from "@/components/ui/separator"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

interface project {
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

function CardImage({ image, title, description, tags, slug }: {
  image: string,
  title: string,
  description: string,
  tags: string[],
  slug: string,
}) {
  return (
    <Card className="relative mx-auto w-full pt-0 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col">
      <img src={image} alt={title} className="w-full object-cover rounded-t-xl aspect-video" />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link className="w-full" href={"/projets/" + slug}>
          <Button className="w-full">Voir le projet</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function Projects() {
  const projects_types = Object.keys(projectsData);
  return (
    <div className="relative min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-secondary/10" />
        <div className="max-w-7xl mx-auto text-center">
          <PageHeader title="Mes Projets" description="Découvrez les projets sur lesquels j'ai travaillé" />
        </div>
      </section>

      {/* ── Projets par catégorie ── */}
      {projects_types.map((project_type, index) => (
        <div key={project_type}>
          <section className="py-6 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-2">{project_type}</h2>
              <p className="text-center text-muted-foreground mb-10 text-sm">
                {(projectsData as Record<string, project[]>)[project_type].length} projet(s)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(projectsData as Record<string, project[]>)[project_type].map((p) => (
                  <CardImage
                    key={p.id}
                    image={p.image}
                    title={p.title}
                    description={p.shortDescription}
                    tags={p.tags}
                    slug={p.slug}
                  />
                ))}
              </div>
            </div>
          </section>
          {index < projects_types.length - 1 && <Separator />}
        </div>
      ))}

    </div>
  )
}
