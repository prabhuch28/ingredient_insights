'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { analyzeIngredients, type FormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { IngredientForm } from '@/components/ingredient-form';
import { ResultsDisplay } from '@/components/results-display';

const initialState: FormState = { type: 'initial' };

export function IngredientAnalysis({ onReset }: { onReset: () => void }) {
  const [state, formAction] = useFormState(analyzeIngredients, initialState);
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

  if (state.type === 'success' && state.data) {
    return <ResultsDisplay data={state.data} onReset={onReset} />;
  }

  return <IngredientForm formAction={formAction} />;
}
