import React, { useState } from 'react';
import { 
  Settings, Save, PhoneCall, Mail, MessageCircle, MapPin, Truck, ShieldAlert, Sparkles
} from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  // Store configs keys
  const [phone, setPhone] = useState('+256 701 445588');
  const [email, setEmail] = useState('curator@debbieatelier.com');
  const [whatsapp, setWhatsapp] = useState('+256 701 445588');
  const [address, setAddress] = useState('Debbie Atelier Chambers, Plot 12 Acacia Avenue, Kololo, Kampala, Uganda');
  
  // Delivery rule sets
  const [deliveryKampala, setDeliveryKampala] = useState('12 - 24 hours (UGX 10,000)');
  const [deliveryUpcountry, setDeliveryUpcountry] = useState('48 - 72 hours (UGX 30,000)');
  const [vatPercent, setVatPercent] = useState(18);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    setTimeout(() => {
      setSaving(false);
      setSuccess('Boutique operating rules and coordinates securely saved!');
      setTimeout(() => setSuccess(''), 3000);
    }, 1100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in font-sans" id="admin-settings-tab">
      
      {/* 1. PHYSICAL & LOGISTICS COORDINATES */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 md:col-span-2 space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Operating Rules</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Boutique Operating Specs</h3>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs text-zinc-550 leading-relaxed font-sans">
          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-600 font-semibold rounded text-xxs italic flex items-center gap-1.5 animate-bounce">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Boutique Phone line</span>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury Gold" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Official contact Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury Gold" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">WhatsApp Redirect Number</span>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury Gold" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-455 uppercase tracking-wider block font-mono">Kampala delivery timelines rules</span>
              <div className="relative">
                <Truck className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="text" value={deliveryKampala} onChange={(e) => setDeliveryKampala(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury Gold" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Upcountry Uganda Logistical delivery timing</span>
            <input type="text" value={deliveryUpcountry} onChange={(e) => setDeliveryUpcountry(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury Gold" />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Physical Acacia Chambers Address location</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury Gold text-xxs font-medium" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors border-none rounded disabled:opacity-50"
          >
            <Save className="h-4 w-4 shrink-0" />
            <span>{saving ? 'Saving Specs...' : 'Update specifications'}</span>
          </button>
        </form>
      </div>

      {/* 2. BOUTIQUE SECURITY & CONTROL */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-5">
        <div className="border-b border-zinc-10 border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block font-sans">Workspace credentials</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Security Settings</h3>
        </div>

        <div className="space-y-4 text-xxs leading-relaxed text-zinc-455">
          <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500/20 rounded flex items-start space-x-2.5">
            <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
            <p className="font-sans italic">Password keychain changes can compromise running curator logins. Clear sessionStorage files afterward to hard-refresh passwords.</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <span className="font-bold text-zinc-400 uppercase tracking-wider block font-mono">Curator account handle</span>
              <input type="text" defaultValue="debbie_admin" disabled className="w-full bg-zinc-100 dark:bg-zinc-90 border p-2 rounded focus:outline-none cursor-not-allowed font-mono text-[10px]" />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-zinc-400 uppercase tracking-wider block font-mono">Current encryption key</span>
              <input type="password" value="••••••••" disabled className="w-full bg-zinc-100 dark:bg-zinc-90 border p-2 rounded focus:outline-none cursor-not-allowed text-xs" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
