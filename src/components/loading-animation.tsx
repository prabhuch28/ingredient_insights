import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

export function LoadingAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative h-24 w-24">
        <div className="absolute h-full w-full rounded-full bg-primary/20 animate-ping" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/30 animate-pulse flex items-center justify-center shadow-glow-accent">
                <Bot className="h-8 w-8 text-primary-foreground/80"/>
            </div>
        </div>
      </div>
      <p className="text-lg font-medium text-primary animate-pulse delay-500">
        Analyzing...
      </p>
    </div>
  );
}
