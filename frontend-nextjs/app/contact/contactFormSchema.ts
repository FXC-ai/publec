import * as z from "zod"

export const contactFormSchema = z.object
(
    {
        mail: z.email("E-mail invalide"),
        message: z.string().min(20, "Le message doit contenir au minimum 20 caractères."),
    }
)

export type ContactFormInputs = z.infer<typeof contactFormSchema>;