'use client';

import Link from 'next/link';
import { Menu, Settings, Bell, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface TopNavbarProps {
  onOpenMobile: () => void;
}

export default function TopNavbar({ onOpenMobile }: TopNavbarProps) {
  const { user } = useAuth();

  return (
    <div className="h-14 glass-panel rounded-2xl flex items-center justify-between px-4 md:px-5">
      {/* Left side */}
      <div className="flex items-center gap-2">
        {/* Mobile-only menu button to open the sidebar drawer */}
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 -ml-1 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">SmartWatts</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <Link
          href="/settings"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Link>

        <Link href="/settings" className="hidden sm:flex items-center gap-2.5 pl-3 ml-2 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground leading-tight">{user?.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ''}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-semibold text-xs">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
