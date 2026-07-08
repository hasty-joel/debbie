import React, { useState } from 'react';
import { 
  Percent, Plus, Trash2, Calendar, AlertCircle, Sparkles, CheckSquare, Square
} from 'lucide-react';
import { Promotion, Product } from '../../types';

interface AdminPromotionsTabProps {
  promotions: Promotion[];
  products: Product[];
  createPromotion: (data: Partial<Promotion>) => Promise<boolean>;
  deletePromotion: (id: string) => Promise<boolean>;
}

export const AdminPromotionsTab: React.FC<AdminPromotionsTabProps> = ({
  promotions,
  products,
  createPromotion,
  deletePromotion
}) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(10);
  const [isFlash, setIsFlash] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProds, setSelectedProds] = useState<string[]>([]);
  
  const [success, setSuccess] = useState('');
  const [err, setErr] = useState('');

  const handleToggleProduct = (pId: string) => {
    if (selectedProds.includes(pId)) {
      setSelectedProds(selectedProds.filter(id => id !== pId));
    } else {
      setSelectedProds([...selectedProds, pId]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setErr('');

    if (!code) {
      setErr('Voucher code name is mandatory.');
      return;
    }

    const payload: Partial<Promotion> = {
      code: code.toUpperCase().trim(),
      discount: Number(discount),
      is_flash: isFlash,
      is_active: true,
      products: selectedProds,
      start_date: startDate || new Date().toISOString().split('T')[0],
      end_date: endDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
    };

    const ok = await createPromotion(payload);
    if (ok) {
      setSuccess(`Discount coupon "${code.toUpperCase()}" initialized!`);
      setCode('');
      setDiscount(10);
      setIsFlash(false);
      setStartDate('');
      setEndDate('');
      setSelectedProds([]);
    } else {
      setErr('Connection fail: Unable to register coupon key.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" id="admin-promotions-tab">
      
      {/* 1. INITIALIZE NEW PROMOTIONS FORM */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-6 height-fit">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Vouchers Center</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Generate Promotion Coupon</h3>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans text-zinc-550">
          {err && <div className="p-2.5 bg-red-50 text-red-500 font-semibold rounded text-xxs italic">{err}</div>}
          {success && <div className="p-2.5 bg-green-50 text-emerald-600 font-semibold rounded text-xxs italic">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Coupon Code</span>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. KAMPALA20" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold uppercase font-mono" />
            </div>

            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Discount Percent (%)</span>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min={1} max={100} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Start Schedule Date</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold font-mono" />
            </div>

            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Expiration Date</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold font-mono" />
            </div>
          </div>

          {/* Flash sale check */}
          <div className="py-2">
            <label className="flex items-center space-x-2.5 cursor-pointer font-mono text-[10px] text-zinc-450 uppercase">
              <input type="checkbox" checked={isFlash} onChange={(e) => setIsFlash(e.target.checked)} className="h-4 w-4 rounded accent-luxury-gold" />
              <span className="font-bold">Flag Coupon as flash sale voucher</span>
            </label>
          </div>

          {/* Select Products scroll-box */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Eligible Garments Selection ({selectedProds.length} selected)</span>
            <div className="h-32 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded p-2.5 bg-zinc-50 dark:bg-zinc-90/50 space-y-1.5 scrollbar-thin">
              {products.map(p => {
                const isSelected = selectedProds.includes(p.id);
                return (
                  <div 
                    key={p.id} 
                    onClick={() => handleToggleProduct(p.id)}
                    className="flex items-center justify-between p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded cursor-pointer transition-colors"
                  >
                    <span className="text-xxs font-medium uppercase truncate pr-4 w-60">{p.title}</span>
                    <div className="text-luxury-gold shrink-0">
                      {isSelected ? '✓ SELECTED' : '＋ ADD'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors block border-none rounded">
            Align promotion Coupon
          </button>
        </form>
      </div>

      {/* 2. ACTIVE VOUCHER CARDS LISTINGS */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-5">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block font-sans">Vouchers Active</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Active promotions</h3>
        </div>

        <div className="space-y-3">
          {promotions.length === 0 ? (
            <p className="py-12 text-center text-xxs text-zinc-400 italic">No active vouchers exist inside catalog records.</p>
          ) : (
            promotions.map((promo) => (
              <div key={promo.id} className="p-4 bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded flex justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-bold text-luxury-gold tracking-widest uppercase bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-250 dark:border-zinc-750">{promo.code}</span>
                    <span className="text-xxxxs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 border border-emerald-500/20 font-bold uppercase"> {promo.discount}% OFF </span>
                    {promo.is_flash && (
                      <span className="text-xxxxs bg-rose-500/10 text-rose-500 px-2 py-0.5 border border-rose-500/20 font-bold uppercase">Flash</span>
                    )}
                  </div>

                  <div className="text-[10px] text-zinc-455 space-y-0.5 font-mono">
                    <p>DURATION: {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}</p>
                    <p className="text-zinc-400 font-sans italic">{(promo.products || []).length} capsule garments associated with this campaign</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end border-l border-zinc-200 dark:border-zinc-800 pl-4 shrink-0">
                  <button 
                    onClick={() => deletePromotion(promo.id)}
                    className="p-1 px-2.5 bg-zinc-100 hover:bg-rose-950 text-zinc-500 hover:text-rose-200 rounded border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer text-xxxxs uppercase font-bold font-mono tracking-wider z-10"
                    title="Deprovision voucher"
                  >
                    Shred
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
