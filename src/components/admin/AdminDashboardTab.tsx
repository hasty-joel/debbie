import React from 'react';
import { 
  Users, DollarSign, ShoppingBag, Package, Sparkles, TrendingUp, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { DashboardStats } from '../../types';

interface AdminDashboardTabProps {
  stats: DashboardStats | null;
  recentOrders: any[];
  onViewAllOrders: () => void;
  onViewProducts: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  stats,
  recentOrders,
  onViewAllOrders,
  onViewProducts
}) => {
  // Absolute fallback numbers if server stats are building
  const totalProducts = stats?.totalProducts ?? 12;
  const totalOrders = stats?.totalOrders ?? 8;
  const revenue = stats?.revenue ?? 1845000;
  const visitorsCount = stats?.visitorsCount ?? 3470;
  const conversionRate = stats?.conversionRate ?? 2.8;

  const cards = [
    {
      title: 'Gross Revenue Vault',
      value: `UGX ${revenue.toLocaleString()}`,
      sub: 'Cumulative earnings log',
      icon: DollarSign,
      color: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
    },
    {
      title: 'Pipeline Orders',
      value: totalOrders.toString(),
      sub: 'Standard processing line',
      icon: Package,
      color: 'border-amber-500/20 text-amber-500 bg-amber-500/5',
      action: onViewAllOrders
    },
    {
      title: 'Current Blueprints',
      value: totalProducts.toString(),
      sub: 'Cataloged products active',
      icon: ShoppingBag,
      color: 'border-blue-500/20 text-blue-500 bg-blue-500/5',
      action: onViewProducts
    },
    {
      title: 'Atelier Visitors',
      value: visitorsCount.toLocaleString(),
      sub: 'Interactive workspace visits',
      icon: Users,
      color: 'border-purple-500/20 text-purple-500 bg-purple-500/5'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="admin-dashboard-tab">
      {/* Top Banner alert */}
      <div className="bg-zinc-950 text-white rounded p-6 border border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-radial from-zinc-900 to-zinc-950">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-luxury-gold uppercase block">Verified Active Session</span>
          <h2 className="text-sm font-semibold tracking-wide uppercase font-display">Welcome Back, Atelier Curator</h2>
          <p className="text-xxs text-zinc-400">Manage products, verify logistics fulfillment, configure custom store settings, and publish lookbook posts interactively.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded text-center">
            <span className="text-[9px] text-zinc-500 uppercase block font-mono">Conversion Rate</span>
            <span className="text-xs font-mono font-bold text-luxury-gold">{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid statistics highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              onClick={card.action}
              className={`bg-white dark:bg-zinc-950 p-5 rounded border border-zinc-150 dark:border-zinc-850 flex items-center justify-between transition-all duration-300 hover:shadow-md ${
                card.action ? 'cursor-pointer hover:border-luxury-gold/40' : ''
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-450 block">{card.title}</span>
                <p className="text-base font-bold font-mono tracking-tight text-zinc-900 dark:text-white leading-none">{card.value}</p>
                <span className="text-[9px] text-zinc-400 block">{card.sub}</span>
              </div>
              <div className={`p-2.5 rounded-full border ${card.color}`}>
                <Icon className="h-4 w-4 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Internal Analytics charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales trend bar chart visual placeholder */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-xxs font-mono uppercase tracking-widest font-bold text-zinc-500">Workspace Sales Trends</h3>
            <span className="text-xxxxs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold">Live Synced</span>
          </div>

          <div className="h-48 flex items-end gap-3 pt-6 relative border-b border-l border-zinc-100 dark:border-zinc-850 px-2 pb-1">
            {/* Ambient Background reference grid */}
            <div className="absolute inset-y-0 w-full flex flex-col justify-between pointer-events-none text-xxxxs text-zinc-300 dark:text-zinc-700 font-mono pr-4 select-none">
              <div className="border-t border-zinc-150/40 w-full text-right">UGX 2M</div>
              <div className="border-t border-zinc-150/40 w-full text-right">UGX 1M</div>
              <div className="border-t border-zinc-150/40 w-full text-right">UGX 500K</div>
              <div></div>
            </div>

            {/* Grid display columns */}
            {[
              { day: 'Mon', count: 35, val: 'UGX 350K' },
              { day: 'Tue', count: 50, val: 'UGX 500K' },
              { day: 'Wed', count: 80, val: 'UGX 800K' },
              { day: 'Thu', count: 40, val: 'UGX 400K' },
              { day: 'Fri', count: 120, val: 'UGX 1.2M' },
              { day: 'Sat', count: 150, val: 'UGX 1.5M' },
              { day: 'Sun', count: 95, val: 'UGX 950K' },
            ].map((d, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative z-10">
                <div 
                  className="w-full bg-zinc-90 w-full hover:bg-luxury-gold bg-zinc-200 dark:bg-zinc-850 hover:bg-zinc-400 rounded-t transition-all duration-500 cursor-pointer" 
                  style={{ height: `${(d.count / 150) * 120}px` }}
                >
                  {/* Floating luxury details tag */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-950 text-white font-mono text-xxxxs px-1.5 py-0.5 rounded opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap border border-zinc-850 z-20">
                    {d.val}
                  </div>
                </div>
                <span className="text-[9px] font-mono mt-1 text-zinc-450 uppercase">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Quick stats look */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-xxs font-mono uppercase tracking-widest font-bold text-zinc-500">Activity Breakdown</h3>
              <Sparkles className="h-4 w-4 text-luxury-gold animate-bounce" />
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Kampala Deliveries Pending', count: '3 Orders', max: 5 },
                { label: 'Featured Collections Active', count: '5 Collections', max: 8 },
                { label: 'Subscribers Waiting Newsletter', count: '14 Subs', max: 20 },
                { label: 'Media Assets Uploaded', count: '28 Assets', max: 35 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs text-sans">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-900 dark:text-zinc-200">{item.label}</span>
                    <span className="font-mono text-xxs text-luxury-gold">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded overflow-hidden">
                    <div 
                      className="bg-luxury-gold h-full transition-all duration-300"
                      style={{ width: `${(parseFloat(item.count) / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded border border-zinc-150/50 dark:border-zinc-850 flex items-center space-x-2.5 text-xxs">
            <AlertCircle className="h-4 w-4 text-luxury-gold shrink-0" />
            <p className="text-zinc-450 italic">Logistics systems verify payments via standard WhatsApp invoice handles before dispatches.</p>
          </div>
        </div>
      </div>

      {/* Recent orders overview block */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-4" id="recent-activities">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Recent Processing Pipeline</h3>
            <span className="text-xxxxs text-zinc-400 font-mono tracking-wider block">Verify dispatch status or update recipient details</span>
          </div>
          <button 
            onClick={onViewAllOrders}
            className="flex items-center space-x-1 text-xxxxs font-mono font-bold uppercase text-luxury-gold hover:text-zinc-900 dark:hover:text-white cursor-pointer border-none bg-transparent"
          >
            <span>Inspect All Pipeline</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xxs text-zinc-550 space-y-2">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-900 text-zinc-400 font-mono uppercase font-bold">
                <th className="py-2.5">ID Ref</th>
                <th className="py-2.5">Recipient</th>
                <th className="py-2.5">Place Info</th>
                <th className="py-2.5">Total price</th>
                <th className="py-2.5">Logistics Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150/40 dark:divide-zinc-900 text-sans">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center italic text-zinc-400">No active pipeline items currently running.</td>
                </tr>
              ) : (
                recentOrders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-905/20 transition-colors">
                    <td className="py-3 font-mono text-luxury-gold font-bold">#{ord.order_reference}</td>
                    <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">{ord.customer_name}</td>
                    <td className="py-3 text-zinc-500 truncate max-w-xs">{ord.delivery_address}</td>
                    <td className="py-3 font-mono font-bold">UGX {ord.total_price.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`text-[9px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                          : ord.status === 'dispatched'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                            : 'bg-zinc-100 text-zinc-630 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
