'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Appliance } from '@/lib/types';
import ApplianceTable from '@/components/dashboard/ApplianceTable';
import AddApplianceModal from '@/components/dashboard/AddApplianceModal';
import { Zap, BarChart3, Activity } from 'lucide-react';

export default function DevicesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const { appliances, dashboard, removeAppliance, error, clearError } = useStore();

  const handleOpenAdd = () => {
    setEditingAppliance(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAppliance(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeAppliance(id);
    } catch {
      // error handled in store
    }
  };

  const summaryCards = [
    { icon: Zap, label: 'Total Devices', value: `${dashboard?.totalDevices ?? 0}` },
    { icon: Activity, label: 'Active Devices', value: `${dashboard?.activeDevices ?? 0}` },
    {
      icon: BarChart3,
      label: 'Total Monthly Usage',
      value: dashboard?.totalUnits ? `${dashboard.totalUnits} kWh` : '0 kWh',
    },
  ];

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Devices</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your connected appliances and track their energy usage</p>
        </div>

        {error && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] border border-[color-mix(in_srgb,var(--destructive)_35%,transparent)] text-destructive">
            <p className="text-sm font-medium">{error}</p>
            <button onClick={clearError} className="text-destructive/70 hover:text-destructive text-sm font-medium ml-4 transition-colors">Dismiss</button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <div key={card.label} className="card p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <CardIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{card.label}</p>
                  <p className="text-2xl font-semibold text-foreground truncate">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Device-wise breakdown bar chart */}
        {appliances.length > 0 && (
          <div className="card p-6">
            <h2 className="text-base font-semibold text-foreground mb-5">Device-wise Monthly Usage</h2>
            <div className="space-y-3">
              {appliances.map((app) => {
                const maxUnits = Math.max(...appliances.map((a) => a.monthlyUnits), 1);
                const pct = (app.monthlyUnits / maxUnits) * 100;
                return (
                  <div key={app._id} className="flex items-center gap-3">
                    <div className="w-36 flex-shrink-0 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">{app.name}</span>
                    </div>
                    <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-md transition-[width] duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${pct}%` }}
                      >
                        {pct > 25 && (
                          <span className="text-[10px] font-semibold text-primary-foreground">{app.monthlyUnits} kWh</span>
                        )}
                      </div>
                    </div>
                    {pct <= 25 && (
                      <span className="text-sm font-medium text-foreground w-24 text-right">
                        {app.monthlyUnits} kWh
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ApplianceTable
          appliances={appliances}
          onAddAppliance={handleOpenAdd}
          onEditAppliance={handleOpenEdit}
          onRemoveAppliance={handleDelete}
        />
      </div>

      {showAddModal && (
        <AddApplianceModal
          onClose={handleCloseModal}
          editingAppliance={editingAppliance}
        />
      )}
    </>
  );
}
