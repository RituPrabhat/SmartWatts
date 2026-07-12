'use client';

import { useAuth } from '@/lib/auth';
import AIBudgetCard from '@/components/ai/AIBudgetCard';
import { Button } from '@/components/ui/button';
import { User, Mail, LogOut, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/40">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-semibold text-xl">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success border-2 border-card" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{user?.name ?? 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/40">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Name</p>
                <p className="text-sm font-medium text-foreground">{user?.name ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/40">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-foreground truncate">{user?.email ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget setting */}
      <AIBudgetCard />

      {/* Rate info */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Electricity Rate</h2>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/40">
          <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center">
            <Zap className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">₹8 per kWh</p>
            <p className="text-xs text-muted-foreground">Default Indian electricity rate (customization coming soon)</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Account Actions</h2>
        <Button variant="destructive" onClick={logout}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
