'use client'

import { useState } from 'react'
import styles from './ContactForm.module.css'

export default function ContactForm() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })


    const handleChange = (e: { target: { name: any; value: any } } ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()


        setTimeout(() => {
            console.log('Formulaire envoyé :', formData)

            setFormData({ name: '', email: '', message: '' })

        }, 1500)

		alert("Message envoyé aveec succés.")
    }
    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.formGroup}>
                <label htmlFor="name">Nom</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}

            >
                Envoyer le message
            </button>
        </form>
    )
}