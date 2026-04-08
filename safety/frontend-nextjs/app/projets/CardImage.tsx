import Link from 'next/link'
import Image from 'next/image'
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

export default function CardImage({ image, title, description, tags, slug }: {
  image: string,
  title: string,
  description: string,
  tags: string[],
  slug: string,
}) {
  return (
    <Card className="relative mx-auto w-full pt-0 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col">
      <Image 
        width={1600}
        height={900}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        src={image}
        alt={title}
        className="w-full object-cover rounded-t-xl aspect-video"
      />
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
        <Link className="w-full" href={`/projets/${slug}`}>
          <Button className="w-full">Voir le projet</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}