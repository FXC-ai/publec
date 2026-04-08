"use server"

import { ContactFormInputs, contactFormSchema } from "./contactFormSchema"

export async function sendFormContact (input: ContactFormInputs)
{


    try
    {
        // const validatedData = {success : true, message : "Va"};
        const validatedData = contactFormSchema.safeParse(input);

        if (!validatedData.success)
        {
            return {
                success : false,
                message: "Les données du formulaire sont invalides"
            };
        }

        await new Promise((resolve) => setTimeout(resolve, 2500));

        return {
            success: true,
            message: "Message envoyé avec succès."
        }
    }
    catch (error)
    {
        console.error("Echec de l'envoi du message : ", error)
        return {
            success: false,
            message : "Une erreur est survenue lors de l'envoi du message."
        }
    }


}