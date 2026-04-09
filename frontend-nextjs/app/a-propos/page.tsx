import type { Metadata } from "next"
import aproposData from "@/public/a-propos/a-propos.json"
import { PageHeader } from '../components/PageHeader/PageHeader'
import { TimelineSection } from './TimelineSection'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from "next/link"

export const metadata: Metadata = {
  title: "À propos",
  description: "Parcours, expériences et formations de François Coindreau, développeur full-stack.",
}

export default function About() {
  return (
    <div>
      <PageHeader title="À propos" description="Quelques informations sur mon parcours..." />
      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* Photo + Bio */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="bg-muted px-8 py-6 flex items-center justify-center shrink-0">
              <Image
                src={aproposData.photo}
                alt="Photo de profil de François Coindreau"
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
        <TimelineSection title="Expériences professionnelles" items={aproposData.experiences} />

        {/* Formations */}
        <TimelineSection title="Formations" items={aproposData.formations} />

        {/* Réseaux + CV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="rounded-2xl border border-border p-6 space-y-4">
            <h2 className="text-xl font-semibold">Réseaux</h2>
            <div className="flex gap-4">
              <Link
                href={aproposData.reseaux.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/logos/logo_linkedin.png"
                  width={40}
                  height={40}
                  alt="LinkedIn"
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link
                href={aproposData.reseaux.github}
                target="_blank"
                rel="noopener noreferrer"
              >
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
