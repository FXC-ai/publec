import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowBigLeft, ArrowBigRight, HomeIcon } from "lucide-react";




export function DropdownMenuDemo
(
	{project, items, activeChapter}
	:
	{project : string, items : {"id" : number; "title" : string}[], activeChapter : {active : number; isLast : boolean; isFirst : boolean}}
)
{
return (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="outline">Sommaire</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent className="w-80" align="start">

			<DropdownMenuGroup>
				<DropdownMenuLabel>Sommaire</DropdownMenuLabel>

				{items.map((chapter) => {
					return (
					<a key={chapter.id} href={`/projets/${project}/tutoriel/?chapter=`+chapter.id}><DropdownMenuItem >
						{chapter.title}
					</DropdownMenuItem></a>)

				})}
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Navigation</DropdownMenuLabel>

				{!activeChapter.isLast &&<a href={`/projets/${project}/tutoriel/?chapter=`+ String(activeChapter.active + 1)}><DropdownMenuItem>
					Chapitre Suivant 
					<DropdownMenuShortcut> <ArrowBigRight /> </DropdownMenuShortcut>
				</DropdownMenuItem></a>}

				{!activeChapter.isFirst && <a href={`/projets/${project}/tutoriel/?chapter=`+ String(activeChapter.active - 1)}><DropdownMenuItem >
					Chapitre Précédent 
					<DropdownMenuShortcut> <ArrowBigLeft /> </DropdownMenuShortcut>
				</DropdownMenuItem></a>}

				{<a href={`/projets/${project}`}><DropdownMenuItem >
					Page Projet 
					<DropdownMenuShortcut> <HomeIcon /> </DropdownMenuShortcut>
				</DropdownMenuItem></a>}
			</DropdownMenuGroup>


		</DropdownMenuContent>
	</DropdownMenu>
)
}
