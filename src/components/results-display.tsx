'use client';

import type { HighlightConcerningIngredientsOutput } from '@/ai/flows/highlight-concerning-ingredients';
import {
  Bot,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  Minus,
  Equal,
  Lightbulb,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

const confidenceConfig = {
  high: {
    label: 'High Confidence',
    icon: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  },
  medium: {
    label: 'Medium Confidence',
    icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  },
  low: {
    label: 'Low Confidence',
    icon: <HelpCircle className="h-4 w-4 text-red-400" />,
  },
};

const NutritionFact: React.FC<{ fact: string }> = ({ fact }) => {
  if (!fact) return null;
  const factLower = fact.toLowerCase();
  let icon = <Equal className="text-neutral-400" />;
  if (factLower.includes('low') || factLower.includes('good source')) {
    icon = <Plus className="text-green-400" />;
  } else if (factLower.includes('high') || factLower.includes('moderate')) {
    icon = <Minus className="text-red-400" />;
  }

  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 h-5 w-5 flex-shrink-0">{icon}</div>
      <p className="text-neutral-200">{fact.trim()}{fact.endsWith('.') ? '' : '.'}</p>
    </li>
  );
};

export function ResultsDisplay({
  data,
  onReset,
}: {
  data: HighlightConcerningIngredientsOutput;
  onReset: () => void;
}) {
  const isNutritionAnalysis = data.highlights.length > 0 && data.highlights.some(h => ['sodium', 'carbohydrates', 'dietary fiber', 'protein', 'fat', 'sugar'].includes(h.ingredient.toLowerCase()));

  const nutritionFacts = isNutritionAnalysis
    ? data.summary.split('.').filter(s => s.trim().length > 0)
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in-50 duration-500 space-y-8 px-4 py-12">
       <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">Analysis Results</h1>
            </div>
            <Button variant="ghost" onClick={onReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Analysis
            </Button>
       </div>
       
       <div className="space-y-8">
          {isNutritionAnalysis ? (
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Nutrition Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {nutritionFacts.map((fact, index) => (
                    <NutritionFact key={index} fact={fact} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
             <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <span>AI Summary</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-medium text-neutral-100 leading-relaxed">{data.summary}</p>
                </CardContent>
            </Card>
          )}

          {data.highlights.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-neutral-200">
                Highlighted Ingredients
              </h2>
              <Accordion type="multiple" className="w-full space-y-3">
                {data.highlights.map((highlight, index) => (
                  <AccordionItem
                    value={`item-${index}`}
                    key={index}
                    className="bg-card/50 border-border rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="p-4 font-semibold hover:no-underline text-base">
                      <span className="text-left">{highlight.ingredient}</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 space-y-4 border-t border-border">
                      <div>
                        <h4 className="font-semibold text-neutral-300 mb-1">
                          Why it matters
                        </h4>
                        <p className="text-neutral-300">{highlight.reason}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-300 mb-2">
                          Confidence Level
                        </h4>
                        <div className="flex items-center gap-2">
                          {confidenceConfig[highlight.confidence]?.icon}
                          <span className="text-neutral-200">
                            {confidenceConfig[highlight.confidence]?.label}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          {data.uncertaintyNote && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-yellow-400 text-lg">Uncertainty Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-300">{data.uncertaintyNote}</p>
              </CardContent>
            </Card>
          )}

          {data.suggestedActions.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-neutral-200">
                Suggested Next Steps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.suggestedActions.map((action, index) => (
                  <Card
                    key={index}
                    className="bg-card/60 hover:bg-card/90 transition-colors border-primary/20 hover:border-primary/40"
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Lightbulb className="h-5 w-5 text-accent" />
                      </div>
                      <p className="text-sm font-medium text-neutral-200">
                        {action}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
  );
}
