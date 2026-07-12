'use client';

import { useStore } from '@/lib/store';
import AIBudgetCard from '@/components/ai/AIBudgetCard';
import AIInsightsCard from '@/components/ai/AIInsightsCard';
import { Leaf, TrendingDown, Lightbulb, Target, Zap, Calculator } from 'lucide-react';

const RATE_PER_UNIT = 8;

function simulateSaving(watts: number, hoursPerDay: number, daysPerWeek: number, reduceHours: number) {
  const currentUnits = (watts * hoursPerDay * daysPerWeek * 4) / 1000;
  const reducedUnits = (watts * Math.max(0, hoursPerDay - reduceHours) * daysPerWeek * 4) / 1000;
  const savedUnits = currentUnits - reducedUnits;
  return { savedUnits: Math.round(savedUnits * 100) / 100, savedAmount: Math.round(savedUnits * RATE_PER_UNIT * 100) / 100 };
}

export default function SavingsPage() {
  const { dashboard, appliances } = useStore();

  const savings = dashboard?.savings;
  const topAppliance = dashboard?.topAppliance;

  const deviceSavings = appliances
    .filter((a) => a.status === 'active' && a.hoursPerDay > 1)
    .map((a) => {
      const sim = simulateSaving(a.watts, a.hoursPerDay, a.daysPerWeek, 1);
      return { ...a, ...sim };
    })
    .sort((a, b) => b.savedAmount - a.savedAmount);

  const totalPotentialSavings = deviceSavings.reduce((sum, d) => sum + d.savedAmount, 0);
  const totalPotentialUnits = deviceSavings.reduce((sum, d) => sum + d.savedUnits, 0);

  const topCards = [
    {
      icon: Leaf,
      label: 'Potential Monthly Savings',
      value: `₹${savings?.amount ?? Math.round(totalPotentialSavings)}`,
      sub: 'by reducing 1 hr/day on top consumer',
    },
    {
      icon: TrendingDown,
      label: 'Saveable Units',
      value: `${savings?.units ?? Math.round(totalPotentialUnits * 100) / 100} kWh`,
      sub: 'across all devices (1hr/day reduction)',
    },
    {
      icon: Target,
      label: 'Top Consumer',
      value: topAppliance?.name ?? 'None',
      sub: topAppliance ? `${topAppliance.monthlyUnits} kWh (${topAppliance.percentage}%)` : 'Add devices to see',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Savings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Smart recommendations to reduce your electricity bill</p>
      </div>

      {/* Top savings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCards.map((card) => {
          const CardIcon = card.icon;
          return (
            <div key={card.label} className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <CardIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{card.label}</p>
              </div>
              <p className="text-2xl font-semibold text-foreground truncate">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* AI Budget + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AIBudgetCard />
        <AIInsightsCard />
      </div>

      {/* Smart recommendations */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-warning" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Smart Recommendations</h2>
        </div>
        <div className="space-y-2.5">
          {savings?.tip && (
            <div className="p-4 rounded-lg border border-[color-mix(in_srgb,var(--warning)_35%,transparent)] bg-[color-mix(in_srgb,var(--warning)_10%,transparent)]">
              <p className="font-medium text-foreground text-sm">{savings.tip}</p>
              <p className="text-xs text-muted-foreground mt-1">This is your highest impact optimization</p>
            </div>
          )}
          {[
            {
              title: 'Shift heavy-load appliances to off-peak hours',
              desc: 'Use appliances between 10 PM - 6 AM for potential lower rates',
            },
            {
              title: 'Switch standby devices to active only when needed',
              desc: 'Standby devices still consume phantom power',
            },
            {
              title: 'Consider energy-efficient alternatives',
              desc: 'LED lighting, inverter ACs, and 5-star rated appliances reduce consumption significantly',
            },
          ].map((rec, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border bg-muted/40">
              <p className="font-medium text-foreground text-sm">{rec.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Device-by-device savings simulation */}
      {deviceSavings.length > 0 ? (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Calculator className="w-4 h-4 text-accent-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground">1 Hr/Day Reduction Simulation</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            If you reduce each active device by 1 hour per day, here&apos;s how much you can save:
          </p>
          <div className="space-y-2.5">
            {deviceSavings.map((d) => (
              <div key={d._id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/40">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.watts}W &middot; {d.hoursPerDay}h/day &rarr; {Math.max(0, d.hoursPerDay - 1)}h/day
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-success text-sm">₹{d.savedAmount}/mo</p>
                  <p className="text-xs text-muted-foreground">{d.savedUnits} kWh</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-border flex justify-between items-center">
            <p className="font-semibold text-foreground">Total Potential Savings</p>
            <p className="text-xl font-semibold text-success">₹{Math.round(totalPotentialSavings)}/mo</p>
          </div>
        </div>
      ) : (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
            <Leaf className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No savings data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add appliances with more than 1 hour daily usage to see savings simulations</p>
        </div>
      )}
    </div>
  );
}
