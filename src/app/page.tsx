'use client';

import { IngredientAnalysis } from '@/components/ingredient-analysis';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <IngredientAnalysis />
      </div>
    </main>
  );
}
