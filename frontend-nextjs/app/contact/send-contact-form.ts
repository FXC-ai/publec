"use server"

import { ContactFormInputs, contactFormSchema } from "./contactFormSchema"


import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(sender : string, message : string)
{
  const { data, error } = await resend.emails.send
  (
    {
      from: 'Acme <onboarding@resend.dev>',
      to: ["fx.coindreau@gmail.com"],
      subject: "Formulaire de contact envoyé par : " + sender,
      text: message,
      replyTo: sender,
    }
);

  if (error)
  {
    console.error("ERREUR sendMail :", error);
    throw new Error(error.message);
  }

  return data;
}

export async function sendFormContact (input: ContactFormInputs)
{
    const validatedData = contactFormSchema.safeParse(input);

    console.log("Form datas :", validatedData);

    if (!validatedData.success)
    {
        return {
            success : false,
            message: "Les données du formulaire sont invalides"
        };
    }

    await sendEmail(validatedData.data.mail, validatedData.data.message);

    return {
        success: true,
        message: "Message envoyé avec succès."
    }  
}