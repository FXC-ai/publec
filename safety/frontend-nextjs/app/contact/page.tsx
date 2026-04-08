import type { Metadata } from "next"
import ContactForm from './ContactForm'
import { PageHeader } from '../components/PageHeader/PageHeader'

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez moi pour toute question technique ou proposition professionnelle.",
}

export default function Contact() {

  return (
    <div >
      <PageHeader title='Contact' description="Pour toute précision technique concernant mes tutoriels ou pour discuter d'un projet professionnel, vous pouvez m'adresser un message ci-dessous."/>
      <ContactForm  />

    </div>
  )
}
