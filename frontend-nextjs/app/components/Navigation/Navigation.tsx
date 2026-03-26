'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Navigation.module.css'

export default function Navigation() {
	const pathname = usePathname()

	const [isOpen, setIsOpen] = useState(false)


	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const closeMenu = () => {
		setIsOpen(false)
	}

 
	return (
	<nav className={styles.nav}>
		<div className="container">
		<Link href="/" className={styles.logo}>
			Mon Portfolio
		</Link>

		<button 
			className={styles.burger}
			onClick={toggleMenu}
			aria-label="Menu"
		>
			<span className={isOpen ? styles.burgerOpen : ''}></span>
			<span className={isOpen ? styles.burgerOpen : ''}></span>
			<span className={isOpen ? styles.burgerOpen : ''}></span>
		</button>



		<ul className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`} >
			<li>
			<Link href="/" className={pathname === '/' ? `${styles.link} ${styles.active}` : styles.link}>
				Accueil
			</Link>
			</li>
			<li>
			<Link href="/projets" className={pathname === '/projets' ? `${styles.link} ${styles.active}` : styles.link}>
				Projets
			</Link>
			</li>
			<li>
			<Link href="/a-propos" className={pathname === '/a-propos' ? `${styles.link} ${styles.active}` : styles.link}>
				À propos
			</Link>
			</li>
			<li>
			<Link href="/contact" className={pathname === '/contact' ? `${styles.link} ${styles.active}` : styles.link}>
				Contact
			</Link>
			</li>
		</ul>
		</div>
	</nav>
	)
}