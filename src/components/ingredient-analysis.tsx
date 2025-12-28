'use client';

import * as React from 'react';
import { useActionState, useEffect, useRef } from 'react';
import { analyzeIngredients, type FormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { IngredientForm } from '@/components/ingredient-form';
import { ResultsDisplay } from '@/components/results-display';
import { LoadingAnimation } from './loading-animation';

const initialState: FormState = { type: 'initial' };

function AnalysisSection({ onReset }: { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(analyzeIngredients, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.type === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.message,
      });
    }
    if (state.type === 'success') {
      // Reset the form for the next submission
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <IngredientForm formAction={formAction} formRef={formRef} />
      {isPending && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LoadingAnimation />
        </div>
      )}
      {state.type === 'success' && state.data && (
        <ResultsDisplay data={state.data} onReset={onReset} />
      )}
    </div>
  );
}


export function IngredientAnalysis() {
  // The key is used to force a re-render of the AnalysisSection to reset its state
  const [key, setKey] = React.useState(0);
  const handleReset = () => setKey(prev => prev + 1);

  return <AnalysisSection key={key} onReset={handleReset} />;
}
