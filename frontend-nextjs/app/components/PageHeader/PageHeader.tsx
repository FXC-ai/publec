interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative py-6 text-center">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-muted/50 to-transparent rounded-xl" />
      <h1 className="text-5xl font-extrabold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground max-w-4xl mx-auto">
          {description}
        </p>
      )}
      <div className="mt-6 mx-auto h-1 w-24 rounded-full bg-primary" />
    </div>
  )
}
