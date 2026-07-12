import { ReactNode } from 'react';

interface DashboardLayoutProps {
  desktopSidebar: ReactNode;
  mobileSidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function DashboardLayout({
  desktopSidebar,
  mobileSidebar,
  topbar,
  children,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen dot-grid text-foreground overflow-hidden flex flex-col">
      {/* Floating glass navbar (matches the sidebar) */}
      <div className="flex-shrink-0 px-3 pt-3 z-20">{topbar}</div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar — floating glass panel, collapsible to an icon rail */}
        <div
          className={`hidden md:block flex-shrink-0 transition-[width] duration-300 ease-out ${
            collapsed ? 'w-[84px]' : 'w-64'
          }`}
        >
          <div className="h-full p-3 pr-0">
            <div className="h-full glass-panel rounded-2xl overflow-y-auto">{desktopSidebar}</div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-60 md:hidden">
            <div
              className="absolute inset-0 bg-[#0f1b2d]/50 animate-fade-in"
              onClick={onCloseMobile}
            />
            <div className="relative w-72 max-w-[82%] h-full z-10 bg-card border-r border-border shadow-(--shadow-md) overflow-y-auto animate-fade-in">
              {mobileSidebar}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <div className="p-4 md:px-6 md:py-6 max-w-[1600px] mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
