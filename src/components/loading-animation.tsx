import { cn } from "@/lib/utils";

export function LoadingAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative h-24 w-24">
        <div className="absolute h-full w-full rounded-full bg-accent/20 animate-ping" />
        <div className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] rounded-full bg-accent/30 animate-pulse" />
        <div className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-full bg-accent/40 animate-pulse delay-200" />
      </div>
      <p className="text-lg font-medium text-accent animate-pulse delay-500">
        Analyzing...
      </p>
    </div>
  );
}
