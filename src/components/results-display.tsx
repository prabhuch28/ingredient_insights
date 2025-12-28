'use client';

import type { HighlightConcerningIngredientsOutput } from '@/ai/flows/highlight-concerning-ingredients';
import { Button } from './ui/button';
import {
  ArrowLeft,
  Bot,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  Minus,
  Equal,
  Lightbulb,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
  const isNutritionAnalysis = data.highlights.length === 0 && (data.summary.includes('Nutrition Facts') || data.uncertaintyNote?.toLowerCase().includes('nutrition'));
  
  const nutritionFacts = isNutritionAnalysis
    ? data.summary.split('.').filter(s => s.trim().length > 0)
    : [];

  return (
    <div className="w-full animate-in fade-in-50 duration-500 space-y-8">
      <header className="space-y-4">
        <Button
          onClick={onReset}
          variant="ghost"
          className="text-accent hover:text-accent/80 px-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Analyze Another
        </Button>
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Bot className="h-8 w-8 text-accent" />
              <span>AI Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isNutritionAnalysis ? (
               <ul className="space-y-3">
                {nutritionFacts.map((fact, index) => (
                  <NutritionFact key={index} fact={fact} />
                ))}
              </ul>
            ) : (
              <p className="text-lg font-medium text-neutral-100">{data.summary}</p>
            )}
          </CardContent>
        </Card>
      </header>

      {data.highlights.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-neutral-200">
            Highlighted Ingredients
          </h2>
          <Accordion type="multiple" className="w-full space-y-3">
            {data.highlights.map((highlight, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="bg-card/80 backdrop-blur-sm border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
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
                      {confidenceConfig[highlight.confidence].icon}
                      <span className="text-neutral-200">
                        {confidenceConfig[highlight.confidence].label}
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              <span>Uncertainty Note</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-300">{data.uncertaintyNote}</p>
          </CardContent>
        </Card>
      )}

      {data.suggestedActions.length > 0 && (
        <section>
        <h2 className="text-xl font-bold mb-4 text-neutral-200">
          Suggested Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.suggestedActions.map((action, index) => (
            <Card
              key={index}
              className="bg-card/60 hover:bg-card/90 transition-colors border-primary/20 hover:border-primary/50 cursor-pointer"
            >
              <CardContent className="p-4 flex items-start gap-4">
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
  );
}
