'use client'

import { useState } from 'react'
import { Plus, Zap, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import type { Appliance } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ApplianceTableProps {
  appliances: Appliance[]
  onAddAppliance: () => void
  onEditAppliance: (appliance: Appliance) => void
  onRemoveAppliance: (id: string) => void
}

export default function ApplianceTable({
  appliances,
  onAddAppliance,
  onEditAppliance,
  onRemoveAppliance,
}: ApplianceTableProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return
    setDeleting(true)
    try {
      await onRemoveAppliance(confirmDeleteId)
    } finally {
      setConfirmDeleteId(null)
      setDeleting(false)
    }
  }

  const confirmAppliance = appliances.find((a) => a._id === confirmDeleteId)

  return (
    <>
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-0.5">Connected Devices</h2>
            <p className="text-xs text-muted-foreground">
              {appliances.length} device{appliances.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Button onClick={onAddAppliance} size="sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Device</span>
          </Button>
        </div>

        {appliances.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
              <Zap className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No devices added yet</p>
            <p className="text-sm mt-1">Click &quot;Add Device&quot; to start tracking your electricity usage</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Device
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">
                    Watts
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                    Hrs/Day
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Units/Mo
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">
                    Cost/Mo
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appliances.map((appliance, idx) => (
                  <tr
                    key={appliance._id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      idx === appliances.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Device Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4.5 h-4.5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{appliance.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appliance.daysPerWeek}d/week
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Watts */}
                    <td className="py-3.5 px-4 text-right hidden sm:table-cell">
                      <p className="text-foreground">{appliance.watts}W</p>
                    </td>

                    {/* Hours/Day */}
                    <td className="py-3.5 px-4 text-right hidden md:table-cell">
                      <p className="text-foreground">{appliance.hoursPerDay}h</p>
                    </td>

                    {/* Monthly Units */}
                    <td className="py-3.5 px-4 text-right">
                      <p className="font-medium text-foreground">
                        {appliance.monthlyUnits} kWh
                      </p>
                    </td>

                    {/* Monthly Cost */}
                    <td className="py-3.5 px-4 text-right hidden lg:table-cell">
                      <p className="font-medium text-foreground">
                        ₹{appliance.monthlyCost}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex justify-center">
                        <Badge tone={appliance.status === 'active' ? 'success' : 'neutral'}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            appliance.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                          }`} />
                          {appliance.status === 'active' ? 'Active' : 'Standby'}
                        </Badge>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => onEditAppliance(appliance)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit device"
                          aria-label="Edit device"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(appliance._id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                          title="Remove device"
                          aria-label="Remove device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && confirmAppliance && (
        <div className="fixed inset-0 bg-[#0f1b2d]/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card max-w-sm w-full p-6 shadow-(--shadow-md)">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-[color-mix(in_srgb,var(--destructive)_18%,transparent)] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Remove Device</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-6">
              Are you sure you want to remove <strong>{confirmAppliance.name}</strong> ({confirmAppliance.monthlyUnits} kWh/month)?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                id="confirm-delete-btn"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
