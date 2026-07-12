'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Appliance, ApplianceFormData } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddApplianceModalProps {
  onClose: () => void
  editingAppliance?: Appliance | null
}

const APPLIANCE_PRESETS: { name: string; watts: number }[] = [
  { name: 'Air Conditioner', watts: 1500 },
  { name: 'Refrigerator', watts: 200 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Water Heater', watts: 2000 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Television', watts: 100 },
  { name: 'Fan', watts: 75 },
  { name: 'Lighting', watts: 60 },
]

const RATE_PER_UNIT = 8 // ₹8/kWh — matches backend

export default function AddApplianceModal({
  onClose,
  editingAppliance,
}: AddApplianceModalProps) {
  const { addAppliance, updateAppliance } = useStore()

  const isEditing = !!editingAppliance

  const [form, setForm] = useState<ApplianceFormData>({
    name: editingAppliance?.name || '',
    watts: editingAppliance?.watts || '',
    hoursPerDay: editingAppliance?.hoursPerDay || '',
    daysPerWeek: editingAppliance?.daysPerWeek || 7,
    status: editingAppliance?.status || 'active',
  })

  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Live calculation preview
  const watts = Number(form.watts) || 0
  const hours = Number(form.hoursPerDay) || 0
  const days = Number(form.daysPerWeek) || 0
  const monthlyUnits = (watts * hours * days * 4) / 1000
  const monthlyCost = monthlyUnits * RATE_PER_UNIT

  const handleChange = (field: keyof ApplianceFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handlePresetClick = (preset: { name: string; watts: number }) => {
    setForm((prev) => ({ ...prev, name: preset.name, watts: preset.watts }))
    setErrors([])
  }

  const handleSubmit = async () => {
    // Client-side validation
    const validationErrors: string[] = []
    if (!form.name || !String(form.name).trim()) validationErrors.push('Name is required')
    if (!form.watts || Number(form.watts) < 1) validationErrors.push('Watts must be at least 1')
    if (form.hoursPerDay === '' || Number(form.hoursPerDay) < 0 || Number(form.hoursPerDay) > 24)
      validationErrors.push('Hours must be between 0 and 24')
    if (!form.daysPerWeek || Number(form.daysPerWeek) < 1 || Number(form.daysPerWeek) > 7)
      validationErrors.push('Days must be between 1 and 7')

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    try {
      if (isEditing && editingAppliance) {
        await updateAppliance(editingAppliance._id, form)
      } else {
        await addAppliance(form)
      }
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      setErrors([message])
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0f1b2d]/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="card w-full max-w-lg p-6 shadow-(--shadow-md) max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isEditing ? 'Edit Device' : 'Add Device'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing ? 'Update device details' : 'Register a new device to track'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[color-mix(in_srgb,var(--destructive)_14%,transparent)] border border-[color-mix(in_srgb,var(--destructive)_35%,transparent)]">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-destructive font-medium">
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="appliance-name">Device Name</Label>
            <Input
              id="appliance-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Air Conditioner"
            />
          </div>

          {/* Watts */}
          <div className="space-y-1.5">
            <Label htmlFor="appliance-watts">Power Rating (Watts)</Label>
            <Input
              id="appliance-watts"
              type="number"
              value={form.watts}
              onChange={(e) => handleChange('watts', e.target.value)}
              placeholder="e.g., 1500"
              min="1"
              max="50000"
            />
          </div>

          {/* Hours & Days row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="appliance-hours">Hours / Day</Label>
              <Input
                id="appliance-hours"
                type="number"
                value={form.hoursPerDay}
                onChange={(e) => handleChange('hoursPerDay', e.target.value)}
                placeholder="e.g., 8"
                min="0"
                max="24"
                step="0.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appliance-days">Days / Week</Label>
              <Input
                id="appliance-days"
                type="number"
                value={form.daysPerWeek}
                onChange={(e) => handleChange('daysPerWeek', e.target.value)}
                placeholder="e.g., 7"
                min="1"
                max="7"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <div className="flex gap-2">
              {(['active', 'standby'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('status', s)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors capitalize ${
                    form.status === s
                      ? 'bg-accent text-accent-foreground border-primary'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Calculation Preview */}
        {watts > 0 && hours > 0 && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-muted/40">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Estimated Monthly
            </p>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-2xl font-semibold text-foreground">
                {monthlyUnits.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kWh</span>
              </p>
              <p className="text-2xl font-semibold text-primary">
                ₹{Math.round(monthlyCost).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Presets — only show when adding */}
        {!isEditing && (
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Quick Add Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {APPLIANCE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-2.5 rounded-lg border text-sm transition-colors text-left ${
                    form.name === preset.name
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border hover:bg-muted text-foreground'
                  }`}
                >
                  <span className="block font-medium">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">{preset.watts}W</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Add Device'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
