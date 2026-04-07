import ContactForm from '../components/ContactForm/ContactForm'
import { PageHeader } from '../components/PageHeader/PageHeader'

export default function Contact() {

  return (
    <div >
      <PageHeader title='Contact' description="Pour toute précision technique concernant mes tutoriels ou pour discuter d'un projet professionnel, vous pouvez m'adresser un message ci-dessous."/>
      <ContactForm  />

    </div>
  )
}
