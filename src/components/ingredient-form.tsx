'use client';

import { useFormStatus } from 'react-dom';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { LoadingAnimation } from './loading-animation';
import { Logo } from './icons';

export function IngredientForm({
  formAction,
}: {
  formAction: (payload: FormData) => void;
}) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 text-center animate-in fade-in-50 duration-500">
      <div className="flex flex-col items-center gap-4">
        <Logo className="h-16 w-16 text-accent" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-400">
          Ingredient Insights AI
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 max-w-md">
          Paste an ingredient list to understand what you're really eating.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <Textarea
          name="ingredients"
          placeholder="e.g. Enriched flour, high fructose corn syrup, palm oil, salt, artificial flavors..."
          className="min-h-[150px] w-full rounded-xl bg-card/50 p-4 text-base backdrop-blur-sm focus:ring-accent focus:ring-2 border-primary/20"
          required
        />
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto bg-accent text-accent-foreground font-bold hover:bg-accent/90 hover:shadow-glow-accent transition-all duration-300"
          disabled={pending}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Analyze Ingredients
        </Button>
      </form>
    </div>
  );
}
