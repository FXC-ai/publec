import styles from "./Footer.module.css"

export default function Footer ()
{
    return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} FX</p>
      <p className={styles.links}>

        <a href="https://github.com/aurelienec" target="_blank">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/john-doe/" target="_blank">
          LinkedIn
        </a>
      </p>
    </footer>

    )
}