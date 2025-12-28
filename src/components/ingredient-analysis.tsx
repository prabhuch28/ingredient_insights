'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { analyzeIngredients, type FormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { IngredientForm } from '@/components/ingredient-form';
import { ResultsDisplay } from '@/components/results-display';
import { LoadingAnimation } from './loading-animation';
import { ScrollArea } from './ui/scroll-area';

const initialState: FormState = { type: 'initial' };

export function IngredientAnalysis() {
  const [state, formAction, isPending] = useActionState(analyzeIngredients, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.type === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  const showWelcome = !isPending && state.type === 'initial';
  const showResults = state.type === 'success' && state.data;
  
  const handleReset = () => {
    // This is a bit of a hack to reset the state. A more robust solution might involve a key on the component.
    // For now, we'll just reload the page to get a clean state.
    window.location.reload();
  }

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (showResults) {
    return (
      <ScrollArea className="h-full w-full">
        <ResultsDisplay data={state.data} onReset={handleReset} />
      </ScrollArea>
    );
  }
  
  return (
    <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-8 px-4 text-center">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-medium tracking-tight text-foreground/90 sm:text-5xl">
                    Understand what you’re eating
                </h1>
                <p className="max-w-md text-foreground/60">
                    Upload a food label or paste ingredients to get a clear explanation.
                </p>
            </div>
            <IngredientForm formAction={formAction} isPending={isPending} />
        </div>
    </div>
  );
}
