import Link from 'next/link'
import styles from './page.module.css'
import projectsData from '@/data/projects.json'
import Tag from '../components/Tag/Tag'
import Image from 'next/image'

export default function Projects() {

    projectsData.forEach((e) => {console.log(e.image)})

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mes Projets</h1>
            <p className={styles.description}>
                Découvrez les projets sur lesquels j'ai travaillé
            </p>
            
            <div className={styles.grid}>
                {projectsData.map((project) => (
                    <Link
                        href={`/projets/${project.slug}`}
                        key={project.id}
                        className={styles.card}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={200}
                                height={100}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.content}>
                            <h2>{project.title}</h2>
                            <p>{project.shortDescription}</p>
                            <div className={styles.tags}>
                                {project.tags.map((tech, index) => (
                                   <Tag key={index} name={tech} />
                                ))}
                            </div>
                            <span className={styles.viewMore}>Voir le projet →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}