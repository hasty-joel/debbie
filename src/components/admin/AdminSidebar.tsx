import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Folder, Layers, Package, Users, 
  MessageSquare, Percent, Image, Sliders, BarChart2, Settings, ListCollapse, LogOut, Camera,
  ChevronDown, ChevronRight, Inbox, HelpCircle
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

interface GroupItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: { id: AdminTab; label: string; icon: React.ComponentType<any> }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  adminName, 
  onLogout 
}) => {
  const groups: GroupItem[] = [
    {
      id: 'dashboard_group',
      label: 'Performance',
      icon: LayoutDashboard,
      items: [
        { id: 'overview', label: 'Metrics Overview', icon: BarChart2 },
        { id: 'analytics', label: 'Store Analytics', icon: Sliders },
      ]
    },
    {
      id: 'catalog_group',
      label: 'Catalog & Stock',
      icon: ShoppingBag,
      items: [
        { id: 'products', label: 'Garments Blueprints', icon: Package },
        { id: 'categories', label: 'Classifications', icon: Folder },
        { id: 'collections', label: 'Style Collections', icon: Layers },
      ]
    },
    {
      id: 'operations_group',
      label: 'Fulfillment',
      icon: Inbox,
      items: [
        { id: 'orders', label: 'Logistics Orders', icon: Package },
        { id: 'customers', label: 'Customer Rolls', icon: Users },
        { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
      ]
    },
    {
      id: 'marketing_group',
      label: 'Marketing & Creative',
      icon: Percent,
      items: [
        { id: 'promotions', label: 'Discount Codes', icon: Percent },
        { id: 'inspiration', label: 'Lookbook Posts', icon: Camera },
        { id: 'homepage', label: 'Homepage Content', icon: Sliders },
      ]
    }
  ];

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard_group: activeTab === 'overview' || activeTab === 'analytics',
    catalog_group: activeTab === 'products' || activeTab === 'categories' || activeTab === 'collections',
    operations_group: activeTab === 'orders' || activeTab === 'customers' || activeTab === 'reviews',
    marketing_group: activeTab === 'promotions' || activeTab === 'inspiration' || activeTab === 'homepage',
  });

  // Auto-expand group when active tab changes externally
  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'analytics') {
      setExpandedGroups(prev => ({ ...prev, dashboard_group: true }));
    } else if (activeTab === 'products' || activeTab === 'categories' || activeTab === 'collections') {
      setExpandedGroups(prev => ({ ...prev, catalog_group: true }));
    } else if (activeTab === 'orders' || activeTab === 'customers' || activeTab === 'reviews') {
      setExpandedGroups(prev => ({ ...prev, operations_group: true }));
    } else if (activeTab === 'promotions' || activeTab === 'inspiration' || activeTab === 'homepage') {
      setExpandedGroups(prev => ({ ...prev, marketing_group: true }));
    }
  }, [activeTab]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <aside 
      className="bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between w-full h-full min-h-screen text-zinc-300 select-none pb-6"
      id="admin-solid-sidebar"
    >
      {/* Upper header section */}
      <div className="space-y-4">
        <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-display font-bold tracking-widest text-xs text-white uppercase">Debbie Admin</h1>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wider">{adminName || 'Verified Curator'}</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="System online"/>
        </div>

        {/* Scrollable menu slots */}
        <nav className="px-3 space-y-2 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-zinc-850">
          
          {/* Accordion Groups */}
          {groups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = !!expandedGroups[group.id];
            const hasActiveChild = group.items.some(item => item.id === activeTab);

            return (
              <div key={group.id} className="space-y-1">
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded text-xxs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${
                    hasActiveChild 
                      ? 'text-luxury-gold bg-zinc-900/40' 
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <GroupIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>{group.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                  )}
                </button>

                {/* Sub-items list */}
                {isExpanded && (
                  <div className="pl-3.5 ml-2 border-l border-zinc-800/80 space-y-0.5 pt-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center space-x-2.5 px-3.5 py-1.5 rounded text-[11px] font-mono font-medium tracking-wide transition-all cursor-pointer ${
                            isActive 
                              ? 'text-white font-semibold bg-zinc-900/70 border-l-2 border-luxury-gold pl-2.5' 
                              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30'
                          }`}
                          id={`sidebar-tab-${item.id}`}
                        >
                          <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-luxury-gold' : 'text-zinc-600'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Standalone Items Section */}
          <div className="pt-2 border-t border-zinc-900/60 space-y-1">
            {/* Media Vault */}
            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded text-xxs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-zinc-900 text-luxury-gold border-l-2 border-luxury-gold pl-3 font-semibold' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
              id="sidebar-tab-media"
            >
              <Image className={`h-3.5 w-3.5 shrink-0 ${activeTab === 'media' ? 'text-luxury-gold' : 'text-zinc-500'}`} />
              <span className="truncate">Media Assets</span>
            </button>

            {/* Atelier Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded text-xxs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-zinc-900 text-luxury-gold border-l-2 border-luxury-gold pl-3 font-semibold' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
              id="sidebar-tab-settings"
            >
              <Settings className={`h-3.5 w-3.5 shrink-0 ${activeTab === 'settings' ? 'text-luxury-gold' : 'text-zinc-500'}`} />
              <span className="truncate">Atelier Settings</span>
            </button>
          </div>

        </nav>
      </div>

      {/* Downward Logout utility */}
      <div className="px-4 pt-4 border-t border-zinc-900">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2.5 px-3.5 py-2.5 bg-zinc-900/60 hover:bg-rose-950/40 hover:text-rose-200 transition-colors text-xxs font-mono font-semibold uppercase tracking-wider cursor-pointer border-none rounded"
          id="sidebar-logout-btn"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 text-zinc-500 hover:text-rose-400" />
          <span>Exit Vault</span>
        </button>
      </div>
    </aside>
  );
};
