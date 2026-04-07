'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'


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
	<nav>
		<div >
		<Link href="/" className='[--gutter-width:1rem] lg:[--gutter-width:2rem]' >
			Mon Portfolio
		</Link>





		<ul>
			<li>
			<Link href="/" style={pathname === '/' ? { color: 'blue'} : {color : 'green'}}>
				Accueil
			</Link>
			</li>
			<li>
			<Link href="/projets" style={pathname === '/projets' ? { color: 'blue'} : {color : 'green'}}>
				Projets
			</Link>
			</li>
			<li>
			<Link href="/a-propos" style={pathname === '/a-propos' ? { color: 'blue'} : {color : 'green'}}>
				À propos
			</Link>
			</li>
			<li>
			<Link href="/contact" style={pathname === '/' ? { color: 'blue'} : {color : 'green'}}>
				Contact
			</Link>
			</li>
		</ul>
		</div>
	</nav>
	)
}