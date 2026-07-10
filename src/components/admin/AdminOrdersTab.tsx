import React, { useState } from 'react';
import { 
  Package, Search, CheckCircle, Truck, Clock, RefreshCw, Eye, MessageSquare, PhoneCall, XSquare
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersTabProps {
  orders: any[];
  updateOrderStatus: (id: string, status: any) => Promise<boolean>;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  updateOrderStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleUpdateStatus = async (oId: string, value: string) => {
    await updateOrderStatus(oId, value);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.order_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.delivery_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer_phone && o.customer_phone.includes(searchQuery));
    
    const matchesStatus = statusFilter ? o.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="admin-orders-tab">
      
      {/* Control bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-150 dark:border-zinc-850 rounded">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full lg:w-auto flex-1">
          {/* Search box */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, or phone..."
              className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-90 w-full text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold dark:text-white rounded"
            />
          </div>

          {/* Status filtering */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-90 text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 rounded dark:text-white"
          >
            <option value="">All Logistics Statuses</option>
            <option value="pending">Review Pending</option>
            <option value="dispatched">Under Dispatch Drop</option>
            <option value="delivered">Handoff Complete</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-[10px] text-zinc-400 font-mono text-right shrink-0">
          Tracking {filteredOrders.length} pipeline items
        </span>
      </div>

      {/* Orders details stack layout */}
      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-950 p-12 text-center rounded border border-zinc-150 dark:border-zinc-850">
            <Package className="h-8 w-8 text-zinc-400 mx-auto opacity-40 mb-3" />
            <p className="text-xxs text-zinc-450 italic">No orders registered inside specified logistics parameters.</p>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div 
              key={ord.id} 
              className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded overflow-hidden shadow-2xs hover:shadow-xs transition-shadow space-y-4 p-5"
            >
              {/* Header card coordinates */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xxs font-mono text-luxury-gold font-bold">#{ord.order_reference}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 border ${
                      ord.status === 'delivered' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : ord.status === 'dispatched' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-150 dark:border-zinc-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xxxxs text-zinc-400 font-mono tracking-wider">REGISTERED: {new Date(ord.created_at).toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-3 text-xxs font-mono">
                  <span className="text-zinc-400 uppercase font-bold text-xxxxs font-mono tracking-wider">Dispatches state:</span>
                  <select 
                    value={ord.status} 
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-90 text-[10px] border border-zinc-200 dark:border-zinc-800 py-1.5 px-3 focus:outline-none focus:border-luxury-gold dark:text-white uppercase font-bold"
                  >
                    <option value="pending">Review Pending</option>
                    <option value="dispatched">Under Dispatch Drop</option>
                    <option value="delivered">Handoff Complete</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Recipient / Delivery location specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50/50 dark:bg-zinc-905/20 border border-zinc-100 dark:border-zinc-900/60 p-4 rounded text-xxs">
                <div className="space-y-1 text-sans">
                  <span className="text-xxxxs uppercase tracking-wider font-mono text-zinc-455 font-bold block">Client Coordinates</span>
                  <p className="font-bold text-zinc-905 dark:text-zinc-100 text-xx-leading-none">{ord.customer_name}</p>
                  <p className="text-zinc-500 font-medium flex items-center gap-1">
                    <PhoneCall className="h-3 w-3 shrink-0" />
                    <span>+256 {ord.customer_phone || 'N/A'}</span>
                  </p>
                  <p className="text-[10px] text-zinc-450 italic truncate">{ord.customer_email || 'No email registered'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xxxxs uppercase tracking-wider font-mono text-zinc-455 font-bold block">Delivery Destination</span>
                  <p className="text-zinc-650 leading-relaxed dark:text-zinc-350 italic">"{ord.delivery_address || 'Kampala Boutique center'}"</p>
                </div>

                <div className="space-y-1 font-mono">
                  <span className="text-xxxxs uppercase tracking-wider font-mono text-zinc-455 font-bold block">Fulfillment details</span>
                  <p className="font-bold text-luxury-gold text-xs leading-none">UGX {ord.total_price.toLocaleString()}</p>
                  <p className="text-xxxxs text-zinc-400 mt-1 uppercase font-bold">{ord.payment_method || 'MOBILE MONEY PAY'}</p>
                  {ord.notes && (
                    <p className="text-xxxxs text-rose-400 font-sans italic mt-1 leading-snug">"Client: {ord.notes}"</p>
                  )}
                </div>
              </div>

              {/* Items in the parcel details */}
              <div className="space-y-2">
                <span className="text-xxxxs text-zinc-450 uppercase font-mono tracking-widest font-bold block">Parcel garment contents ({ord.items ? ord.items.length : 1})</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ord.items && ord.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2.5 p-2 bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded">
                      <div className="h-10 w-7 select-none overflow-hidden rounded bg-zinc-100 shrink-0">
                        <img src={item.image_url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200'} alt="item thumbnail" referrerPolicy="no-referrer" className="h-[100%] w-[100%] object-cover object-top" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-semibold uppercase text-zinc-800 dark:text-zinc-200 leading-none truncate w-40">{item.product_title || 'Atelier designer apparel'}</h5>
                        <p className="text-[9px] font-mono text-zinc-450 uppercase">Size: {item.size} &bull; Color: {item.color} &bull; Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {!ord.items && (
                    <p className="text-xxxxs font-mono italic text-zinc-400">Garment index list is embedded in payment handles.</p>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
