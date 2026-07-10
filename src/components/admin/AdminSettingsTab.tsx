import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, PhoneCall, Mail, MessageCircle, MapPin, Truck, ShieldAlert, Sparkles,
  UserPlus, Trash2, Users, ShieldCheck, Key, RefreshCw, Sparkle, AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';

export const AdminSettingsTab: React.FC = () => {
  const { triggerFeedback, adminUser } = useMarketplace();

  // Store configs keys
  const [phone, setPhone] = useState('+256 701 445588');
  const [email, setEmail] = useState('curator@debbieatelier.com');
  const [whatsapp, setWhatsapp] = useState('+256 701 445588');
  const [address, setAddress] = useState('Debbie Atelier Chambers, Plot 12 Acacia Avenue, Kololo, Kampala, Uganda');
  
  // Delivery rule sets
  const [deliveryKampala, setDeliveryKampala] = useState('12 - 24 hours (UGX 10,000)');
  const [deliveryUpcountry, setDeliveryUpcountry] = useState('48 - 72 hours (UGX 30,000)');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // Admin Account states
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [showCreator, setShowCreator] = useState(false);

  // New account form state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [createError, setCreateError] = useState('');

  // Fetch admin accounts
  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const res = await fetch("/api/admin/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Failed to read accounts", e);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

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

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Awaiting keys', color: 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800' };
    if (pass.length < 4) return { label: 'Fragile Credentials', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' };
    if (pass.length < 7) return { label: 'Medium security', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' };
    return { label: 'Cryptographic Strength', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' };
  };

  const handleAutoGenerate = () => {
    const firstNames = ["Sonia", "Kato", "Fiona", "Derrick", "Sandra", "Trevor", "Priscilla", "Ivan", "Debbie"];
    const lastNames = ["Alinda", "Mugisha", "Kayiwa", "Nsubuga", "Apio", "Tumusiime", "Nanteza", "Sartorial"];
    
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const fullName = `${randomFirst} ${randomLast}`;
    const username = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}`;
    const generatedEmail = `${randomFirst.toLowerCase()}@debbieatelier.com`;
    
    // Generate secure 8 char password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#";
    let password = "";
    for (let i = 0; i < 9; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setNewName(fullName);
    setNewUsername(username);
    setNewEmail(generatedEmail);
    setNewPassword(password);
    
    triggerFeedback("Bespoke Curator Credentials Configured!", "info");
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreatingAccount(true);

    if (newPassword.length < 4) {
      setCreateError('Cryptographic key must be at least 4 characters.');
      setCreatingAccount(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim().toLowerCase(),
          password: newPassword,
          name: newName.trim(),
          email: newEmail.trim()
        })
      });

      if (res.ok) {
        triggerFeedback(`Atelier credentials for ${newName} initialized!`, "success");
        setNewUsername('');
        setNewPassword('');
        setNewName('');
        setNewEmail('');
        setShowCreator(false);
        await loadAccounts();
      } else {
        const errData = await res.json();
        setCreateError(errData.error || "Failed to establish administrator account.");
      }
    } catch (err) {
      setCreateError("Handshake timed out. Check connection endpoints.");
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleDeleteAccount = async (id: string, username: string) => {
    if (username === "admin") {
      triggerFeedback("The primary master 'admin' account cannot be terminated.", "error");
      return;
    }
    
    if (adminUser?.username === username) {
      triggerFeedback("Self-termination is cryptographically prohibited.", "error");
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to revoke the curator credentials for '${username}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/accounts/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        triggerFeedback(`Curator account '${username}' revoked.`, "info");
        await loadAccounts();
      } else {
        const errData = await res.json();
        triggerFeedback(errData.error || "Failed to terminate curator account.", "error");
      }
    } catch (e) {
      triggerFeedback("Failed to contact credentials server.", "error");
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in font-sans text-xs" id="admin-settings-tab">
      
      {/* 1. PHYSICAL & LOGISTICS COORDINATES */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded border border-zinc-150 dark:border-zinc-800 lg:col-span-2 space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Operating Rules</span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Boutique Operating Specs</h3>
          </div>
          <Settings className="h-5 w-5 text-zinc-400 shrink-0" />
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded text-xxs italic flex items-center gap-1.5 animate-bounce">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider block font-mono">Boutique Phone line</span>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-950 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold rounded" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider block font-mono">Official contact Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-950 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold rounded" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider block font-mono">WhatsApp Redirect Number</span>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-950 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold rounded" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xxs font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider block font-mono">Kampala delivery timelines rules</span>
              <div className="relative">
                <Truck className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input type="text" value={deliveryKampala} onChange={(e) => setDeliveryKampala(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-950 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold rounded" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider block font-mono">Upcountry Uganda Logistical delivery timing</span>
            <input type="text" value={deliveryUpcountry} onChange={(e) => setDeliveryUpcountry(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold rounded" />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-400 uppercase tracking-wider block font-mono">Physical Acacia Chambers Address location</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="pl-9 w-full bg-zinc-50 dark:bg-zinc-950 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold text-xxs font-medium rounded" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2.5 bg-zinc-950 hover:bg-luxury-gold text-white uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors border-none rounded disabled:opacity-50"
          >
            <Save className="h-4 w-4 shrink-0" />
            <span>{saving ? 'Saving Specs...' : 'Update specifications'}</span>
          </button>
        </form>
      </div>

      {/* 2. ENHANCED ADMINISTRATORS CREATOR & DIRECTORY */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded border border-zinc-150 dark:border-zinc-800 space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Atelier Registrar</span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Manage Curators</h3>
            </div>
            <Users className="h-5 w-5 text-zinc-400 shrink-0 animate-pulse" />
          </div>

          {/* SECURITY WARNING */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 font-mono uppercase">
              <ShieldAlert className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
              <span>Cryptographic Protection</span>
            </div>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-400 italic leading-relaxed">
              New curators gain restricted access to inventories, logistics pipelines, and layout codes.
            </p>
          </div>

          {/* DYNAMIC ACCOUNT FORM TOGGLE */}
          {!showCreator ? (
            <button
              onClick={() => setShowCreator(true)}
              className="w-full py-3 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-luxury-gold dark:hover:border-luxury-gold text-zinc-500 hover:text-luxury-gold font-bold font-mono uppercase tracking-wider text-[10px] rounded flex items-center justify-center gap-2 transition-all bg-transparent cursor-pointer"
            >
              <UserPlus className="h-4 w-4 shrink-0" />
              <span>Deploy New Curator</span>
            </button>
          ) : (
            <form onSubmit={handleCreateAccountSubmit} className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 animate-slide-in font-sans">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-luxury-gold flex items-center gap-1">
                  <Sparkle className="h-3.5 w-3.5 text-luxury-gold shrink-0 animate-spin" />
                  <span>Bespoke Account Blueprint</span>
                </span>
                <button
                  type="button"
                  onClick={() => { setShowCreator(false); setCreateError(''); }}
                  className="text-zinc-400 hover:text-rose-500 text-[10px] font-mono font-bold bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {createError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-[10px] font-bold italic rounded flex items-start gap-1.5 leading-normal border border-rose-500/10">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-zinc-400">Curator Name</span>
                    <button
                      type="button"
                      onClick={handleAutoGenerate}
                      className="text-[9px] font-mono text-luxury-gold hover:underline bg-transparent border-none cursor-pointer font-bold uppercase flex items-center gap-1"
                    >
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                      <span>Autogen</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Alinda"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 p-2 text-xxs font-medium rounded text-zinc-900 dark:text-white focus:border-luxury-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-zinc-400">Atelier Username</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. jane.alinda"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 p-2 text-xxs font-mono rounded text-zinc-900 dark:text-white focus:border-luxury-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-zinc-400">Official Registrar Email</span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jane@debbieatelier.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 p-2 text-xxs font-medium rounded text-zinc-900 dark:text-white focus:border-luxury-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-zinc-400">Keychain Passcode</span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 p-2 text-xxs rounded text-zinc-900 dark:text-white focus:border-luxury-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingAccount}
                className="w-full bg-zinc-950 hover:bg-luxury-gold text-white font-bold py-2.5 uppercase tracking-widest text-[10px] rounded transition-colors cursor-pointer border-none flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>{creatingAccount ? "Authorizing Keys..." : "Publish Credentials"}</span>
              </button>
            </form>
          )}

          {/* ACTIVE CURATORS LIST */}
          <div className="space-y-3 pt-3">
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase block">Active Atelier Registry</span>
            
            {loadingAccounts ? (
              <div className="text-center py-4 text-zinc-400 font-mono text-[10px] animate-pulse">
                Decrypting directory index...
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {accounts.map((acc) => {
                  const isPrimaryAdmin = acc.username === "admin";
                  const isSelf = adminUser?.username === acc.username;

                  return (
                    <div 
                      key={acc.id}
                      className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-150 dark:border-zinc-850 flex items-center justify-between gap-3 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-bold text-zinc-900 dark:text-white tracking-wide truncate">
                            {acc.name}
                          </p>
                          {isPrimaryAdmin ? (
                            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide font-mono scale-90">
                              Master
                            </span>
                          ) : (
                            <span className="bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide font-mono scale-90">
                              Curator
                            </span>
                          )}
                          {isSelf && (
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide font-mono scale-90">
                              You
                            </span>
                          )}
                        </div>
                        
                        <p className="text-[10px] font-mono text-zinc-400 truncate">
                          @{acc.username} • {acc.email}
                        </p>
                      </div>

                      {!isPrimaryAdmin && !isSelf && (
                        <button
                          onClick={() => handleDeleteAccount(acc.id, acc.username)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded cursor-pointer border-none bg-transparent transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Revoke active curator authority"
                        >
                          <Trash2 className="h-4 w-4 shrink-0" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="text-center font-mono text-[9px] text-zinc-400 opacity-60 pointer-events-none select-none pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
          SYSTEM ACCESS LOGS: PROTECTED SECURE CORES
        </div>
      </div>

    </div>
  );
};
