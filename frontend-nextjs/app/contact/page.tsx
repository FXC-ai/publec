import ContactForm from '../components/ContactForm/ContactForm'
import styles from './page.module.css'

export default function Contact() {

  return (
    <div className="container">

      <h1 className="title">Me Contacter</h1>
      <p className="description">
        Une question ? Un projet ? N&apos;hésitez pas à me contacter !
      </p>

      <div className={styles.contactWrapper}>
        <div className={styles.contactInfo}>
          <h2>Coordonnées</h2>
          <div className={styles.infoItem}>
            <strong>Email :</strong>
            <a href="mailto:votre@email.com">votre@email.com</a>
          </div>
          <div className={styles.infoItem}>
            <strong>LinkedIn :</strong>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              Mon profil LinkedIn
            </a>
          </div>
          <div className={styles.infoItem}>
            <strong>GitHub :</strong>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              Mon profil GitHub
            </a>
          </div>
        </div>
      </div>

      <ContactForm  />

    </div>
  )
}
