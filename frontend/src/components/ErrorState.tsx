interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive bg-surface p-4 text-sm text-destructive">
      {message}
    </div>
  );
}
