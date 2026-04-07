
import { Button } from "@/components/ui/button"
import projectsData from "@/public/projets/projects.json"
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import techLogos from "@/public/logos/list_logo.json"

import { Metadata } from 'next/types'
import { PageHeader } from "@/app/components/PageHeader/PageHeader"
import { Badge } from "@/components/ui/badge"
import { convertMarkdownToHTML, importChapterContent } from "@/app/utils/markdown_manager"
import path from "path"

export async function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }))
}


async function getProcessedSubject (projectSubject : boolean, slug : string)
{

  if (projectSubject == false)
  {
    return "";
  }
  else
  {
    const filePath = path.join(process.cwd(), "public", "projets" ,slug, "subject.md");
    const source = await importChapterContent(filePath);

    if ( source == null)
    {
      return null;
    }

    const processedContent = convertMarkdownToHTML(source);
    return processedContent;
  }

}

export default async function Page(
  {
    params,

  }
  :
  {
    params : Promise<{ slug: string }>

  }
)
{
  const { slug } = await params;

  const project = projectsData.find((project) => project.slug === slug);
  if (!project)
  {
    notFound();
  }

  const processedContent = await getProcessedSubject(project.subject_exists, slug);
  if (processedContent == null)
  {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      <PageHeader title={project.title} description={project.shortDescription}/>

      {/* Cadre image */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-md">
        <Image width={1200} height={400} src={project.image} alt={project.title} className="w-full object-cover"/>
      </div>

      {/* Cadre infos */}
      <div className="rounded-2xl border border-border p-6 space-y-6">

        {/* Technologies */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Technologies utilisées</h2>
          <div className="flex flex-wrap gap-5 items-center">
            {project.tags.map((tech, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <Image
                  src={techLogos[tech as keyof typeof techLogos]}
                  alt={tech}
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="text-xs text-muted-foreground">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Description */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            {project.type === "42" && techLogos["42" as keyof typeof techLogos] && (
              <Image
                src={techLogos["42" as keyof typeof techLogos]}
                alt="École 42"
                width={28}
                height={28}
                className="object-contain"
              />
            )}
            <h2 className="text-lg font-semibold">Description</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
        </div>

        <hr className="border-border" />

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {project.demo_exists && (
            <Link href={project.demo} target="_blank" rel="noopener noreferrer">
              <Button>Tester</Button>
            </Link>
          )}

          {project.tutoriel_exists && <Link href={"/projets/" + slug + "/tutoriel"}>
            <Button variant="outline">Tutoriel</Button>
          </Link>}

          {project.github_exists &&
          <Link href={project.github}>
            <Button variant="outline" className="flex items-center gap-2">
              {techLogos["Github" as keyof typeof techLogos] && (
                <Image
                  src={techLogos["Github" as keyof typeof techLogos]}
                  alt="Github"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              )}
              Github
            </Button>
          </Link>
          }
        </div>

      </div>

      {/* Cadre sujet */}
      {project.subject_exists && (
        <div className="rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Sujet</h2>
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: String(processedContent) }} />
        </div>
      )}

    </div>
  )


}


export async function generateMetadata({ params }: {params : Promise<{slug : string}>}): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug)
  return {
    title: project?.title ?? slug,
    description: project?.shortDescription,
  }
}
