import styles from "./page.module.css";
import Tag from "./components/Tag/Tag"

export default function Home() {

  const techs : string[] = ["Linux", "C", "Java"]

  return (
    <div className={styles.hero}>

      <div className={styles.heroContent}>

        <h1 className={styles.heroTitle}>
          Bonjour, je suis <span className={styles.highlight}>François-Xavier</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Développeur Full-Stack
        </p>

        <p className={styles.heroDescription}>
          Bienvenue dans mon laboratoire de tests. Vous y retrouverez différentes stacks.
        </p>

        <div className={styles.heroButtons}>
          <a href="#projects" className={`${styles.btn} ${styles.btnPrimary}`}>
            Voir mes projets
          </a>
          <a href="#contact" className={`${styles.btn} ${styles.btnSecondary}`}>
            Me contacter
          </a>
        </div>

        <div className={styles.tagsContainer}>

          
            {techs.map((tech, index) => (

              <Tag key={index} name={tech} />

            ))}
          
        </div>

      </div>
    </div>
  )
}
