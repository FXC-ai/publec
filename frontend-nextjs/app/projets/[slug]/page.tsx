import styles from './page.module.css'

// Liste de projets (normalement, ça viendrait d'une API ou d'une base de données)
const projects = {
   'portfolio': {
       title: 'portfolio',
       slug: 'portfolio',
       description: 'Site web moderne construit avec Next.js, présentant mes projets et compétences de manière interactive.',
       technologies: ['Next.js', 'React', 'CSS Modules'],
       image: '/images/portfolio.jpg',
       github: 'https://github.com/...',
       demo: 'https://...'
   },
   'ft_linux': {
       title: 'ft_linux',
       slug: 'ft_linux',
       description: 'Installation pas à pas d\'un systeme Linux from scratch',
       technologies: ['Bash', 'Linux'],
       image: '/images/ecommerce.jpg',
       github: 'https://github.com/...',
       demo: 'https://...'
   },
   'AvajLauncher': {
       title: 'AvajLauncher',
       slug: 'AvajLauncher',
       description: 'Simulation de communications radio entre une tours de contrôle et différents aéronefs',
       technologies: [ 'Java', 'SpringBoot', 'UML'],
       image: '/images/blog.jpg',
       github: 'https://github.com/...',
       demo: 'https://...'
   }
}


export default async function ProjectDetail(arg : {params : Promise<{ slug: string }>}) {
  const slug = (await arg.params).slug



  const project = projects[slug as keyof typeof projects]

  console.log("projet = ", project)

  if (!project) {
      return (
          <div className="container">
              <h1>Projet non trouvé</h1>
              <p>Ce projet n&apos;existe pas ou a été supprimé.</p>
          </div>
      )
  }

  return (
      <div className={styles.container}>
          <div className={styles.header}>
              <h1 className={styles.title}>{project.title}</h1>
              <p className={styles.description}>{project.description}</p>
          </div>

          <div className={styles.content}>
              <div className={styles.imageWrapper}>
                  <div className={styles.imagePlaceholder}>
                      Image du projet
                  </div>
              </div>

              <div className={styles.details}>
                  <h2>Technologies utilisées</h2>
                  <div className={styles.technologies}>
                      {project.technologies.map((tech, index) => (
                          <span key={index} className={styles.tech}>
                              {tech}
                          </span>
                      ))}
                  </div>

                  <div className={styles.links}>
                      <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                      >
                          Voir le code →
                      </a>
                      <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.link} ${styles.linkPrimary}`}
                      >
                          Voir la démo →
                      </a>
                  </div>
              </div>
          </div>
      </div>
  )
}