interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="border-border rounded-2xl border border-dashed p-10 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
