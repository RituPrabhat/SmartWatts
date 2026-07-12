import { AlertCircle, Lightbulb, TrendingUp, Target } from 'lucide-react'
import type { DashboardData } from '@/lib/types'

interface InsightsPanelProps {
  dashboard: DashboardData | null
}

export default function InsightsPanel({ dashboard }: InsightsPanelProps) {
  const totalUnits = dashboard?.totalUnits || 0

  const insights = [
    {
      icon: Lightbulb,
      title: dashboard?.savings.tip || 'Add appliances to see savings tips',
      description: dashboard?.savings.amount
        ? `Potential saving: ₹${dashboard.savings.amount}/month`
        : 'Log your devices to get personalized recommendations',
      color: 'text-warning',
    },
    {
      icon: TrendingUp,
      title: 'Peak hours detection',
      description: 'Shift heavy-load appliances to off-peak hours (10 PM – 6 AM) for lower rates',
      color: 'text-primary',
    },
    {
      icon: Target,
      title: 'Monthly projection',
      description: totalUnits > 0
        ? `On track to consume ${totalUnits.toLocaleString()} kWh this month`
        : 'Add devices to see your monthly projection',
      color: 'text-success',
    },
  ]

  return (
    <div className="space-y-5">
      {/* Smart Insights */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Smart Insights</h2>

        <div className="space-y-2.5">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-border bg-muted/40"
            >
              <div className="flex gap-3">
                <insight.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${insight.color}`} />
                <div>
                  <p className="font-medium text-foreground text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Energy Consumer Card */}
      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Top Energy Consumer</h3>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </div>

          {dashboard?.topAppliance ? (
            <>
              <p className="text-xl font-semibold text-foreground">{dashboard.topAppliance.name}</p>

              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-medium text-foreground">
                    {dashboard.topAppliance.monthlyUnits} kWh ({dashboard.topAppliance.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-[width] duration-500"
                    style={{ width: `${dashboard.topAppliance.percentage}%` }}
                  />
                </div>
              </div>

              {dashboard.savings.amount > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saveable</span>
                    <span className="font-medium text-success">₹{dashboard.savings.amount}/mo</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">No devices added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
