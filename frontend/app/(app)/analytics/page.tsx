'use client';

import { useStore } from '@/lib/store';
import ChartsSection from '@/components/dashboard/ChartsSection';
import AIMonthlyReport from '@/components/ai/AIMonthlyReport';
import AIInsightsCard from '@/components/ai/AIInsightsCard';
import { BarChart3, TrendingUp, Zap, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { dashboard, weeklyTrend, appliances } = useStore();

  const totalUnits = dashboard?.totalUnits ?? 0;
  const totalBill = dashboard?.totalBill ?? 0;

  const statCards = [
    {  label: 'Monthly Units', value: `${totalUnits} kWh` },
    {  label: 'Monthly Bill', value: `₹${totalBill.toLocaleString()}` },
    {  label: 'Active Devices', value: `${dashboard?.activeDevices ?? 0}` },
    {
      label: 'Avg per Device',
      value: appliances.length > 0 ? `${(totalUnits / appliances.length).toFixed(1)} kWh` : '0 kWh',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Detailed energy consumption insights and trends</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          return (
            <div key={card.label} className="card p-5 flex items-center gap-4">
             
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{card.label}</p>
                <p className="text-xl font-semibold text-foreground truncate">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <ChartsSection dashboard={dashboard} weeklyTrend={weeklyTrend} />

      {/* AI Report + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AIMonthlyReport />
        <AIInsightsCard />
      </div>

      {/* Cost breakdown table */}
      {appliances.length > 0 && (
        <div className="card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Appliance Cost Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Device</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Watts</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Hrs/Day</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Days/Week</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Units/Mo</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Cost/Mo</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard?.breakdown ?? []).map((b, idx) => (
                  <tr
                    key={b._id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${idx === (dashboard?.breakdown?.length ?? 0) - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{b.name}</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.watts}W</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.hoursPerDay}h</td>
                    <td className="py-3 px-4 text-right text-foreground">{b.daysPerWeek}d</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">{b.monthlyUnits} kWh</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">₹{b.monthlyCost}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${b.percentage}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground font-medium text-xs w-8">{b.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {appliances.length === 0 && (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No analytics data yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add appliances from the Devices page to see analytics</p>
        </div>
      )}
    </div>
  );
}
