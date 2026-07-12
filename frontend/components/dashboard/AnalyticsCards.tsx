'use client'

import { Zap, DollarSign, Leaf, BarChart3 } from 'lucide-react'
import type { DashboardData } from '@/lib/types'
import { Card } from '@/components/ui/card'

interface AnalyticsCardsProps {
  dashboard: DashboardData | null
}

export default function AnalyticsCards({ dashboard }: AnalyticsCardsProps) {
  const cards = [
    {
      id: 'usage',
      title: 'Total Units',
      value: dashboard ? `${dashboard.totalUnits.toLocaleString()} kWh` : '—',
      change: 'Monthly consumption',
    },
    {
      id: 'bill',
      title: 'Estimated Bill',
      value: dashboard ? `₹${dashboard.totalBill.toLocaleString()}` : '—',
      change: dashboard ? `@₹${dashboard.ratePerUnit}/kWh` : '',
    },
    {
      id: 'top',
      title: 'Top Consumer',
      value: dashboard?.topAppliance?.name || 'N/A',
      change: dashboard?.topAppliance
        ? `${dashboard.topAppliance.monthlyUnits} kWh (${dashboard.topAppliance.percentage}%)`
        : 'No appliances yet',
    },
    {
      id: 'savings',
      title: 'Potential Savings',
      value: dashboard ? `₹${dashboard.savings.amount.toLocaleString()}` : '—',
      change: dashboard?.savings.units
        ? `${dashboard.savings.units} kWh saveable`
        : 'Add appliances to see savings',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        return (
          <Card key={card.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.title}
              </h3>
            </div>
            <p className="text-2xl font-semibold text-foreground mb-1 tracking-tight truncate">
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground">{card.change}</p>
          </Card>
        )
      })}
    </div>
  )
}
