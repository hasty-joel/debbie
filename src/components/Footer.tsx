/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Mail, Check, CreditCard, ShieldCheck, Truck, RefreshCw, PhoneCall, Gift, BookOpen } from 'lucide-react';
import { defaultHomepageConfig } from '../utils/defaultHomepageConfig';

export const Footer: React.FC = () => {
  const { subscribeNewsletter, setCurrentView, settings } = useMarketplace();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Load footer builder coordinates from settings
  const footerConfig = (settings as any)?.homepage_config?.footer || defaultHomepageConfig.footer;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const ok = await subscribeNewsletter(email);
    if (ok) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-90 w-full border-zinc-900 transition-colors duration-300">
      
      {/* Editorial Trust Statements / Brand DNA */}
      <div className="border-b border-zinc-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-3">
            <Truck className="h-5 w-5 text-luxury-gold shrink-0" />
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase">Premium Kampala Delivery</h4>
            <p className="text-xs text-zinc-500">Express delivery structured with utmost care directly to your Kololo, Bugolobi or Nakasero lounge.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-3">
            <RefreshCw className="h-5 w-5 text-luxury-gold shrink-0" />
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase">Authenticity Guarantee</h4>
            <p className="text-xs text-zinc-500">Every single piece is designed, hand-stitched and hand-pressed to ensure uncompromised luxury finishes.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-3">
            <ShieldCheck className="h-5 w-5 text-luxury-gold shrink-0" />
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase">Secured Verification</h4>
            <p className="text-xs text-zinc-500">Instant order alignment and handoff validations via our dedicated Personal Stylist WhatsApp desk.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-3">
            <CreditCard className="h-5 w-5 text-luxury-gold shrink-0" />
            <h4 className="text-xs font-semibold tracking-wider text-white uppercase">Flexible Handoff Payments</h4>
            <p className="text-xs text-zinc-500">Cash on delivery, Mobile Money (MTN/Airtel) or instant bank settlements verified during custom drops.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap and Newsletter Subsystem */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Brand identity COLUMN */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex cursor-pointer items-center space-x-2" onClick={() => setCurrentView('home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-zinc-950">
              <span className="font-display text-xl font-bold tracking-widest">D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold tracking-widest text-white uppercase">Debbie</span>
              <span className="text-xxs font-mono tracking-widest text-luxury-gold">FASHION ATELIER</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
            Debbie Fashion is Kampala's premier digital fashion house, curating bespoke visual stories, modular outfit architectures, and AI style consultancies. We represent the bold alignment of Ugandan heritage with international high-fashion standards.
          </p>
          
          <div className="space-y-2 text-xs text-zinc-500">
            <div>
              <span className="text-zinc-300 font-medium">Headquarters Location:</span> {footerConfig.address}
            </div>
            {footerConfig.contact_phone && (
              <div>
                <span className="text-zinc-300 font-medium font-mono text-[10px]">PHONE:</span> {footerConfig.contact_phone}
              </div>
            )}
            {footerConfig.whatsapp_number && (
              <div>
                <span className="text-zinc-300 font-medium font-mono text-[10px]">WHATSAPP DIRECT:</span> {footerConfig.whatsapp_number}
              </div>
            )}
            {footerConfig.email && (
              <div>
                <span className="text-zinc-300 font-medium font-mono text-[10px]">EMAIL ADDRESS:</span> {footerConfig.email}
              </div>
            )}
          </div>
        </div>

        {/* Quick Sitemap Links */}
        <div className="md:col-span-3 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-white uppercase">Collections</h3>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => { setCurrentView('catalog'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">Streetwear</button></li>
              <li><button onClick={() => { setCurrentView('catalog'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">CEO Mode</button></li>
              <li><button onClick={() => { setCurrentView('catalog'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">Campus Drip</button></li>
              <li><button onClick={() => { setCurrentView('catalog'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">Date Night</button></li>
              <li><button onClick={() => { setCurrentView('catalog'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">Kampala Selection</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-white uppercase">Atelier Services</h3>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><button onClick={() => { setCurrentView('outfit-builder'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">Outfit Creator</button></li>
              <li><button onClick={() => { setCurrentView('ai-stylist'); }} className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer text-left text-zinc-400">Gemini Styling AI</button></li>
              <li><span className="text-zinc-650">Tailoring Desk</span></li>
              <li><span className="text-zinc-650">Private Showings</span></li>
            </ul>
          </div>
        </div>

        {/* Exclusive newsletter subscription */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-xs font-semibold tracking-wider text-white uppercase">The Weekly Atelier Dossier</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Gain premier access to lookbook drops, private capsule introductions, and stylist-curated editorials. No spam, only luxury.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-2.5">
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                placeholder="Enter email address" 
                className="w-full bg-zinc-900 border border-zinc-805 focus:border-luxury-gold rounded px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none transition-colors duration-300"
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded bg-white hover:bg-luxury-gold text-zinc-950 hover:text-white transition-all duration-300 cursor-pointer border-none"
              >
                {status === 'success' ? <Check className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
              </button>
            </div>
            {status === 'success' && (
              <p className="text-xxs text-emerald-500 animate-pulse">Welcome to Debbie's inner circle. Invitation sent.</p>
            )}
            {status === 'error' && (
              <p className="text-xxs text-rose-500">Please enter a valid luxury-focused email address.</p>
            )}
          </form>

          {/* Social media connections builders */}
          <div className="flex items-center space-x-3.5 pt-3">
            {footerConfig.social_instagram && (
              <a href={footerConfig.social_instagram} target="_blank" rel="noreferrer" className="text-xxs uppercase tracking-wider font-mono hover:text-white text-zinc-500 transition-colors">INSTAGRAM</a>
            )}
            {footerConfig.social_facebook && (
              <a href={footerConfig.social_facebook} target="_blank" rel="noreferrer" className="text-xxs uppercase tracking-wider font-mono hover:text-white text-zinc-500 transition-colors">FACEBOOK</a>
            )}
            {footerConfig.social_twitter && (
              <a href={footerConfig.social_twitter} target="_blank" rel="noreferrer" className="text-xxs uppercase tracking-wider font-mono hover:text-white text-zinc-500 transition-colors">TWITTER</a>
            )}
            {footerConfig.social_pinterest && (
              <a href={footerConfig.social_pinterest} target="_blank" rel="noreferrer" className="text-xxs uppercase tracking-wider font-mono hover:text-white text-zinc-500 transition-colors">PINTEREST</a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xxs text-zinc-650">
          &copy; {new Date().getFullYear()} {footerConfig.copyright_text || "DEBBIE FASHION LTD. Sourced dynamically with premium couture standards in Kampala."}
        </p>
        <div className="flex space-x-6 text-xxs text-zinc-650 font-mono">
          <span className="hover:text-zinc-400 cursor-pointer">PRIVACY REGULATION</span>
          <span className="hover:text-zinc-400 cursor-pointer">TERMS OF CONDUCT</span>
          <span className="hover:text-zinc-400 cursor-pointer">KAMPALA REGISTER</span>
        </div>
      </div>
    </footer>
  );
};
