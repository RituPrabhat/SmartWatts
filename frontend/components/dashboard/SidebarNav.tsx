'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  TrendingDown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';

type NavItem = { icon: LucideIcon; label: string; href: string };

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Zap, label: 'Devices', href: '/devices' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: TrendingDown, label: 'Savings', href: '/savings' },
];

const accountItems: NavItem[] = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', href: '/support' },
];

interface SidebarNavProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}

export default function SidebarNav({ collapsed = false, onToggle, onNavigate, onClose }: SidebarNavProps) {
  const pathname = usePathname();
  const dashboard = useStore((s) => s.dashboard);
  const { logout } = useAuth();

  const totalUnits = dashboard?.totalUnits || 0;
  const totalDevices = dashboard?.totalDevices || 0;
  const activeDevices = dashboard?.activeDevices || 0;

  const usagePct = totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0;

  const rowClass = (isActive: boolean) =>
    `flex items-center rounded-lg text-sm transition-colors ${
      collapsed ? 'justify-center py-2.5' : 'gap-3 px-3 py-2'
    } ${
      isActive
        ? 'bg-accent text-accent-foreground font-medium'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
        className={rowClass(isActive)}
      >
        <item.icon className="w-4.5 h-4.5 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className={`h-full flex flex-col ${collapsed ? 'p-2' : 'p-3'}`}>
      {/* Close button — mobile drawer only */}
      {onClose && (
        <div className="flex justify-end mb-1">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Primary nav */}
      <nav className="space-y-1">{navItems.map(renderItem)}</nav>

      {/* Monthly Usage stat — expanded only */}
      {!collapsed && (
        <div className="mt-4 p-4 card">
          <p className="text-[11px] text-muted-foreground mb-2 font-medium tracking-wide uppercase">
            Monthly Usage
          </p>
          <p className="text-xl font-semibold text-foreground mb-3">
            {totalUnits > 0 ? `${totalUnits.toLocaleString()} kWh` : '—'}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-[width] duration-500"
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground whitespace-nowrap">
              {dashboard ? `${activeDevices}/${totalDevices} active` : 'Loading...'}
            </p>
          </div>
        </div>
      )}

      {/* Spacer pushes the footer to the bottom */}
      <div className="flex-1" />

      {/* Account footer */}
      <div className="border-t border-border pt-3 space-y-1">
        {accountItems.map(renderItem)}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full ${rowClass(false)} hover:text-destructive`}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse control */}
      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`mt-2 w-full ${rowClass(false)}`}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4.5 h-4.5 shrink-0" />
          ) : (
            <PanelLeftClose className="w-4.5 h-4.5 shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </div>
  );
}
