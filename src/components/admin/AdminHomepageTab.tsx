import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { 
  Sliders, Image as ImageIcon, Link as LinkIcon, Sparkles, CheckSquare, Square, Save, 
  RefreshCw, Eye, EyeOff, MoveUp, MoveDown, Plus, Trash2, Edit, Check, RotateCcw, 
  Calendar, ChevronDown, ChevronUp, Smartphone, Monitor, Globe, FileText, Search, Clipboard, X, Info,
  Folder, ShoppingBag
} from 'lucide-react';
import { defaultHomepageConfig, HomepageConfig } from '../../utils/defaultHomepageConfig';
import { Home } from '../../pages/Home';

export const AdminHomepageTab: React.FC = () => {
  const { 
    settings, updateSettings, products, collections, media, createMedia, deleteMedia 
  } = useMarketplace();

  // Pick up or fallback configuration
  const initialConfig: HomepageConfig = (settings as any)?.homepage_config || defaultHomepageConfig;

  // Local drafted builder state
  const [draftConfig, setDraftConfig] = useState<HomepageConfig>(initialConfig);
  const [activeSectionAccordion, setActiveSectionAccordion] = useState<string | null>('hero');
  
  // Builder environment states
  const [isDraftMode, setIsDraftMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [versionHistory, setVersionHistory] = useState<Array<{ id: string; name: string; timestamp: string; config: HomepageConfig }>>([
    { id: 'v-1', name: 'v1.0 - Store Launch Layout', timestamp: '2026-06-01 10:15', config: defaultHomepageConfig },
    { id: 'v-2', name: 'v1.1 - Winter Clearance Layout', timestamp: '2026-06-03 14:20', config: {
      ...defaultHomepageConfig,
      hero: {
        ...defaultHomepageConfig.hero,
        title: "WINTER CLEARANCE SALE",
        subtitle: "Unbelievable markdown clearances on East African cotton sweaters & fine leather bombers."
      }
    }}
  ]);

  // Media library manager state
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [mediaTargetInput, setMediaTargetInput] = useState<{ path: string; index?: number } | null>(null);
  
  // Media items local setup helper
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [mediaError, setMediaError] = useState('');

  // Sync draftConfig if server settings refresh
  useEffect(() => {
    if ((settings as any)?.homepage_config) {
      setDraftConfig((settings as any).homepage_config);
    }
  }, [settings]);

  // Handle Automatic Saving
  useEffect(() => {
    if (!autoSave) return;
    const timeout = setTimeout(() => {
      handleAutoSave();
    }, 1500); // Save after 1.5s of typing inactivity
    return () => clearTimeout(timeout);
  }, [draftConfig, autoSave]);

  const handleAutoSave = async () => {
    setSavingStatus('saving');
    const success = await updateSettings({ homepage_config: draftConfig } as any);
    if (success) {
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 2000);
    } else {
      setSavingStatus('error');
    }
  };

  const handlePublishLive = async () => {
    setSavingStatus('saving');
    // Save draftConfig directly as live
    const success = await updateSettings({ homepage_config: draftConfig } as any);
    if (success) {
      setIsDraftMode(false);
      setSavingStatus('saved');
      alert("Atelier homepage coordinates successfully published to the live public server!");
      setTimeout(() => setSavingStatus('idle'), 2500);
    } else {
      setSavingStatus('error');
      alert("Failed to synchronize layout coordinates with live database.");
    }
  };

  const recoverVersion = (config: HomepageConfig) => {
    if (window.confirm("Are you certain you want to rollback homepage coordinates to this historic version? Current adjustments will be overwritten.")) {
      setDraftConfig(config);
      alert("Layout coordinates successfully rolled back. Review visual changes in live preview.");
    }
  };

  const submitScheduledPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate) return;
    alert(`Homepage publishing scheduled successfully for ${scheduledDate} at ${scheduledTime || '00:00'}. Coordinates are secured.`);
    setScheduledDate('');
    setScheduledTime('');
  };

  // Section Order moving controls
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...draftConfig.section_order];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = sections[index];
    sections[index] = sections[targetIdx];
    sections[targetIdx] = temp;

    setDraftConfig({
      ...draftConfig,
      section_order: sections
    });
  };

  const toggleSectionActive = (sectionId: string, enabled: boolean) => {
    if (sectionId === 'hero') {
      setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, enabled } });
    } else if (sectionId === 'collections') {
      setDraftConfig({ ...draftConfig, collections_manager: { ...draftConfig.collections_manager, enabled } });
    } else if (sectionId === 'trending') {
      setDraftConfig({ ...draftConfig, trending: { ...draftConfig.trending, enabled } });
    } else if (sectionId === 'new_arrivals') {
      setDraftConfig({ ...draftConfig, new_arrivals: { ...draftConfig.new_arrivals, enabled } });
    } else if (sectionId === 'testimonials') {
      setDraftConfig({ ...draftConfig, testimonials: { ...draftConfig.testimonials, enabled } });
    } else if (sectionId === 'newsletter') {
      setDraftConfig({ ...draftConfig, newsletter: { ...draftConfig.newsletter, enabled } });
    }
  };

  // Create & delete cards inside Collections Manager
  const addCollectionCard = () => {
    const newCard = {
      id: `col-card-${Date.now()}`,
      name: "New Curated Drop",
      description: "Custom lookbook styled piece hand-pressed for elite capsules.",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600",
      link: "catalog"
    };

    setDraftConfig({
      ...draftConfig,
      collections_manager: {
        ...draftConfig.collections_manager,
        cards: [...draftConfig.collections_manager.cards, newCard]
      }
    });
  };

  const deleteCollectionCard = (id: string) => {
    setDraftConfig({
      ...draftConfig,
      collections_manager: {
        ...draftConfig.collections_manager,
        cards: draftConfig.collections_manager.cards.filter(c => c.id !== id)
      }
    });
  };

  // Add & delete cards inside Testimonials section
  const addTestimonialCard = () => {
    const newTest = {
      id: `test-${Date.now()}`,
      name: "New Guest Critic",
      role: "KAMPALA COUTURE REVIEW",
      comment: "Debbie's creative direction meets the absolute peak of modern African sartorial culture.",
      rating: 5,
      photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
    };

    setDraftConfig({
      ...draftConfig,
      testimonials: {
        ...draftConfig.testimonials,
        items: [...draftConfig.testimonials.items, newTest]
      }
    });
  };

  const deleteTestimonialCard = (id: string) => {
    setDraftConfig({
      ...draftConfig,
      testimonials: {
        ...draftConfig.testimonials,
        items: draftConfig.testimonials.items.filter(i => i.id !== id)
      }
    });
  };

  // Multiple Promotional Banners setup
  const addPromoBanner = () => {
    const newBanner = {
      id: `promo-banner-${Date.now()}`,
      enabled: true,
      title: "EXCLUSIVE EDITORIAL PROMO",
      description: "Description of the campaign event that highlights premium apparel elements.",
      image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200",
      cta_text: "VIEW ALL NOW",
      cta_link: "catalog"
    };

    setDraftConfig({
      ...draftConfig,
      promotional_banners: [...draftConfig.promotional_banners, newBanner]
    });
  };

  const deletePromoBanner = (id: string) => {
    setDraftConfig({
      ...draftConfig,
      promotional_banners: draftConfig.promotional_banners.filter(b => b.id !== id)
    });
  };

  // Media library upload helper
  const handleAddMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMediaError('');
    if (!newMediaName || !newMediaUrl) {
      setMediaError('Asset reference name and image secure URL are required.');
      return;
    }

    const success = await createMedia(newMediaName, newMediaUrl);
    if (success) {
      setNewMediaName('');
      setNewMediaUrl('');
    } else {
      setMediaError('Failed to catalog asset coordinates with database.');
    }
  };

  const selectMediaForInput = (url: string) => {
    if (!mediaTargetInput) return;
    const { path, index } = mediaTargetInput;

    if (path === 'hero') {
      setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, image_url: url } });
    } else if (path === 'seo') {
      setDraftConfig({ ...draftConfig, seo: { ...draftConfig.seo, og_image: url } });
    } else if (path === 'collection_card' && typeof index === 'number') {
      const cards = [...draftConfig.collections_manager.cards];
      cards[index].image = url;
      setDraftConfig({
        ...draftConfig,
        collections_manager: { ...draftConfig.collections_manager, cards }
      });
    } else if (path === 'promo_banner' && typeof index === 'number') {
      const banners = [...draftConfig.promotional_banners];
      banners[index].image_url = url;
      setDraftConfig({ ...draftConfig, promotional_banners: banners });
    } else if (path === 'testimonial' && typeof index === 'number') {
      const items = [...draftConfig.testimonials.items];
      items[index].photo_url = url;
      setDraftConfig({
        ...draftConfig,
        testimonials: { ...draftConfig.testimonials, items }
      });
    }

    setMediaLibraryOpen(false);
    setMediaTargetInput(null);
  };

  const triggerMediaSelector = (path: string, index?: number) => {
    setMediaTargetInput({ path, index });
    setMediaLibraryOpen(true);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-[80vh]" id="homepage-builder-cms">
      
      {/* 1. LEFT SIDE: HOMEPAGE BUILDER CONTROLS SIDEBAR */}
      <div className="w-full xl:w-[480px] shrink-0 bg-white dark:bg-zinc-950 rounded border border-zinc-150 dark:border-zinc-850 p-5 flex flex-col space-y-6">
        
        {/* Top Header Builder Stats & Options */}
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Advanced CMS Engine</span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Homepage Theme Editor</h3>
            </div>
            
            {/* Save indicators */}
            <div className="flex items-center space-x-1.5 text-[9px] font-mono uppercase">
              {savingStatus === 'saving' && (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> Saving...
                </span>
              )}
              {savingStatus === 'saved' && (
                <span className="text-emerald-500 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Autosaved
                </span>
              )}
            </div>
          </div>

          {/* Quick toggle settings bar */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-90 px-3 py-2 rounded text-xxs font-mono border border-zinc-150 dark:border-zinc-850">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1.5 cursor-pointer selection:bg-transparent">
                <input 
                  type="checkbox" 
                  checked={autoSave} 
                  onChange={(e) => setAutoSave(e.target.checked)} 
                  className="rounded accent-luxury-gold h-3 w-3" 
                />
                <span className="text-[9px] uppercase font-bold text-zinc-450">Auto Save</span>
              </label>
            </div>

            <button 
              onClick={() => setMediaLibraryOpen(true)}
              className="px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-xxs uppercase tracking-wider bg-white dark:bg-zinc-950 text-luxury-gold cursor-pointer rounded"
            >
              Assets Vault
            </button>
          </div>

          {/* Main Action buttons */}
          <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
            <button 
              onClick={handleAutoSave}
              className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-90 text-zinc-700 dark:text-zinc-250 uppercase font-bold tracking-wider rounded border-none cursor-pointer text-center"
            >
              Save Draft
            </button>
            <button 
              onClick={handlePublishLive}
              className="flex-1 py-2 bg-zinc-950 hover:bg-luxury-gold text-white font-bold uppercase tracking-wider rounded border-none cursor-pointer text-center"
            >
              Publish to Live Site
            </button>
          </div>
        </div>

        {/* ACCORDIONS SECTIONS OUTLINE CONTAINER */}
        <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1.5 scrollbar-thin">
          
          {/* SECTION : REORDER HOMEPAGE SECTIONS */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'reorder' ? null : 'reorder')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase">1. Reorder Page Sections</span>
              </div>
              {activeSectionAccordion === 'reorder' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'reorder' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-3 text-xs leading-relaxed">
                <p className="text-[10px] text-zinc-450 italic">Control your actual public viewport cascade. Drag or click the layout sort buttons to arrange sections visually:</p>
                
                <div className="space-y-2">
                  {draftConfig.section_order.map((sectionId, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === draftConfig.section_order.length - 1;
                    
                    // Human friendly naming
                    let sectName = sectionId.replace('_', ' ').toUpperCase();
                    if (sectionId === 'hero') sectName = 'EDITORIAL HERO BANNER';
                    if (sectionId === 'flash_sale') sectName = 'FLASH SALE TIMER BAR';
                    if (sectionId === 'collections') sectName = 'LIFESTYLE COLLECTION CARDS';
                    if (sectionId === 'trending') sectName = 'WEEKLY TRENDING PRODUCTS';
                    if (sectionId === 'outfit_teaser') sectName = 'OUTFIT BUILDER WIDGET';
                    if (sectionId === 'new_arrivals') sectName = 'NEW ARRIVALS CARDS';
                    if (sectionId === 'promo_banners') sectName = 'PROMOTIONAL MULTI-BANNERS';
                    if (sectionId === 'fashion_inspiration') sectName = 'LOOKBOOK INSPIRATIONS GRID';
                    if (sectionId === 'testimonials') sectName = 'CUSTOMER REVIEWS / TESTIMONIALS';
                    if (sectionId === 'newsletter') sectName = 'HOMEPAGE NEWSLETTER BOX';

                    return (
                      <div 
                        key={sectionId} 
                        className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-95 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-[9px] hover:border-luxury-gold transition-colors"
                      >
                        <span className="font-bold text-zinc-650 truncate max-w-[200px]">{sectName}</span>
                        
                        <div className="flex items-center space-x-1 shrink-0">
                          <button 
                            disabled={isFirst}
                            onClick={() => moveSection(idx, 'up')}
                            className="p-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-90 hover:text-luxury-gold transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            <MoveUp className="h-3 w-3 shrink-0" />
                          </button>
                          <button 
                            disabled={isLast}
                            onClick={() => moveSection(idx, 'down')}
                            className="p-1 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-90 hover:text-luxury-gold transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            <MoveDown className="h-3 w-3 shrink-0" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION : SEO META MANAGEMENT */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'seo' ? null : 'seo')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase">2. Search Engine Optimization (SEO)</span>
              </div>
              {activeSectionAccordion === 'seo' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'seo' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block">SEO Title Tag</span>
                  <input 
                    type="text" 
                    value={draftConfig.seo?.title || ''} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, seo: { ...draftConfig.seo, title: e.target.value } })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800" 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block">Meta Description</span>
                  <textarea 
                    value={draftConfig.seo?.description || ''} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, seo: { ...draftConfig.seo, description: e.target.value } })} 
                    rows={3}
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 text-xxs" 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block">Target Keywords</span>
                  <input 
                    type="text" 
                    value={draftConfig.seo?.keywords || ''} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, seo: { ...draftConfig.seo, keywords: e.target.value } })} 
                    placeholder="e.g. fashion, silk clothing, kampala boutique"
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800" 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block font-bold">Open Graph Cover Image</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={draftConfig.seo?.og_image || ''} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, seo: { ...draftConfig.seo, og_image: e.target.value } })} 
                      className="flex-1 bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 text-xxs font-mono" 
                    />
                    <button 
                      type="button" 
                      onClick={() => triggerMediaSelector('seo')}
                      className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer shrink-0"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : HERO EDITOR */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'hero' ? null : 'hero')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase">3. Hero Section Editor</span>
              </div>
              {activeSectionAccordion === 'hero' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'hero' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xxs font-mono uppercase text-zinc-400 font-bold">Show Hero Section</span>
                  <input 
                    type="checkbox" 
                    checked={draftConfig.hero?.enabled} 
                    onChange={(e) => toggleSectionActive('hero', e.target.checked)} 
                    className="accent-luxury-gold rounded cursor-pointer h-4.5 w-4.5" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block">Hero Main Title</span>
                  <input 
                    type="text" 
                    value={draftConfig.hero?.title} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, title: e.target.value } })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 text-xs" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block font-medium">Hero Subtitle Paragraph Narrative</span>
                  <textarea 
                    value={draftConfig.hero?.subtitle} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, subtitle: e.target.value } })} 
                    rows={3}
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 leading-relaxed text-xxs font-sans" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">CTA Button Label</span>
                    <input 
                      type="text" 
                      value={draftConfig.hero?.cta_text} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, cta_text: e.target.value } })} 
                      className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">CTA Link</span>
                    <select 
                      value={draftConfig.hero?.cta_link} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, cta_link: e.target.value } })}
                      className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 text-xxs"
                    >
                      <option value="catalog">Product Catalog</option>
                      <option value="outfit-builder">Outfit Builder</option>
                      <option value="ai-stylist">Gemini Stylist AI</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 font-bold block">Background Cover Image URL</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={draftConfig.hero?.image_url} 
                      onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, image_url: e.target.value } })} 
                      className="flex-1 bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 text-xxs font-mono animate-fade-in" 
                    />
                    <button 
                      type="button" 
                      onClick={() => triggerMediaSelector('hero')}
                      className="p-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer shrink-0"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-[10px] text-zinc-400 block font-bold">Background Video Code (HTTPS secure link)</span>
                  <input 
                    type="text" 
                    value={draftConfig.hero?.video_url} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, hero: { ...draftConfig.hero, video_url: e.target.value } })} 
                    placeholder="https://assets.mixkit.co/videos/preview/mixkit-fashion-details-of-satin-dress..."
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white border-zinc-200 border-zinc-850 text-xxs font-mono" 
                  />
                  <p className="text-[9px] text-zinc-400 italic">Leaves blank to load standard Unsplash backdrop editorial images.</p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : LIFESTYLE COLLECTIONS CARDS */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'collections' ? null : 'collections')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase">4. Curated Collections Cards</span>
              </div>
              {activeSectionAccordion === 'collections' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'collections' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xxs font-mono uppercase text-zinc-400 font-bold">Show Collections Section</span>
                  <input 
                    type="checkbox" 
                    checked={draftConfig.collections_manager?.enabled} 
                    onChange={(e) => toggleSectionActive('collections', e.target.checked)} 
                    className="accent-luxury-gold rounded cursor-pointer h-4.5 w-4.5" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Section Main Header</span>
                  <input 
                    type="text" 
                    value={draftConfig.collections_manager?.title} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      collections_manager: { ...draftConfig.collections_manager, title: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Section Subtitle</span>
                  <input 
                    type="text" 
                    value={draftConfig.collections_manager?.subtitle} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      collections_manager: { ...draftConfig.collections_manager, subtitle: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white text-xxs font-sans" 
                  />
                </div>

                {/* Cards Management list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 block">Collections Cards list</span>
                  
                  {draftConfig.collections_manager?.cards.map((card, idx) => (
                    <div key={card.id || idx} className="p-3 bg-zinc-50 dark:bg-zinc-95 border border-zinc-200 dark:border-zinc-800 rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold uppercase text-luxury-gold">Card Coordinate #{idx+1}</span>
                        <button 
                          type="button" 
                          onClick={() => deleteCollectionCard(card.id)}
                          className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <input 
                          type="text" 
                          value={card.name} 
                          onChange={(e) => {
                            const cards = [...draftConfig.collections_manager.cards];
                            cards[idx].name = e.target.value;
                            setDraftConfig({ ...draftConfig, collections_manager: { ...draftConfig.collections_manager, cards } });
                          }} 
                          placeholder="Collection Name" 
                          className="w-full bg-white dark:bg-zinc-900 border p-1.5 text-xxs focus:outline-none dark:text-white" 
                        />
                      </div>

                      <div className="space-y-1">
                        <textarea 
                          value={card.description} 
                          onChange={(e) => {
                            const cards = [...draftConfig.collections_manager.cards];
                            cards[idx].description = e.target.value;
                            setDraftConfig({ ...draftConfig, collections_manager: { ...draftConfig.collections_manager, cards } });
                          }} 
                          rows={2}
                          placeholder="Sartorial description..." 
                          className="w-full bg-white dark:bg-zinc-900 border p-1.5 text-xxs font-sans leading-normal focus:outline-none dark:text-white" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase">Cover backdrop</span>
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              value={card.image} 
                              onChange={(e) => {
                                const cards = [...draftConfig.collections_manager.cards];
                                cards[idx].image = e.target.value;
                                setDraftConfig({ ...draftConfig, collections_manager: { ...draftConfig.collections_manager, cards } });
                              }} 
                              placeholder="Image Link" 
                              className="flex-1 bg-white dark:bg-zinc-900 border p-1 text-[9px] font-mono focus:outline-none dark:text-white" 
                            />
                            <button 
                              type="button" 
                              onClick={() => triggerMediaSelector('collection_card', idx)}
                              className="p-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                            >
                              <ImageIcon className="h-3 w-3 shrink-0" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase">Redirect link</span>
                          <input 
                            type="text" 
                            value={card.link} 
                            onChange={(e) => {
                              const cards = [...draftConfig.collections_manager.cards];
                              cards[idx].link = e.target.value;
                              setDraftConfig({ ...draftConfig, collections_manager: { ...draftConfig.collections_manager, cards } });
                            }} 
                            placeholder="Link slug" 
                            className="w-full bg-white dark:bg-zinc-900 border p-1 text-[9px] font-mono focus:outline-none dark:text-white" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={addCollectionCard}
                    className="w-full py-2 border border-dashed border-zinc-300 hover:border-luxury-gold hover:text-luxury-gold text-xxs text-zinc-500 font-mono tracking-wider bg-transparent rounded cursor-pointer transition-colors"
                  >
                    + Add New Collection Card
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : WEEKLY TRENDING PRODUCTS */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'trending' ? null : 'trending')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase">5. Weekly Trending items</span>
              </div>
              {activeSectionAccordion === 'trending' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'trending' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xxs font-mono uppercase text-zinc-400 font-bold">Show Trending Section</span>
                  <input 
                    type="checkbox" 
                    checked={draftConfig.trending?.enabled} 
                    onChange={(e) => toggleSectionActive('trending', e.target.checked)} 
                    className="accent-luxury-gold rounded cursor-pointer h-4.5 w-4.5" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Trending Title</span>
                  <input 
                    type="text" 
                    value={draftConfig.trending?.title} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, trending: { ...draftConfig.trending, title: e.target.value } })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Trending Subtitle description</span>
                  <input 
                    type="text" 
                    value={draftConfig.trending?.subtitle} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, trending: { ...draftConfig.trending, subtitle: e.target.value } })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white text-xxs" 
                  />
                </div>

                {/* Choose products listing to selectively hide */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Hide specific garments from stream</span>
                  <p className="text-[9px] text-zinc-450 italic leading-normal">Checking products below will exclude them from on-display rows:</p>
                  
                  <div className="max-h-48 overflow-y-auto border border-zinc-150 dark:border-zinc-800 p-2 space-y-1.5 rounded">
                    {products.map((p) => {
                      const isHidden = draftConfig.trending.hidden_product_ids?.includes(p.id) || false;
                      return (
                        <label key={p.id} className="flex items-center space-x-2 bg-zinc-50 dark:bg-zinc-95 p-1 rounded cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={isHidden} 
                            onChange={(e) => {
                              const list = draftConfig.trending.hidden_product_ids ? [...draftConfig.trending.hidden_product_ids] : [];
                              if (e.target.checked) {
                                list.push(p.id);
                              } else {
                                const idx = list.indexOf(p.id);
                                if (idx > -1) list.splice(idx, 1);
                              }
                              setDraftConfig({
                                ...draftConfig,
                                trending: { ...draftConfig.trending, hidden_product_ids: list }
                              });
                            }}
                            className="rounded accent-rose-500 h-3.5 w-3.5 shrink-0" 
                          />
                          <span className="text-xxxxs font-mono font-bold text-zinc-600 dark:text-zinc-300 truncate">{p.title} (UGX {p.price.toLocaleString()})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : NEW ARRIVALS */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'new_arrivals' ? null : 'new_arrivals')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase font-bold">6. New Arrivals Section</span>
              </div>
              {activeSectionAccordion === 'new_arrivals' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'new_arrivals' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xxs font-mono uppercase text-zinc-400 font-bold">Show New Arrivals section</span>
                  <input 
                    type="checkbox" 
                    checked={draftConfig.new_arrivals?.enabled} 
                    onChange={(e) => toggleSectionActive('new_arrivals', e.target.checked)} 
                    className="accent-luxury-gold rounded cursor-pointer h-4.5 w-4.5" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">New Arrivals title</span>
                  <input 
                    type="text" 
                    value={draftConfig.new_arrivals?.title} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, new_arrivals: { ...draftConfig.new_arrivals, title: e.target.value } })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">New Arrivals Subtitle</span>
                  <input 
                    type="text" 
                    value={draftConfig.new_arrivals?.subtitle} 
                    onChange={(e) => setDraftConfig({ ...draftConfig, new_arrivals: { ...draftConfig.new_arrivals, subtitle: e.target.value } })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white text-xxs font-sans" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Display Layout blueprint Style</span>
                  <select 
                    value={draftConfig.new_arrivals?.display_style || 'grid'} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      new_arrivals: { ...draftConfig.new_arrivals, display_style: e.target.value as any }
                    })}
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white"
                  >
                    <option value="grid">Standard 4-Column Grid</option>
                    <option value="bento">Asymmetric Bento Frame</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : PROMOTIONAL BANNERS */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'promotions' ? null : 'promotions')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase font-bold">7. Multi promotional Banners</span>
              </div>
              {activeSectionAccordion === 'promotions' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'promotions' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <p className="text-[10px] text-zinc-450 italic">Schedule and align secondary marketing slide sheets below:</p>

                <div className="space-y-4">
                  {draftConfig.promotional_banners?.map((banner, idx) => (
                    <div key={banner.id} className="p-3 bg-zinc-50 dark:bg-zinc-95 border border-zinc-200 dark:border-zinc-805 rounded space-y-3">
                      <div className="flex items-center justify-between border-b pb-1">
                        <label className="flex items-center space-x-1.5 cursor-pointer text-xxs font-mono font-bold text-luxury-gold select-none">
                          <input 
                            type="checkbox" 
                            checked={banner.enabled} 
                            onChange={(e) => {
                              const banners = [...draftConfig.promotional_banners];
                              banners[idx].enabled = e.target.checked;
                              setDraftConfig({ ...draftConfig, promotional_banners: banners });
                            }} 
                            className="rounded accent-luxury-gold" 
                          />
                          <span>BANNER #{idx+1} ACTIVE</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => deletePromoBanner(banner.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase text-zinc-400">Campaign Header Label</span>
                        <input 
                          type="text" 
                          value={banner.title} 
                          onChange={(e) => {
                            const banners = [...draftConfig.promotional_banners];
                            banners[idx].title = e.target.value;
                            setDraftConfig({ ...draftConfig, promotional_banners: banners });
                          }} 
                          className="w-full bg-white dark:bg-zinc-900 border p-1.5 text-xxs dark:text-white" 
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase text-zinc-400">Interactive Description Paragraph</span>
                        <textarea 
                          value={banner.description} 
                          onChange={(e) => {
                            const banners = [...draftConfig.promotional_banners];
                            banners[idx].description = e.target.value;
                            setDraftConfig({ ...draftConfig, promotional_banners: banners });
                          }} 
                          rows={2}
                          className="w-full bg-white dark:bg-zinc-900 border p-1.5 text-xxs leading-snug dark:text-white" 
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase text-zinc-400">Campaign Image Backdrop</span>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={banner.image_url} 
                            onChange={(e) => {
                              const banners = [...draftConfig.promotional_banners];
                              banners[idx].image_url = e.target.value;
                              setDraftConfig({ ...draftConfig, promotional_banners: banners });
                            }} 
                            className="flex-1 bg-white dark:bg-zinc-900 border p-1 text-[9px] font-mono dark:text-white focus:outline-none" 
                          />
                          <button 
                            type="button" 
                            onClick={() => triggerMediaSelector('promo_banner', idx)}
                            className="p-1 border border-zinc-205 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-bold text-zinc-400 block">START DATE</span>
                          <input 
                            type="date" 
                            value={banner.start_date || ''} 
                            onChange={(e) => {
                              const banners = [...draftConfig.promotional_banners];
                              banners[idx].start_date = e.target.value;
                              setDraftConfig({ ...draftConfig, promotional_banners: banners });
                            }} 
                            className="w-full bg-white dark:bg-zinc-900 border p-1 text-[9px] font-mono text-zinc-650" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono font-bold text-zinc-400 block">END DATE</span>
                          <input 
                            type="date" 
                            value={banner.end_date || ''} 
                            onChange={(e) => {
                              const banners = [...draftConfig.promotional_banners];
                              banners[idx].end_date = e.target.value;
                              setDraftConfig({ ...draftConfig, promotional_banners: banners });
                            }} 
                            className="w-full bg-white dark:bg-zinc-900 border p-1 text-[9px] font-mono text-zinc-650" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={addPromoBanner}
                    className="w-full py-2 border border-dashed border-zinc-300 hover:border-luxury-gold hover:text-luxury-gold text-xxs text-zinc-500 font-mono tracking-wider bg-transparent rounded cursor-pointer"
                  >
                    + Catalog New Promotion Banner
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : PUBLIC TESTIMONIALS */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'testimonials' ? null : 'testimonials')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase font-bold">8. Editorial Guest Testimonials</span>
              </div>
              {activeSectionAccordion === 'testimonials' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'testimonials' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xxs font-mono uppercase text-zinc-400 font-bold">Show Guest Critiques rows</span>
                  <input 
                    type="checkbox" 
                    checked={draftConfig.testimonials?.enabled} 
                    onChange={(e) => toggleSectionActive('testimonials', e.target.checked)} 
                    className="accent-luxury-gold rounded cursor-pointer h-4.5 w-4.5" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Section Header Label</span>
                  <input 
                    type="text" 
                    value={draftConfig.testimonials?.title} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      testimonials: { ...draftConfig.testimonials, title: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-90border px-2.5 py-1.5 focus:outline-none dark:text-white" 
                  />
                </div>

                {/* Testimonies list */}
                <div className="space-y-3 pt-2">
                  {draftConfig.testimonials?.items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-zinc-50 dark:bg-zinc-95 border border-zinc-200 dark:border-zinc-800 rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-zinc-400">Review Card #{idx+1}</span>
                        <button 
                          type="button" 
                          onClick={() => deleteTestimonialCard(item.id)}
                          className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => {
                            const items = [...draftConfig.testimonials.items];
                            items[idx].name = e.target.value;
                            setDraftConfig({ ...draftConfig, testimonials: { ...draftConfig.testimonials, items } });
                          }} 
                          placeholder="Reviewer Name" 
                          className="w-full bg-white dark:bg-zinc-900 border p-1 text-xxs focus:outline-none dark:text-white" 
                        />
                        <input 
                          type="text" 
                          value={item.role} 
                          onChange={(e) => {
                            const items = [...draftConfig.testimonials.items];
                            items[idx].role = e.target.value;
                            setDraftConfig({ ...draftConfig, testimonials: { ...draftConfig.testimonials, items } });
                          }} 
                          placeholder="Reviewer Role/Tagline" 
                          className="w-full bg-white dark:bg-zinc-900 border p-1 text-xxs focus:outline-none dark:text-white" 
                        />
                      </div>

                      <textarea 
                        value={item.comment} 
                        onChange={(e) => {
                          const items = [...draftConfig.testimonials.items];
                          items[idx].comment = e.target.value;
                          setDraftConfig({ ...draftConfig, testimonials: { ...draftConfig.testimonials, items } });
                        }} 
                        rows={2}
                        placeholder="Guest feedback details..." 
                        className="w-full bg-white dark:bg-zinc-900 border p-1 text-xxs leading-relaxed font-sans focus:outline-none dark:text-white" 
                      />

                      <div className="flex gap-1.5 items-center">
                        <span className="text-[8px] font-mono text-zinc-400 block font-bold">AVATAR OVERLAY:</span>
                        <input 
                          type="text" 
                          value={item.photo_url || ''} 
                          onChange={(e) => {
                            const items = [...draftConfig.testimonials.items];
                            items[idx].photo_url = e.target.value;
                            setDraftConfig({ ...draftConfig, testimonials: { ...draftConfig.testimonials, items } });
                          }} 
                          placeholder="Avatar Link" 
                          className="flex-1 bg-white dark:bg-zinc-900 border p-1 text-[9px] font-mono focus:outline-none dark:text-white" 
                        />
                        <button 
                          type="button" 
                          onClick={() => triggerMediaSelector('testimonial', idx)}
                          className="p-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded cursor-pointer"
                        >
                          <ImageIcon className="h-3 w-3 shrink-0" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={addTestimonialCard}
                    className="w-full py-2 border border-dashed border-zinc-300 hover:border-luxury-gold hover:text-luxury-gold text-xxs text-zinc-500 font-mono tracking-wider bg-transparent rounded cursor-pointer"
                  >
                    + Catalog Guest Critique Card
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION : PUBLIC NEWSLETTER */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'newsletter' ? null : 'newsletter')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase font-bold">9. Standalone Newsletter Box</span>
              </div>
              {activeSectionAccordion === 'newsletter' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'newsletter' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xxs font-mono uppercase text-zinc-400 font-bold">Show Newsletter widget box</span>
                  <input 
                    type="checkbox" 
                    checked={draftConfig.newsletter?.enabled} 
                    onChange={(e) => toggleSectionActive('newsletter', e.target.checked)} 
                    className="accent-luxury-gold rounded cursor-pointer h-4.5 w-4.5" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-bold">Newsletter Title</span>
                  <input 
                    type="text" 
                    value={draftConfig.newsletter?.title} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      newsletter: { ...draftConfig.newsletter, title: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">Newsletter Description</span>
                  <textarea 
                    value={draftConfig.newsletter?.description} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      newsletter: { ...draftConfig.newsletter, description: e.target.value }
                    })} 
                    rows={2}
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2.5 focus:outline-none dark:text-white text-xxs font-sans leading-normal" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION : FOOTER BUILDER */}
          <div className="border border-zinc-200 dark:border-zinc-850 rounded overflow-hidden shadow-xs">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'footer' ? null : 'footer')}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-90 cursor-pointer border-none text-left"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-luxury-gold shrink-0" />
                <span className="text-xxs font-mono font-bold tracking-widest text-zinc-900 dark:text-white uppercase font-bold">10. Global Footer Builder</span>
              </div>
              {activeSectionAccordion === 'footer' ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </button>

            {activeSectionAccordion === 'footer' && (
              <div className="p-4 bg-white dark:bg-zinc-900 space-y-4 text-xs font-sans text-zinc-550">
                
                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase text-zinc-400 block font-bold">Support Hotline Phone</span>
                  <input 
                    type="text" 
                    value={draftConfig.footer?.contact_phone || ''} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      footer: { ...draftConfig.footer, contact_phone: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase text-zinc-400 block font-bold font-bold">WhatsApp Redirect Number</span>
                  <input 
                    type="text" 
                    value={draftConfig.footer?.whatsapp_number || ''} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      footer: { ...draftConfig.footer, whatsapp_number: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase text-zinc-400 block font-bold font-bold">Contact Mail Address</span>
                  <input 
                    type="email" 
                    value={draftConfig.footer?.email || ''} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      footer: { ...draftConfig.footer, email: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none" 
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-mono uppercase text-zinc-400 block font-semibold">Store Address Location</span>
                  <input 
                    type="text" 
                    value={draftConfig.footer?.address || ''} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      footer: { ...draftConfig.footer, address: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none text-xxs font-sans" 
                  />
                </div>

                {/* Social media inputs */}
                <div className="border-t border-zinc-150 pt-2 space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-400 block">Social Media Coordinates</span>
                  <div className="grid grid-cols-2 gap-2 text-xxs font-mono">
                    <input 
                      type="text" 
                      value={draftConfig.footer?.social_instagram || ''} 
                      onChange={(e) => setDraftConfig({
                        ...draftConfig,
                        footer: { ...draftConfig.footer, social_instagram: e.target.value }
                      })} 
                      placeholder="Instagram URL" 
                      className="bg-zinc-50 dark:bg-zinc-95 border p-1" 
                    />
                    <input 
                      type="text" 
                      value={draftConfig.footer?.social_facebook || ''} 
                      onChange={(e) => setDraftConfig({
                        ...draftConfig,
                        footer: { ...draftConfig.footer, social_facebook: e.target.value }
                      })} 
                      placeholder="Facebook URL" 
                      className="bg-zinc-50 dark:bg-zinc-95 border p-1" 
                    />
                    <input 
                      type="text" 
                      value={draftConfig.footer?.social_twitter || ''} 
                      onChange={(e) => setDraftConfig({
                        ...draftConfig,
                        footer: { ...draftConfig.footer, social_twitter: e.target.value }
                      })} 
                      placeholder="Twitter URL" 
                      className="bg-zinc-50 dark:bg-zinc-95 border p-1" 
                    />
                    <input 
                      type="text" 
                      value={draftConfig.footer?.social_pinterest || ''} 
                      onChange={(e) => setDraftConfig({
                        ...draftConfig,
                        footer: { ...draftConfig.footer, social_pinterest: e.target.value }
                      })} 
                      placeholder="Pinterest URL" 
                      className="bg-zinc-50 dark:bg-zinc-95 border p-1" 
                    />
                  </div>
                </div>

                <div className="space-y-1 border-t pt-2">
                  <span className="text-[9px] font-mono uppercase text-zinc-400 block font-bold">Copyright Legend Text</span>
                  <input 
                    type="text" 
                    value={draftConfig.footer?.copyright_text || ''} 
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      footer: { ...draftConfig.footer, copyright_text: e.target.value }
                    })} 
                    className="w-full bg-zinc-50 dark:bg-zinc-95 border p-2 focus:outline-none text-xxs font-sans" 
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* CMS SYSTEM UTILITIES: VERSION ROLLBACKS, SCHEDULED ACTIONS */}
        <div className="mt-auto border-t border-zinc-100 dark:border-zinc-900 pt-4 space-y-4">
          
          {/* Version Handlers */}
          <div className="space-y-2 bg-zinc-50 dark:bg-zinc-90 p-3 rounded">
            <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase block">Rollback Layout Coordinates</span>
            <div className="flex gap-2">
              <select 
                onChange={(e) => {
                  const ver = versionHistory.find(v => v.id === e.target.value);
                  if (ver) recoverVersion(ver.config);
                }}
                className="flex-1 bg-white dark:bg-zinc-95 border text-xxs font-mono p-1"
                defaultValue=""
              >
                <option value="" disabled>Select version historical node...</option>
                {versionHistory.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.timestamp})</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => {
                  // Capture current config as a new version history item
                  const verId = `v-hist-${Date.now()}`;
                  const verName = `v1.${versionHistory.length} - Custom Snapshot`;
                  const verTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
                  setVersionHistory([...versionHistory, { id: verId, name: verName, timestamp: verTime, config: draftConfig }]);
                  alert("Layout coordinates snapshot drafted successfully as restoration waypoint!");
                }}
                className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-95 text-[10px] uppercase font-mono tracking-normal cursor-pointer rounded shrink-0 font-bold"
              >
                Snapshot
              </button>
            </div>
          </div>

          {/* Scheduled Publishing */}
          <form onSubmit={submitScheduledPublish} className="space-y-2 bg-zinc-50 dark:bg-zinc-90 p-3 rounded font-mono text-[9px] uppercase font-bold text-zinc-500">
            <span className="text-zinc-400 tracking-wider block">Scheduled Publishing Node</span>
            <div className="grid grid-cols-2 gap-2 text-xxs">
              <input 
                type="date" 
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-white border p-1" 
              />
              <input 
                type="time" 
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="bg-white border p-1" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-1.5 bg-zinc-950 text-white font-mono hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer border-none rounded uppercase block font-bold text-[9px] tracking-wide"
            >
              Secure Release Date
            </button>
          </form>

        </div>
      </div>

      {/* 2. RIGHT SIDE: REAL-TIME WEBSITE SPLIT-SCREEN PREVIEW */}
      <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded flex flex-col overflow-hidden relative">
        
        {/* Device preview tab bars */}
        <div className="bg-white dark:bg-zinc-950 border-b border-zinc-155 dark:border-zinc-850 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xxs font-mono tracking-widest uppercase font-bold text-zinc-500">LIVE PREVIEW SIMULATOR</span>
          </div>

          <div className="flex items-center space-x-2 bg-zinc-50 dark:bg-zinc-90 p-1 rounded border">
            <button 
              onClick={() => setDevicePreview('desktop')}
              className={`p-1 flex items-center gap-1 font-mono text-[9px] uppercase border-none rounded cursor-pointer transition-colors ${
                devicePreview === 'desktop' 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs' 
                  : 'text-zinc-450 hover:text-zinc-800 dark:hover:text-white bg-transparent'
              }`}
              title="Responsive Desktop View"
            >
              <Monitor className="h-3 w-3" />
              <span>Desktop</span>
            </button>
            <button 
              onClick={() => setDevicePreview('mobile')}
              className={`p-1 flex items-center gap-1 font-mono text-[9px] uppercase border-none rounded cursor-pointer transition-colors ${
                devicePreview === 'mobile' 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-xs' 
                  : 'text-zinc-450 hover:text-zinc-800 dark:hover:text-white bg-transparent'
              }`}
              title="Responsive Mobile View"
            >
              <Smartphone className="h-3 w-3" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Actual Preview IFrame simulation container */}
        <div className="flex-1 p-4 grid items-start justify-center overflow-y-auto max-h-[85vh] bg-zinc-100 dark:bg-zinc-900/50">
          <div 
            className={`
              bg-white dark:bg-zinc-950 select-none pointer-events-none shadow-2xl overflow-y-auto border border-zinc-200 dark:border-zinc-800 transition-all duration-500 rounded-lg
              ${devicePreview === 'desktop' ? 'w-full max-w-5xl min-h-[70vh]' : 'w-96 min-h-[70vh]'}
            `}
            style={{ contentVisibility: 'auto' }}
          >
            {/* Header / navbar simulation inside frame */}
            <div className="bg-zinc-950 text-white py-3 px-4 flex items-center justify-between border-b border-zinc-850 sticky top-0 z-50">
              <span className="font-display font-bold text-xxs tracking-widest text-white uppercase select-none">DEBBIE ATELIER</span>
              <div className="flex items-center space-x-3 text-[8px] font-mono text-zinc-400">
                <span>CATALOGUE</span>
                <span>OUTFIT BUILDER</span>
                <span>AI STYLIST</span>
                <span className="text-luxury-gold underline pb-0.5">BAG (0)</span>
              </div>
            </div>

            {/* Dynamic website Home rendering inside simulator */}
            <div className="origin-top transform duration-300">
              <Home previewConfig={draftConfig} />
            </div>
            
            {/* Simulation of public sitemap footer inside frame */}
            <div className="bg-zinc-950 p-6 text-zinc-550 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-[9px]">
              <div className="space-y-1.5">
                <span className="font-display font-medium text-white uppercase text-xxxxs block">Debbie Atelier</span>
                <p className="text-[8px] text-zinc-400 font-sans leading-relaxed">Sartorial African heritage aligned with global luxury digital standards in Kampala Hills.</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono font-bold text-zinc-400 block pb-0.5">COUTURES</span>
                <ul className="space-y-0.5 text-[8px] italic">
                  <li>Streetwear Escapes</li>
                  <li>CEO Executive Mode</li>
                  <li>Campus Drips Drop</li>
                </ul>
              </div>
              <div className="space-y-1 text-right">
                <span className="font-mono text-zinc-400 block font-semibold text-xxxxs">KAMPALA OFFICE DIRECTORY</span>
                <span className="text-[8px] text-zinc-400 font-mono italic block text-right">{draftConfig.footer?.address || "Acacia Avenue Hills"}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. MEDIA LIBRARY MODAL DIALOG ELEMENT */}
      {mediaLibraryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[99] p-4 transition-all">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-2xl space-y-6 relative">
            
            {/* Header popup */}
            <div className="flex items-center justify-between border-b pb-3 border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Workspace Asset Registry</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-luxury-gold" />
                  <span>Media Assets Library</span>
                </h3>
              </div>
              <button 
                onClick={() => { setMediaLibraryOpen(false); setMediaTargetInput(null); }}
                className="text-zinc-400 hover:text-rose-500 border-none bg-transparent cursor-pointer font-mono font-bold text-xxs uppercase"
              >
                Close popup
              </button>
            </div>

            {/* Cataloging form for mock "Upload via Supabase Storage" */}
            <form onSubmit={handleAddMediaSubmit} className="p-3 bg-zinc-50 dark:bg-zinc-95 border border-zinc-150 dark:border-zinc-800 rounded space-y-3 font-sans text-xs text-zinc-550 leading-normal">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase font-bold">Catalog New Asset (Supabase Storage Simulation)</span>
              
              {mediaError && <p className="text-xxs text-rose-505 italic font-semibold">{mediaError}</p>}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase block">Asset Visual Label Name</span>
                  <input 
                    type="text" 
                    required
                    value={newMediaName}
                    onChange={(e) => setNewMediaName(e.target.value)}
                    placeholder="e.g. Winter Cover Shot" 
                    className="w-full bg-white dark:bg-zinc-90 border p-2 focus:outline-none focus:border-luxury-gold text-xxs dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase block">Image secure HTTPS URL (Source)</span>
                  <input 
                    type="text" 
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..." 
                    className="w-full bg-white dark:bg-zinc-90 border p-2 focus:outline-none focus:border-luxury-gold text-xxs dark:text-white font-mono" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-zinc-950 text-white font-mono uppercase text-xxs font-bold tracking-wider hover:bg-luxury-gold border-none rounded cursor-pointer"
                >
                  Confirm Upload & Index
                </button>
              </div>
            </form>

            {/* List list grid of available media */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">Select or Delete Cataloged Assets</span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[35vh] overflow-y-auto p-1 border rounded">
                
                {/* Fallback mock default images of Debbie Atelier store */}
                {[
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
                  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800",
                  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800",
                  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800",
                  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800",
                  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800",
                  "https://images.unsplash.com/photo-1556950103-ee3f130b7367?q=80&w=800",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800"
                ].map((url, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className="group relative h-24 bg-zinc-100 rounded border overflow-hidden hover:border-luxury-gold transition-all flex flex-col justify-between"
                      title="Click to choose asset URL for inputs"
                    >
                      <img src={url} alt="Boutique asset" className="h-full w-full object-cover select-none pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button"
                          onClick={() => triggerMediaSelector(mediaTargetInput ? mediaTargetInput.path : '', mediaTargetInput ? mediaTargetInput.index : undefined)} // fallback
                          className="bg-transparent border-none text-[8px] font-mono text-white font-bold uppercase transition-colors"
                        >
                          INFO
                        </button>
                        {mediaTargetInput && (
                          <button 
                            type="button" 
                            onClick={() => selectMediaForInput(url)}
                            className="px-1 py-0.5 bg-luxury-gold text-white font-mono text-[8px] uppercase tracking-wider rounded border-none cursor-pointer"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* DB registered media */}
                {media.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative h-24 bg-zinc-100 rounded border overflow-hidden hover:border-luxury-gold transition-all flex flex-col justify-between"
                  >
                    <img src={item.url} alt={item.name} className="h-full w-full object-cover select-none pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={async () => {
                          if (window.confirm("Delete this catalog asset securely?")) {
                            await deleteMedia(item.id);
                          }
                        }}
                        className="p-1 border-none text-rose-452 hover:text-rose-600 bg-transparent cursor-pointer font-bold shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      {mediaTargetInput && (
                        <button 
                          type="button" 
                          onClick={() => selectMediaForInput(item.url)}
                          className="px-2 py-0.5 bg-luxury-gold text-white font-mono text-[8px] uppercase tracking-widest rounded border-none cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom dialog trigger */}
            <div className="pt-2 border-t flex justify-end">
              <button 
                onClick={() => { setMediaLibraryOpen(false); setMediaTargetInput(null); }}
                className="px-5 py-2 border border-zinc-200 text-xxs font-mono uppercase bg-zinc-100 hover:bg-zinc-200 text-zinc-650 cursor-pointer rounded"
              >
                Close Asset manager
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
