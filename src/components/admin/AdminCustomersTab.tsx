import React, { useState } from 'react';
import { 
  Users, Search, Download, ArrowUpRight, Sparkles, UserCheck, Calendar, DollarSign
} from 'lucide-react';

interface AdminCustomersTabProps {
  orders: any[];
  subscribers: any[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  orders,
  subscribers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Extract unique customers from orders list
  const uniqueCustomerMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    ordersCount: number;
    totalSpend: number;
    lastOrderDate: string;
    address: string;
  }>();

  // Populate from mock orders list
  orders.forEach(o => {
    const key = (o.customer_name || 'Anonymous Client').toLowerCase().trim();
    const existing = uniqueCustomerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpend += o.total_price;
      if (new Date(o.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.created_at;
      }
    } else {
      uniqueCustomerMap.set(key, {
        name: o.customer_name,
        phone: o.customer_phone || 'N/A',
        email: o.customer_email || 'No email log',
        ordersCount: 1,
        totalSpend: o.total_price,
        lastOrderDate: o.created_at,
        address: o.delivery_address || 'Kampala drop'
      });
    }
  });

  const customersList = Array.from(uniqueCustomerMap.values());

  const filteredCustomers = customersList.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.phone.includes(searchQuery) ||
           c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Export Customer data using Blob API! Highly realistic premium detail
  const handleExportCSV = () => {
    setExporting(true);
    setSuccessMsg('');
    
    setTimeout(() => {
      try {
        const headers = ['Recipient Name', 'Contact Phone', 'Registered Email', 'Fulfilled Orders', 'Gross Expenditure (UGX)', 'Last Order Date', 'Address Location'];
        const rows = filteredCustomers.map(c => [
          `"${c.name}"`,
          `"+256 ${c.phone}"`,
          `"${c.email}"`,
          c.ordersCount,
          c.totalSpend,
          `"${new Date(c.lastOrderDate).toLocaleDateString()}"`,
          `"${c.address}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Debbie_Atelier_Customers_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSuccessMsg('Garment buyer log successfully downloaded to device.');
      } catch (err) {
        console.error(err);
      } finally {
        setExporting(false);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-customers-tab">
      
      {/* Search and control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-150 dark:border-zinc-850 rounded">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, or physical location..."
            className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-90 w-full text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold dark:text-white rounded"
          />
        </div>

        <button 
          onClick={handleExportCSV}
          disabled={exporting || filteredCustomers.length === 0}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold transition-colors text-xxs font-bold tracking-widest font-mono uppercase rounded disabled:opacity-55 cursor-pointer border-none w-full sm:w-auto shrink-0 shadow-xs"
        >
          <Download className="h-4 w-4 shrink-0" />
          <span>{exporting ? 'Compiling Log...' : 'Export Buyer Records (CSV)'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 font-semibold rounded text-xxs italic font-sans flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid summary layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer Buyers database lists */}
        <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-150 dark:border-zinc-850 rounded lg:col-span-2 space-y-4 shadow-2xs">
          <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Elite Buyer Index</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xxs text-zinc-550">
              <thead>
                <tr className="border-b border-zinc-150 dark:border-zinc-850 pb-2 text-zinc-400 font-mono uppercase font-bold">
                  <th className="py-2.5">Buyer</th>
                  <th className="py-2.5">Pipeline Orders</th>
                  <th className="py-2.5">Total spent</th>
                  <th className="py-2.5">Recent Place</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150/40 dark:divide-zinc-900 text-sans">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-400 italic">No buyer records matched querying index.</td>
                  </tr>
                ) : (
                  filteredCustomers.map((buy, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/20 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-luxury-gold uppercase font-mono z-10 shrink-0">
                            {buy.name.charAt(0)}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-zinc-800 dark:text-zinc-100">{buy.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono leading-none">{buy.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono">
                        <span>{buy.ordersCount} dispatch{buy.ordersCount > 1 ? 'es' : ''}</span>
                      </td>
                      <td className="py-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        <span>UGX {buy.totalSpend.toLocaleString()}</span>
                      </td>
                      <td className="py-3 font-mono text-zinc-400">
                        <span>{new Date(buy.lastOrderDate).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Newsletter subscribers listings */}
        <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-150 dark:border-zinc-850 rounded space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Subscribers loft</h3>
            <span className="text-xxxxs border border-zinc-200 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 px-2 py-0.5 rounded font-mono font-bold text-luxury-gold uppercase"> {subscribers ? subscribers.length : 0} subs </span>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto scrollbar-thin">
            {!subscribers || subscribers.length === 0 ? (
              <p className="py-8 text-center text-xxs text-zinc-400 italic">No newsletter submissions logged inside database.</p>
            ) : (
              subscribers.map((sub: any) => (
                <div key={sub.id} className="p-3 bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded flex items-center justify-between text-xxs">
                  <div className="space-y-0.5">
                    <p className="font-mono text-zinc-800 dark:text-zinc-100">{sub.email}</p>
                    <p className="text-xxxxs text-zinc-450 uppercase font-mono">JOIN DATE: {new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                  <UserCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
