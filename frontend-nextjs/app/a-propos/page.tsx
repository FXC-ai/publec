import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import aproposData from "@/public/a-propos/a-propos.json"

import { PageHeader } from "../components/PageHeader/PageHeader"
import { TimelineSection } from "./TimelineSection"

export const metadata: Metadata = {
  title: "À propos",
  description: "Parcours, expériences et formations de François Coindreau, développeur full-stack.",
}

export default function About() {
  return (
    <div>
      <PageHeader title="À propos" description="Quelques informations sur mon parcours..." />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="bg-muted px-8 py-6 flex items-center justify-center shrink-0">
              <Image
                src={aproposData.photo}
                alt="Photo de profil de François Coindreau"
                width={2800}
                height={3800}
                className="w-[200px] h-auto rounded-xl"
                loading="eager"
              />
            </div>

            <div className="p-6 flex items-center">
              <div className="space-y-4">
                <p className="leading-relaxed">{aproposData.bio}</p>

                <div className="flex items-center gap-4">
                  <Link
                    href={aproposData.reseaux.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Profil LinkedIn de François Coindreau"
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
                    aria-label="Profil GitHub de François Coindreau"
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
            </div>
          </div>
        </div>

        <TimelineSection title="Expériences professionnelles" items={aproposData.experiences} />
        <TimelineSection title="Formations" items={aproposData.formations} />

      </div>
    </div>
  )
}
