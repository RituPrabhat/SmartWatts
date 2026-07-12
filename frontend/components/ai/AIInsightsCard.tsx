'use client';

import React, { useEffect } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, Info, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

const typeIcons = {
  warning: AlertTriangle,
  tip: Lightbulb,
  info: Info,
};

const iconColors = {
  high: 'text-destructive',
  medium: 'text-warning',
  low: 'text-primary',
};

export default function AIInsightsCard() {
  const { insights, insightsLoading, fetchInsights } = useAIStore();
  const appliances = useStore((s) => s.appliances);
  const hasAppliances = appliances.length > 0;

  useEffect(() => {
    if (hasAppliances) {
      fetchInsights();
    }
  }, [hasAppliances, fetchInsights]);

  if (appliances.length === 0) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="text-base font-semibold text-foreground">AI Insights</h2>
        </div>
        <button
          onClick={() => fetchInsights(true)}
          disabled={insightsLoading}
          className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-40 text-muted-foreground"
          aria-label="Refresh insights"
        >
          <RefreshCw className={`w-4 h-4 ${insightsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {insightsLoading && insights.length === 0 ? (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-3 rounded-lg border border-border animate-pulse">
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-2.5">
          {insights.map((insight, idx) => {
            const Icon = typeIcons[insight.type] || Info;
            const iconColor = iconColors[insight.severity] || iconColors.low;
            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-muted/40"
              >
                <div className="flex gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
                  <p className="text-sm text-foreground leading-relaxed">{insight.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No insights available yet.</p>
      )}
    </div>
  );
}
