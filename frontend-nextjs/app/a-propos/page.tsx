import styles from './page.module.css'

export default function About() {
  return (
    <div className="container">
      <h1 className="title">À propos de moi</h1>
      
      <div className={styles.content}>
        <div className={styles.bio}>
          <h2>Qui suis-je ?</h2>
          <p>
            Développeur passionné  éation
            d&apos;applications modernes et performantes. Spécialisé dans l&apos;écosystème
            React et Next.js.
          </p>
          <p>
            J&apos;aime transformer des idées en produits concrets qui résolvent
            de vrais problèmes utilisateurs.
          </p>
        </div>

        <div className={styles.skills}>
          <h2>Compétences</h2>
          <div className={styles.skillGrid}>
            <div className={styles.skillCategory}>
              <h3>Frontend</h3>
              <ul>
                <li>React & Next.js</li>
                <li>JavaScript ES6+</li>
                <li>HTML5 & CSS3</li>
              </ul>
            </div>
            
            <div className={styles.skillCategory}>
              <h3>Backend</h3>
              <ul>
                <li>C</li>
                <li>Fast API</li>
                <li>Rust Axum</li>
                <li>Java SpringBoot</li>
                <li>PostgreSQL</li>
              </ul>
            </div>

            <div className={styles.skillCategory}>
              <h3>DevOps</h3>
              <ul>
                <li>Docker</li>
                <li>Kubernetes</li>
                <li>Traefik</li>
                <li>NginX</li>
                <li>Virtual Box</li>
                <li>Vagrant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
