'use client';

import { useState } from 'react';
import { IngredientAnalysis } from '@/components/ingredient-analysis';

export default function Home() {
  const [pageKey, setPageKey] = useState(0);

  const handleReset = () => {
    setPageKey((prevKey) => prevKey + 1);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <IngredientAnalysis key={pageKey} onReset={handleReset} />
      </div>
    </main>
  );
}
