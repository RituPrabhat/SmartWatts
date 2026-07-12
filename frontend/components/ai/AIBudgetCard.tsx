'use client';

import React, { useEffect, useState } from 'react';
import { Wallet, Sparkles, RefreshCw } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function AIBudgetCard() {
  const { budget, budgetAdvice, budgetLoading, fetchBudget, updateBudget, fetchBudgetAdvice } = useAIStore();
  const dashboard = useStore((s) => s.dashboard);
  const appliances = useStore((s) => s.appliances);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false);
  const hasAppliances = appliances.length > 0;

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  useEffect(() => {
    if (budget && hasAppliances) {
      fetchBudgetAdvice();
    }
  }, [budget, hasAppliances, fetchBudgetAdvice]);

  const handleSetBudget = async () => {
    const amount = Number(inputValue);
    if (amount > 0) {
      await updateBudget(amount);
      setEditing(false);
      setInputValue('');
    }
  };

  const monthlyBill = dashboard?.totalBill ?? 0;
  const overBudget = budget ? monthlyBill > budget : false;
  const diff = budget ? Math.abs(monthlyBill - budget) : 0;
  const budgetPercent = budget ? Math.min((monthlyBill / budget) * 100, 100) : 0;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Wallet className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Budget Optimizer</h2>
        </div>
        {budget && budgetAdvice && (
          <button
            onClick={() => fetchBudgetAdvice(true)}
            disabled={budgetLoading}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-40 text-muted-foreground"
            aria-label="Refresh advice"
          >
            <RefreshCw className={`w-4 h-4 ${budgetLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!budget || editing ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Set your monthly electricity budget to get AI-powered optimization tips.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">₹</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 2000"
                min="1"
                className="w-full h-10 pl-7 pr-3 rounded-md border border-input bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 transition-colors"
              />
            </div>
            <Button onClick={handleSetBudget} disabled={!inputValue || Number(inputValue) <= 0}>
              Set
            </Button>
            {budget && (
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Budget status */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Monthly Budget</p>
              <p className="text-lg font-semibold text-foreground">₹{budget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Current Bill</p>
              <p className={`text-lg font-semibold ${overBudget ? 'text-destructive' : 'text-success'}`}>
                ₹{monthlyBill.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-500 ${
                  overBudget ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className={`text-center text-xs font-medium ${
              overBudget ? 'text-destructive' : 'text-success'
            }`}>
              {overBudget ? `Over budget by ₹${Math.round(diff)}` : `Under budget by ₹${Math.round(diff)}`}
            </div>
          </div>

          {/* AI advice */}
          {budgetLoading && !budgetAdvice ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-4/5 bg-muted rounded" />
            </div>
          ) : budgetAdvice ? (
            <div className="p-3 rounded-lg bg-accent border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]">
              <div className="flex gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-accent-foreground uppercase tracking-wide">AI Recommendation</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{budgetAdvice}</p>
            </div>
          ) : null}

          <button
            onClick={() => { setEditing(true); setInputValue(String(budget)); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors hover:bg-muted py-2 rounded-md"
          >
            Change budget
          </button>
        </div>
      )}
    </div>
  );
}
