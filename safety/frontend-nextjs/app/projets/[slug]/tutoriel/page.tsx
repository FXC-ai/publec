import path from "path";
import fs from "fs/promises";

import {convertMarkdownToHTML } from '@/app/utils/markdown_manager'
import projectsData from "@/public/projets/projects.json"
import { notFound } from 'next/navigation'
import Link from "next/link";
import { Metadata } from 'next/types'
import { DropdownMenuDemo } from '@/app/projets/[slug]/tutoriel/ButtonMenu'
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }))
}


export function TutoNavigation({ previous, next, isFirst, isLast, projectPage }: {
  previous: string; next: string; isFirst: boolean; isLast: boolean; projectPage:string;
})
{

  return (
    <div className="flex justify-center mt-12">
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border p-4 shadow-sm">

        {!isFirst
          ? <Link href={previous}><Button variant="outline">Précédent</Button></Link>
          : <Button variant="outline" disabled>Précédent</Button>
        }

        <Link href={projectPage}><Button>Page Projet</Button></Link>

        {!isLast
          ? <Link href={next}><Button variant="outline">Suivant</Button></Link>
          : <Button variant="outline" disabled>Suivant</Button>
        }

      </div>
    </div>
  )
}

export async function importChapterContent (filePath : string)
{
  try
  {

    const source = await fs.readFile(filePath, { encoding: 'utf8' });
    return source;
  }
  catch (error)
  {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
}

async function importMenu(projet:string)
{
  try
  {
    const jsonMenu = await import(`@/public/projets/${projet}/tutoriel/metadata.json`).then(m => m.default);
    return jsonMenu
  }
  catch (error)
  {

      return null;

  }
}

export default async function Page(
  { 
    params,
    searchParams
  }
  : 
  {
    params : Promise<{ slug: string }>
    searchParams : Promise<{chapter? : string }>
  }
)
{

  const { slug } = await params;
  const { chapter } = await searchParams

  const project = projectsData.find((project) => project.slug === slug);
  let chapterNum = parseInt(chapter ?? "0", 10);
  
  if (!project ) {
    notFound();
  }

  const metaData = await importMenu(slug)
  if (metaData === null)
  {
    notFound();
  }

  const listChapter = metaData.menu;
  if (listChapter === null || listChapter.length === 0)
  {
    notFound();
  }
  

  if (isNaN(chapterNum) || chapterNum < 0)
  {
    chapterNum = 0
  }

  if (chapterNum >= listChapter.length)
  {
    notFound();
  }

  const filePath = path.join(process.cwd(), "public", "projets" ,slug, "tutoriel",`chapitre${String(chapterNum)}.md`);
  const source = await importChapterContent(filePath);
  if (source === null)
  {
    notFound();
  }

  const processedContent = await convertMarkdownToHTML(source);

  const previous = `/projets/${slug}/tutoriel?chapter=${String(chapterNum - 1)}`
  const next = `/projets/${slug}/tutoriel?chapter=${String(chapterNum + 1)}`
  const isFirst = chapterNum === 0;
  const isLast = chapterNum === (listChapter.length - 1)
  const projectPage = `/projets/${slug}`;

  return (
    <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center py-8 px-4 bg-linear-to-r from-violet-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
          {metaData.title}
        </h1>
        <div className="fixed bottom-[5%] right-[2%] md:bottom-[10%] md:right-[15%] lg:bottom-[10%] lg:right-[17%] z-50">
          <DropdownMenuDemo project={slug} items={listChapter} activeChapter={{active : chapterNum, isFirst : isFirst, isLast : isLast}}/>
        </div>
        <div  >
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: String(processedContent) }} />
        </div>
        <TutoNavigation previous={previous} next={next} isFirst={isFirst} isLast={isLast} projectPage={projectPage}/>
    </div>
  );

}


export async function generateMetadata({ params }: {params : Promise<{slug : string}>}): Promise<Metadata> {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug)
  return {
    title: project?.title ?? slug,
    description: project?.shortDescription,
  }
}



