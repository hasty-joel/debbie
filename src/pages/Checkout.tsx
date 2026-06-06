/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Truck, ArrowLeft, ArrowRight, ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, setCurrentView, submitOrder } = useMarketplace();

  // Visitor fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Cash on Delivery, Mobile Money, Bank Transfer
  const [comment, setComment] = useState('');

  // Statuses
  const [submitting, setSubmitting] = useState(false);
  const [errorMess, setErrorMess] = useState('');

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4 animate-fade-in">
        <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto">
          <Truck className="h-6 w-6 text-zinc-300" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-sm uppercase text-white">Your Checkout box is currently unaligned</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed mt-1">Please populate your curation box with garments before accessing the checkout corridor.</p>
        </div>
        <button 
          onClick={() => setCurrentView('catalog')}
          className="text-xxs font-bold text-luxury-gold uppercase tracking-widest hover:text-white"
        >
          Explore Catalog items &rarr;
        </button>
      </div>
    );
  }

  const handleOrderSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !paymentMethod) {
      setErrorMess('Please provide your name, telephone coordinates, delivery hill, and selection handoff payment method.');
      return;
    }

    setSubmitting(true);
    setErrorMess('');

    const parsedOrder = {
      customerName,
      customerEmail: email,
      customerPhone: phone,
      deliveryAddress: address,
      paymentMethod,
      customerNotes: comment
    };

    const successData = await submitOrder(parsedOrder);
    setSubmitting(false);

    if (successData) {
      setCurrentView('success');
    } else {
      setErrorMess('Failed to lock order coordinates. Please request stylist help on our headlining WhatsApp address.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fade-in" id="checkout-container">
      
      {/* Header Backer */}
      <div>
        <button 
          onClick={() => setCurrentView('catalog')}
          className="flex items-center space-x-2 text-xxs font-bold tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white uppercase transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Curate More Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="checkout-grid-bounds">
        
        {/* Left Column Input fields form (COL-span-7) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 p-6 sm:p-8 rounded shadow-xl space-y-8">
          <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-900 pb-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-luxury-gold" />
              <span>Logistics Delivery Verification</span>
            </h2>
            <p className="text-xxs text-zinc-400">Debbie accounts are streamlined. Only logistical handoff parameters are logged securely.</p>
          </div>

          <form onSubmit={handleOrderSubmission} className="space-y-5 text-xs font-sans">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Guest Identity Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Brenda Joyce Alinda"
                  className="w-full bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Logistics Telephone (MTN/Airtel)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-400 font-mono text-xxs">+256</span>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="770000000"
                    className="w-full bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-800 pl-14 pr-4 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Contact Email (Optional)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="brenda@gmail.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-80s p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-550 focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            {/* Delivery address hill */}
            <div className="space-y-1">
              <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block font-sans">Kampala Delivery Hill Coordinates</label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Details of delivery location (e.g. Kololo Hills, Acacia Avenue, Block 5 apartment, Nakasero lounge)..."
                className="w-full bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-800 p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-luxury-gold"
              ></textarea>
            </div>

            {/* Custom order notes */}
            <div className="space-y-1">
              <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block">Atelier Sizing Comments / requests</label>
              <input 
                type="text" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Please wrap with custom satin ribbons, or check sizes for cargos..."
                className="w-full bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-800 p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-550 focus:outline-none focus:border-luxury-gold"
              />
            </div>

            {/* Handoff Payment preferences */}
            <div className="space-y-3.5 pt-2">
              <label className="text-xxs font-bold text-zinc-400 uppercase tracking-widest font-mono block font-sans">Couture Payment preference</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'Cash On Delivery', title: 'Cash On Handoff', subtitle: 'Pay when dropping' },
                  { id: 'Mobile Money', title: 'Mobile Money MM', subtitle: 'MTN / Airtel Transfer' },
                  { id: 'Bank Transfer', title: 'Bank Settlement', subtitle: 'Local EFT / RTGS' }
                ].map((pref) => (
                  <label 
                    key={pref.id}
                    className={`p-4 border rounded cursor-pointer flex flex-col space-y-1 transition-all flex-1 ${
                      paymentMethod === pref.id 
                        ? 'border-luxury-gold bg-zinc-50 dark:bg-zinc-900 text-luxury-gold ring-1 ring-luxury-gold/40' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-350'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment_pref"
                      value={pref.id}
                      checked={paymentMethod === pref.id}
                      onChange={() => setPaymentMethod(pref.id)}
                      className="sr-only"
                    />
                    <span className="text-xxs font-bold uppercase tracking-wider block">{pref.title}</span>
                    <span className="text-xxxxs text-zinc-400 font-mono tracking-wide mt-0.5">{pref.subtitle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submitter details */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white rounded-xl py-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg"
              >
                <span>{submitting ? 'VALIDATING LOGISTICS...' : 'SECURE ORDER DISPATCH'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {errorMess && (
              <p className="text-xxs text-rose-500 font-semibold text-center">{errorMess}</p>
            )}

          </form>
        </div>

        {/* Right Column billing details sticky box (COL-span-5) */}
        <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-6 rounded space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-display border-b border-zinc-200 pb-3 block">
            Investment Summary
          </h3>

          <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800/40">
            {cart.map((cItem, i) => (
              <div key={`${cItem.product.id}-${i}`} className="flex py-3.5 first:pt-0 justify-between items-center text-xs">
                <div className="space-y-0.5 max-w-[70%]">
                  <h4 className="font-semibold text-zinc-800 dark:text-white truncate uppercase text-ellipsis">{cItem.product.title}</h4>
                  <p className="text-xxxxs font-mono text-zinc-400 uppercase font-bold">
                    SIZE: {cItem.selectedSize} &bull; COLOR: {cItem.selectedColor} &bull; QTY: {cItem.quantity}
                  </p>
                </div>
                <span className="font-mono font-bold text-zinc-700 dark:text-zinc-350">
                  UGX {(cItem.product.price * cItem.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Couture Subtotal</span>
              <span className="font-mono text-zinc-900 dark:text-white">UGX {cartTotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Logistics Shipping Drop</span>
              <span className="font-mono font-bold text-emerald-400 uppercase tracking-widest text-xxxxs">FREE KAMPALA PRIORITY</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
              <span className="text-xs uppercase font-bold text-luxury-gold tracking-widest">Aggregate Investment</span>
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-white">UGX {cartTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-xxxxs text-zinc-405 leading-snug font-sans">
            <ShieldCheck className="h-4 w-4 text-luxury-gold shrink-0" />
            <span className="uppercase">VALIDATED IN COUTURE DESK HILLS. HANDOFF PAYMENTS VERIFIED ON PRIVATE LOOKS.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
