"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import {
Field,
FieldDescription,
FieldError,
FieldGroup,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
InputGroup,
InputGroupAddon,
InputGroupText,
InputGroupTextarea,
} from "@/components/ui/input-group"
import { useTransition } from "react"
import { sendFormContact } from "./send-contact-form"


import { ContactFormInputs, contactFormSchema } from "./contactFormSchema"


export default function ContactForm()
{
	const [isSuccess, setIsSuccess] = useState(false);

	const [isSubmitting, startTransition] = useTransition();

	const form = useForm<ContactFormInputs>(
		{
			resolver: zodResolver(contactFormSchema),
			defaultValues: {
				mail: "",
				message: "",
			},
		}
	)

	function onSubmit(data: ContactFormInputs)
	{
		startTransition(async () => {
			const response = await sendFormContact(data);
			console.log(response);

			if (response.success)
			{
				setIsSuccess(true);
				form.reset();
			}
			else
			{
				form.setError("root.serverError", {message: response.message, type:"500"})
				setIsSuccess(false);
			}
		});

		console.log( JSON.stringify(data, null, 2));
	}

	return (
	<div className="mx-auto max-w-7xl px-4 py-8">
		{
			isSuccess ?
			(
				<Alert className="border-green-200 bg-green-50 text-green-800">
					<AlertTitle>Message envoyé</AlertTitle>
					<AlertDescription>Votre message a bien été transmis. Nous vous répondrons dans les plus brefs délais.</AlertDescription>
				</Alert>
			)
			:
			(
				<form id="contact-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

					{form.formState.errors?.root?.serverError && (
						<Alert variant="destructive">
							<AlertTitle>Erreur serveur</AlertTitle>
							<AlertDescription>
								{form.formState.errors.root.serverError.message}
							</AlertDescription>
						</Alert>
					)}

					<FieldGroup className="space-y-4">
					<Controller
						name="mail"
						control={form.control}
						render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="contact-form-title" className="block text-sm font-medium text-foreground mb-1">
							E-mail
							</FieldLabel>
							<Input
							{...field}
							id="contact-form-title"
							aria-invalid={fieldState.invalid}
							placeholder="exemple@exemple.ch"
							autoComplete="off"
							className="w-full"
							/>
							{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
							)}
						</Field>
						)}
					/>
					<Controller
						name="message"
						control={form.control}
						render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="contact-form-message" className="block text-sm font-medium text-foreground mb-1">
							Message
							</FieldLabel>
							<InputGroup>
							<InputGroupTextarea
								{...field}
								id="contact-form-message"
								placeholder="Votre message"
								rows={6}
								className="min-h-24 resize-none w-full"
								aria-invalid={fieldState.invalid}
							/>
							<InputGroupAddon align="block-end">
								<InputGroupText className="tabular-nums text-xs text-muted-foreground">
								{field.value.length} caractères.
								</InputGroupText>
							</InputGroupAddon>

							</InputGroup>

							{fieldState.invalid && (
							<FieldError errors={[fieldState.error]} />
							)}
						</Field>
						)}
					/>
						<Field orientation="horizontal" className="flex justify-end gap-3 pt-2">
							<Button disabled={isSubmitting} type="button" variant="outline" onClick={() => form.reset()}>
							Reset
							</Button>
							<Button disabled={isSubmitting} type="submit" form="contact-form">
								{isSubmitting ? "Envoi en cours" : "Envoyer"}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			)
		}
	</div>
	)
}
