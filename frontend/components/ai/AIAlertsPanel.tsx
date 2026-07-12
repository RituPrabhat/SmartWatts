'use client';

import React, { useEffect } from 'react';
import { Bell, TrendingUp, Wallet, Zap, X } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';
import { useStore } from '@/lib/store';

const alertIcons = {
  spike: TrendingUp,
  budget: Wallet,
  efficiency: Zap,
};

const alertStyles = {
  high: {
    icon: 'text-destructive',
    dot: 'bg-destructive',
  },
  medium: {
    icon: 'text-warning',
    dot: 'bg-warning',
  },
  low: {
    icon: 'text-primary',
    dot: 'bg-primary',
  },
};

export default function AIAlertsPanel() {
  const { alerts, alertsLoading, fetchAlerts } = useAIStore();
  const appliances = useStore((s) => s.appliances);
  const hasAppliances = appliances.length > 0;
  const [dismissed, setDismissed] = React.useState<Set<number>>(new Set());

  useEffect(() => {
    if (hasAppliances) {
      fetchAlerts();
    }
  }, [hasAppliances, fetchAlerts]);

  const visibleAlerts = alerts.filter((_, i) => !dismissed.has(i));

  if (appliances.length === 0 || visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert, idx) => {
        const realIdx = alerts.indexOf(alert);
        const Icon = alertIcons[alert.type] || Bell;
        const styles = alertStyles[alert.severity] || alertStyles.low;

        return (
          <div
            key={idx}
            className="card p-4 flex items-start gap-3 group"
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <Icon className={`w-5 h-5 ${styles.icon}`} />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${styles.dot}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(realIdx))}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0 text-muted-foreground"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
