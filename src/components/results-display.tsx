'use client';

import type { HighlightConcerningIngredientsOutput } from '@/ai/flows/highlight-concerning-ingredients';
import { Button } from './ui/button';
import {
  ArrowLeft,
  Bot,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
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

export function ResultsDisplay({
  data,
  onReset,
}: {
  data: HighlightConcerningIngredientsOutput;
  onReset: () => void;
}) {
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
            <p className="text-lg font-medium text-neutral-100">{data.summary}</p>
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
        <section className="text-center pt-4">
          <h3 className="text-lg font-semibold mb-3 text-neutral-200">
            Suggested Next Steps
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.suggestedActions.map((action, index) => (
              <Button
                key={index}
                variant="link"
                className="text-accent hover:text-accent/80"
              >
                {action}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
