import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, Folder, Layers, Package, Users, 
  MessageSquare, Percent, Image, Sliders, BarChart2, Settings, ListCollapse, LogOut, Camera
} from 'lucide-react';

export type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'categories' 
  | 'collections' 
  | 'orders' 
  | 'customers' 
  | 'reviews' 
  | 'promotions' 
  | 'media' 
  | 'homepage' 
  | 'analytics' 
  | 'settings'
  | 'inspiration';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  adminName: string;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  adminName, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Products', icon: ShoppingBag },
    { id: 'categories' as AdminTab, label: 'Categories', icon: Folder },
    { id: 'collections' as AdminTab, label: 'Collections', icon: Layers },
    { id: 'orders' as AdminTab, label: 'Orders', icon: Package },
    { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
    { id: 'reviews' as AdminTab, label: 'Reviews', icon: MessageSquare },
    { id: 'promotions' as AdminTab, label: 'Promotions', icon: Percent },
    { id: 'media' as AdminTab, label: 'Media Library', icon: Image },
    { id: 'inspiration' as AdminTab, label: 'Lookbook Posts', icon: Camera },
    { id: 'homepage' as AdminTab, label: 'Homepage Content', icon: Sliders },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart2 },
    { id: 'settings' as AdminTab, label: 'Atelier Settings', icon: Settings },
  ];

  return (
    <aside 
      className="bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between w-full h-full min-h-screen text-zinc-300 select-none pb-6"
      id="admin-solid-sidebar"
    >
      {/* Upper header section */}
      <div className="space-y-6">
        <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-display font-bold tracking-widest text-xs text-white uppercase">Atelier Admin</h1>
            <p className="text-[10px] text-zinc-550 font-mono tracking-wider">{adminName || 'Verified Curator'}</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System online"/>
        </div>

        {/* Scrollable menu slots */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-zinc-850">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded text-xxs font-mono font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-zinc-900 text-luxury-gold border-l-2 border-luxury-gold pl-3 font-semibold' 
                    : 'hover:bg-zinc-905 hover:text-white border-l-2 border-transparent'
                }`}
                id={`sidebar-tab-${item.id}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-luxury-gold' : 'text-zinc-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Downward Logout utility */}
      <div className="px-4 pt-4 border-t border-zinc-900">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-900 rounded hover:bg-rose-950 hover:text-rose-200 transition-colors text-xxs font-mono uppercase tracking-wider cursor-pointer border-none"
          id="sidebar-logout-btn"
        >
          <LogOut className="h-4 w-4 shrink-0 text-zinc-500 hover:text-rose-400" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};
