'use client';

import { motion } from 'framer-motion';

import type { HighlightConcerningIngredientsOutput } from '@/app/actions';
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
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  medium: {
    label: 'Medium Confidence',
    icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  low: {
    label: 'Low Confidence',
    icon: <HelpCircle className="h-4 w-4 text-orange-600" />,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
};

const NutritionFact: React.FC<{ fact: string }> = ({ fact }) => {
  if (!fact) return null;
  const factLower = fact.toLowerCase();
  let icon = <Equal className="text-gray-500" />;
  if (factLower.includes('low') || factLower.includes('good source')) {
    icon = <Plus className="text-green-600" />;
  } else if (factLower.includes('high') || factLower.includes('moderate')) {
    icon = <Minus className="text-orange-600" />;
  }

  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 h-5 w-5 flex-shrink-0">{icon}</div>
      <p className="text-gray-700 leading-relaxed">{fact.trim()}{fact.endsWith('.') ? '' : '.'}</p>
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
    <motion.div
      className="w-full max-w-4xl mx-auto space-y-8 px-4 pt-24 pb-12 perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'hsl(25, 30%, 15%)' }}>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tatva</span>
              <span className="ml-1">.ai</span> Analysis
            </h1>
            <p className="text-sm" style={{ color: 'hsl(25, 20%, 35%)' }}>Your friendly nutrition assistant</p>
          </div>
        </div>
        <Button variant="outline" onClick={onReset} className="warm-button">
          <RotateCcw className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
      </div>

      <div className="space-y-8">
        {isNutritionAnalysis ? (
          <motion.div
            initial={{ opacity: 0, rotateX: -15, z: -50 }}
            animate={{ opacity: 1, rotateX: 0, z: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="ingredient-card"
          >
            <Card className="bg-white/95 border-primary/20 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(25, 30%, 15%)' }}>
                  <FileText className="h-5 w-5 text-primary" />
                  Nutrition Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {nutritionFacts.map((fact, index) => (
                    <NutritionFact key={index} fact={fact} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, rotateX: -15, z: -50 }}
            animate={{ opacity: 1, rotateX: 0, z: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="ingredient-card"
          >
            <Card className="bg-white/95 border-primary/20 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span style={{ color: 'hsl(25, 30%, 15%)' }}>What I Found</span>
                    <p className="text-sm font-normal mt-1" style={{ color: 'hsl(25, 20%, 35%)' }}>Here's what stands out about this product</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: 'hsl(25, 25%, 25%)' }}>{data.summary}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {data.highlights.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'hsl(25, 30%, 15%)' }}>Ingredients Worth Knowing</h2>
                <p className="text-sm" style={{ color: 'hsl(25, 20%, 35%)' }}>Here are a few ingredients that caught my attention</p>
              </div>
            </div>
            <div className="space-y-4">
              {data.highlights.map((highlight: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50, rotateY: -20 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="card-3d"
                >
                  <Card
                    className="bg-white/95 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 shadow-lg"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                          {confidenceConfig[highlight.confidence as keyof typeof confidenceConfig]?.icon}
                        </div>
                        <CardTitle className="text-lg font-medium" style={{ color: 'hsl(25, 30%, 15%)' }}>
                          {highlight.ingredient}
                        </CardTitle>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${confidenceConfig[highlight.confidence as keyof typeof confidenceConfig]?.bg} ${confidenceConfig[highlight.confidence as keyof typeof confidenceConfig]?.border} border`}>
                        {confidenceConfig[highlight.confidence as keyof typeof confidenceConfig]?.icon}
                        <span className={`text-xs font-medium ${confidenceConfig[highlight.confidence as keyof typeof confidenceConfig]?.color}`}>
                          {confidenceConfig[highlight.confidence as keyof typeof confidenceConfig]?.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 border border-amber-300 mt-0.5">
                          <Lightbulb className="h-3 w-3 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 text-sm" style={{ color: 'hsl(25, 25%, 30%)' }}>
                            Why this matters
                          </h4>
                          <p className="leading-relaxed text-sm" style={{ color: 'hsl(25, 20%, 40%)' }}>{highlight.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {data.uncertaintyNote && (
          <Card className="bg-yellow-50 border-yellow-300 border-2">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <AlertTriangle className="h-5 w-5 text-yellow-700" />
              <CardTitle className="text-yellow-800 text-lg">Uncertainty Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-900 leading-relaxed">{data.uncertaintyNote}</p>
            </CardContent>
          </Card>
        )}

        {data.suggestedActions.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'hsl(25, 30%, 15%)' }}>Helpful Suggestions</h2>
                <p className="text-sm" style={{ color: 'hsl(25, 20%, 35%)' }}>Here are some ideas to consider</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.suggestedActions.map((action: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, z: -30 }}
                  animate={{ opacity: 1, scale: 1, z: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, z: 10 }}
                >
                  <Card
                    className="bg-white/95 border-primary/20 backdrop-blur-sm hover:border-accent/40 transition-all duration-300 shadow-md"
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: 'hsl(25, 25%, 25%)' }}>
                        {action}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
