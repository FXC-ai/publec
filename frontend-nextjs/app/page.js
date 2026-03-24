import Image from "next/image";
import styles from "./page.module.css";

export default function Home()
{
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Bonjour, je suis <span className={styles.highlight}>François-Xavier Coindreau</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Développeur Full-Stack
        </p>
        <p className={styles.heroDescription}>
          Bienvenue dans mon laboratoire !
          J'expérimente différentes technologies. Vous y trouverez des projets en C, du JAVA, du Python, des Maths, tests de framework  et bien d'autres ...
          Pour les étudiants de l'Ecole 42, vous y trouverez égalements des tutoriaux qui pourront peut-être vous aider dans vos projets.
        </p>
        <div className={styles.heroButtons}>
          <a href="#projects" className={`${styles.btn} ${styles.btnPrimary}`}>
            Voir mes projets
          </a>
          <a href="#contact" className={`${styles.btn} ${styles.btnSecondary}`}>
            Me contacter
          </a>
        </div>
      </div>
    </div>
  )
}
