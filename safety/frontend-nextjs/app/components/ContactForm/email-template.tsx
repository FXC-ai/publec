
interface EmailTemplateProps
{
    email : string;
    message: string;
}

export const EmailTemplateProps: React.FC<Readonly<EmailTemplateProps>> = (
    {
        email,
        message
    }
) => (
    <div>
        <p>Email: {email}</p>
        <p>Message: {message}</p>

    </div>

)