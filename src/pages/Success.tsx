/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Check, MessageSquare, ArrowRight, CornerDownRight, Sparkles } from 'lucide-react';

export const Success: React.FC = () => {
  const { completedOrder, clearCart, setCurrentView } = useMarketplace();
  const [countdown, setCountdown] = useState(6);

  // Format the pre-filled whatsapp message
  const whatsappText = completedOrder ? `🌟 DEBBIE FASHION ATELIER REFERENCE: #${completedOrder.order_reference} 🌟
----------------------------------
Perfect! I would like to verify and finalize my lookbook request:

👤 Guest Name: ${completedOrder.customer_name}
📞 Phone Contact: +256${completedOrder.customer_phone}
📍 Delivery Hill: ${completedOrder.delivery_address}
💳 Payment Preference: ${completedOrder.payment_method}

📦 Curated Items:
${completedOrder.items.map((item: any) => `• ${item.product_title} - Size: ${item.size}, Color: ${item.color} (Qty: ${item.quantity})`).join('\n')}

💰 Subtotal Order Value: UGX ${completedOrder.total_price.toLocaleString()}

Thank you, looking forward to the priority drop dispatch! 🥂` : '';

  const whatsappLink = `https://wa.me/256784918663?text=${encodeURIComponent(whatsappText)}`;

  useEffect(() => {
    // Clear cart immediately on successful order placement to reset state
    clearCart();

    if (!completedOrder) return;

    // Countdown and automatic redirect launch
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Redirect the user
          window.open(whatsappLink, '_blank');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [completedOrder, whatsappLink, clearCart]);

  if (!completedOrder) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4 animate-fade-in">
        <h2 className="text-zinc-450 text-sm">No verified order stream discovered.</h2>
        <button 
          onClick={() => setCurrentView('home')}
          className="text-xxs font-bold text-luxury-gold uppercase tracking-widest hover:text-white"
        >
          Return to home atelier
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-10 animate-fade-in" id="success-container">
      
      {/* 1. ANIMATED VERIFIED BADGE */}
      <div className="relative h-20 w-20 mx-auto">
        <div className="absolute inset-0 border-2 border-dashed border-emerald-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl">
          <Check className="h-8 w-8 text-white stroke-[3px]" />
        </div>
      </div>

      {/* 2. CONGRATULATIONS AND COMPILATION SUMMARY */}
      <div className="space-y-3.5">
        <span className="text-xxs font-mono tracking-widest text-luxury-gold uppercase font-bold px-3 py-1 bg-luxury-gold/10 rounded-full">Atelier Order Secured</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white uppercase">Reference #{completedOrder.order_reference}</h1>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
          Thank you, <span className="text-zinc-805 dark:text-white font-bold">{completedOrder.customer_name}</span>. Your lookbook garments have been successfully reserved and mapped inside our logistics network.
        </p>
      </div>

      {/* 3. WHATSAPP GATEWAY PROGRESS BAR AND COUNTER */}
      <div className="bg-zinc-950 dark:bg-zinc-900 border border-zinc-805 p-6 rounded space-y-5 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-950/20 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center space-x-3 text-left border-b border-zinc-850 pb-3">
          <div className="p-2 bg-emerald-600/10 rounded-full text-emerald-400">
            <MessageSquare className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Logistics WhatsApp Dispatch Desk</h3>
            {countdown > 0 ? (
              <p className="text-xs text-zinc-400 font-medium">Automatic redirecting safely to WhatsApp in <span className="text-luxury-gold font-bold text-sm font-mono">{countdown}</span> seconds...</p>
            ) : (
              <p className="text-xs text-zinc-400 font-medium font-semibold text-emerald-400">Dispatch system triggered! Complete below &darr;</p>
            )}
          </div>
        </div>

        {/* Premade text ledger mockup preview (looks luxury-editorial) */}
        <div className="text-left bg-zinc-900/60 p-4 rounded text-xxs font-mono text-zinc-350 leading-relaxed border border-zinc-800 space-y-2">
          <p className="text-luxury-gold font-bold uppercase tracking-widest border-b border-zinc-800 pb-1 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            <span>Look Verification Blueprint</span>
          </p>
          <p><span className="text-zinc-500">REF:</span> #{completedOrder.order_reference}</p>
          <p><span className="text-zinc-500">HILL:</span> {completedOrder.delivery_address}</p>
          <p><span className="text-zinc-500">VAL:</span> UGX {completedOrder.total_price.toLocaleString()}</p>
          <div className="pt-2 border-t border-zinc-800 space-y-0.5">
            {completedOrder.items.map((item: any, i: number) => (
              <p key={i} className="flex items-center gap-1">
                <CornerDownRight className="h-2.5 w-2.5 text-luxury-gold" />
                <span>{item.product_title} ({item.size}) &bull; Qty: {item.quantity}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Instant Open buttons */}
        <div className="pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none py-4 text-xs font-bold tracking-widest uppercase transition-colors uppercase border-none text-center block cursor-pointer"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span>Open WhatsApp Desk Manually</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </div>

      <div className="pt-4 flex justify-center text-xs">
        <button 
          onClick={() => setCurrentView('home')}
          className="text-xxs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest transition-colors font-mono"
        >
          &larr; Return to Closet Home
        </button>
      </div>

    </div>
  );
};
