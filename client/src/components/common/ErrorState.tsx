interface ErrorStateProps {
  message: string;
}

export function ErrorState({
  message,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
      <p className="text-red-400">
        {message}
      </p>
    </div>
  );
}