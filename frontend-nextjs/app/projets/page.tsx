import styles from './page.module.css'
import Tag from '../components/Tag/Tag'
import Link from 'next/link'

export default function Projects() {
  return (
    <div className="container">
      <h1 className="title">Mes Projets</h1>
      <p className="description">
        Découvrez les projets sur lesquels j&apos;ai travaillé
      </p>
      
      <div className={styles.grid}>

        <Link href="/projets/portfolio" className={styles.card}>
          <h2>Portfolio Personnel</h2>
          <p>Site web construit avec Next.js</p>
          <div className={styles.tags}>
            <Tag name={"Next.js"} />
            <Tag name={"React"} />
            <Tag name={"CSS Modules"} />
          </div>
        </Link>

        <Link href="/projets/ft_linux" className={styles.card}>
          <h2>ft_linux</h2>
          <p>Mise en place d'un Linux From Scratch</p>
          <div className={styles.tags}>
            <Tag name={"Bash"}/>
            <Tag name={"Linux"}/>
            <Tag name={"Virtual Box"}/>
          </div>
        </Link>

        <Link href="/projets/AvajLauncher" className={styles.card}>
          <h2>AvajLauncher</h2>
          <p>Simulation de communications entre aéronefs</p>
          <div className={styles.tags}>
            <Tag name={"JAVA"}/>
            <Tag name={"Spring Boot"}/>
            <Tag name={"Diagramme UML"}/>
          </div>
        </Link>
      </div>
    </div>
  )
}
