import React, { useState } from 'react';
import { 
  BarChart2, Users, DollarSign, TrendingUp, Sparkles, PieChart, ArrowUpRight, ArrowDownRight, Award
} from 'lucide-react';

export const AdminAnalyticsTab: React.FC = () => {
  const [metricTimeline, setMetricTimeline] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const summaries = [
    { label: 'Weekly Active Sessions', val: '4,102', growth: '+12.4%', up: true, desc: 'Interactives on mobile devices & tablets' },
    { label: 'Average checkout Basket value', val: 'UGX 180,000', growth: '+5.1%', up: true, desc: 'Bespoke silk & blended cotton apparel' },
    { label: 'Order Bounce Rate', val: '24.1%', growth: '-4.8%', up: false, desc: 'WhatsApp invoice handoff dispatches' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="admin-analytics-tab">
      
      {/* Search and control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-150 dark:border-zinc-850 rounded">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Deep Analytics Vault</h3>
          <span className="text-xxxxs text-zinc-400 font-mono tracking-wider block">Verify boutique performance and customer retention pipelines</span>
        </div>

        <div className="flex items-center space-x-1.5 text-xxs font-mono">
          {['daily', 'weekly', 'monthly'].map((t) => (
            <button 
              key={t}
              onClick={() => setMetricTimeline(t as any)}
              className={`px-3 py-1 bg-zinc-50 dark:bg-zinc-90 text-[10px] uppercase font-bold tracking-wider rounded border cursor-pointer transition-colors ${
                metricTimeline === t 
                  ? 'border-luxury-gold text-luxury-gold font-semibold' 
                  : 'border-zinc-250 hover:bg-zinc-100 dark:border-zinc-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid statistics summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaries.map((s, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-950 p-5 border border-zinc-150 dark:border-zinc-850 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-450 uppercase font-mono tracking-wider">{s.label}</span>
              <div className={`flex items-center text-xxxxs font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                s.up 
                  ? 'bg-emerald-555/10 text-emerald-500' 
                  : 'bg-rose-555/10 text-rose-500'
              }`}>
                {s.up ? <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" /> : <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />}
                <span>{s.growth}</span>
              </div>
            </div>

            <p className="font-mono font-bold text-sm text-zinc-900 dark:text-white tracking-wide leading-none">{s.val}</p>
            <p className="text-[10px] text-zinc-400 italic font-medium">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Conversion Flow & Heat Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visitors source chart visual container */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-4">
          <div className="border-b border-zinc-10 border-zinc-100 dark:border-zinc-900 pb-3">
            <h4 className="text-xxs font-mono uppercase tracking-widest text-zinc-500 font-bold">Kampala Geolocation Heat Tunnel</h4>
          </div>

          <div className="space-y-3 pt-2 text-xxs font-medium">
            {[
              { location: 'Kololo & Acacia Hill', visits: '1,420 visits', percent: 45 },
              { location: 'Muyenga & Kampala Central', visits: '980 visits', percent: 32 },
              { location: 'Entebbe Elite Area', visits: '412 visits', percent: 14 },
              { location: 'International Orders (US/EU)', visits: '290 visits', percent: 9 },
            ].map((loc, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-zinc-800 dark:text-zinc-250">{loc.location}</span>
                  <span className="font-mono text-luxury-gold">{loc.visits} ({loc.percent}%)</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded overflow-hidden">
                  <div 
                    className="bg-luxury-gold h-full transition-all duration-300"
                    style={{ width: `${loc.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Platform Device Logs */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <h4 className="text-xxs font-mono uppercase tracking-widest text-zinc-500 font-bold">Acquisition Channels</h4>
          </div>

          <div className="space-y-3 pt-2 text-xxs font-medium">
            {[
              { source: 'Instagram / Meta Campaigns', hits: '1,890 hits', conversion: '3.4%' },
              { source: 'Direct URL Navigation', hits: '915 hits', conversion: '4.8%' },
              { source: 'WhatsApp Shares & Curators links', hits: '450 hits', conversion: '12.1%' },
              { source: 'Organic Search index', hits: '210 hits', conversion: '1.2%' }
            ].map((acq, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded">
                <div className="space-y-0.5">
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">{acq.source}</p>
                  <p className="text-xxxxs text-zinc-400 font-mono">TRAFFIC VOLUME: {acq.hits}</p>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="font-mono font-bold text-luxury-gold text-xxs">{acq.conversion}</p>
                  <p className="text-xxxxs text-zinc-400 font-mono lowercase block">conv. label</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
