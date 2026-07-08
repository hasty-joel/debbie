import React, { useState } from 'react';
import { 
  FolderPlus, Plus, Sparkles, Folder, Layers, Trash2
} from 'lucide-react';
import { Category, Collection } from '../../types';
import { MediaSelectorModal } from './MediaSelectorModal';

interface AdminCategoriesCollectionsTabProps {
  categories: Category[];
  collections: Collection[];
  createCategory: (cData: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  createCollection: (coData: Partial<Collection>) => Promise<boolean>;
  deleteCollection: (id: string) => Promise<boolean>;
}

export const AdminCategoriesCollectionsTab: React.FC<AdminCategoriesCollectionsTabProps> = ({
  categories,
  collections,
  createCategory,
  deleteCategory,
  createCollection,
  deleteCollection
}) => {
  // Collection fields
  const [colName, setColName] = useState('');
  const [colTheme, setColTheme] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colImg, setColImg] = useState('');
  const [colError, setColError] = useState('');
  const [colSuccess, setColSuccess] = useState('');

  // Category fields
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');
  const [catError, setCatError] = useState('');
  const [catSuccess, setCatSuccess] = useState('');

  // Picker target selection
  const [pickerTarget, setPickerTarget] = useState<'col' | 'cat' | null>(null);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setColError('');
    setColSuccess('');

    if (!colName) {
      setColError('Collection title is strictly required.');
      return;
    }

    const payload: Partial<Collection> = {
      name: colName,
      slug: colName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      lifestyle_theme: colTheme,
      description: colDesc,
      image: colImg || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800'
    };

    const ok = await createCollection(payload);
    if (ok) {
      setColSuccess(`Aligned style collection "${colName}" successfully!`);
      setColName('');
      setColTheme('');
      setColDesc('');
      setColImg('');
    } else {
      setColError('Failed to synchronize lifestyle collection with backend systems.');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');
    setCatSuccess('');

    if (!catName) {
      setCatError('Category label name is required.');
      return;
    }

    const payload: Partial<Category> = {
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catDesc,
      image: catImg || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'
    };

    const ok = await createCategory(payload);
    if (ok) {
      setCatSuccess(`Category classification "${catName}" registered successfully!`);
      setCatName('');
      setCatDesc('');
      setCatImg('');
    } else {
      setCatError('Failed to register category. Try reloading workspace.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" id="admin-categories-collections">
      
      {/* 1. LIFESTYLE COLLECTIONS FORUM */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Fashion Lofts</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Manage Style Collections</h3>
        </div>

        <form onSubmit={handleCreateCollection} className="space-y-4 text-xs font-sans text-zinc-550">
          {colError && <div className="p-2.5 bg-red-50 text-red-500 font-semibold rounded text-xxs italic">{colError}</div>}
          {colSuccess && <div className="p-2.5 bg-green-50 text-emerald-600 font-semibold rounded text-xxs italic">{colSuccess}</div>}

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Collection Name</span>
            <input type="text" value={colName} onChange={(e) => setColName(e.target.value)} placeholder="e.g. CEO Mode, Weekend Vibes" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold" />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Lifestyle Theme Keyword / Tagline</span>
            <input type="text" value={colTheme} onChange={(e) => setColTheme(e.target.value)} placeholder="e.g. Executive Cashmere & Silk Blending" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Backdrop Lookbook Image URL</span>
              <button 
                type="button" 
                onClick={() => setPickerTarget('col')}
                className="text-[9px] font-mono font-bold text-luxury-gold hover:underline border-none bg-transparent cursor-pointer"
              >
                Choose from Library
              </button>
            </div>
            <input type="text" value={colImg} onChange={(e) => setColImg(e.target.value)} placeholder="https://images.unsplash.com/photo-1..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold text-xxs font-mono" />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Lifestyle Collection Narrative</span>
            <textarea value={colDesc} onChange={(e) => setColDesc(e.target.value)} placeholder="Introduce styling guidelines and thematic notes..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold leading-relaxed" rows={3} />
          </div>

          <button type="submit" className="px-6 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors block border-none rounded">
            Align Style Collection
          </button>
        </form>

        {/* Existing Collections listing table */}
        <div className="space-y-3 pt-5 border-t border-zinc-100 dark:border-zinc-900">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono block">Aligned Lifestyles ({collections.length})</span>
          <div className="space-y-2">
            {collections.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 select-none overflow-hidden rounded bg-zinc-100 border border-zinc-200 shrink-0">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xxs uppercase text-zinc-800 dark:text-zinc-100 leading-none">{c.name}</h5>
                    <p className="text-[10px] text-zinc-450 italic mt-0.5">{c.lifestyle_theme || 'Sartorial Expression'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteCollection(c.id)}
                  className="p-1 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded transition-colors cursor-pointer border-none bg-transparent"
                  title="Remove collection"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CATEGORIES CLASSIFICATIONS */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Sartorial Classifications</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Manage Categories</h3>
        </div>

        <form onSubmit={handleCreateCategory} className="space-y-4 text-xs font-sans text-zinc-550">
          {catError && <div className="p-2.5 bg-red-50 text-red-500 font-semibold rounded text-xxs italic">{catError}</div>}
          {catSuccess && <div className="p-2.5 bg-green-50 text-emerald-600 font-semibold rounded text-xxs italic">{catSuccess}</div>}

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Category Label / Name</span>
            <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Bespoke Outerwear, Tailored Knits" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Cover Thumbnail Image URL</span>
              <button 
                type="button" 
                onClick={() => setPickerTarget('cat')}
                className="text-[9px] font-mono font-bold text-luxury-gold hover:underline border-none bg-transparent cursor-pointer"
              >
                Choose from Library
              </button>
            </div>
            <input type="text" value={catImg} onChange={(e) => setCatImg(e.target.value)} placeholder="https://images.unsplash.com/photo-2..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold text-xxs font-mono" />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Classification Specifications / Summary</span>
            <input type="text" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Brief technical / material coordinate outline..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold" />
          </div>

          <button type="submit" className="px-6 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors block border-none rounded">
            Commit Classification
          </button>
        </form>

        {/* Existing Categories classification listing */}
        <div className="space-y-3 pt-5 border-t border-zinc-100 dark:border-zinc-900">
          <span className="text-[10px] text-zinc-405 font-bold uppercase tracking-widest font-mono block">Registered Classifications ({categories.length})</span>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 select-none overflow-hidden rounded bg-zinc-100 border border-zinc-200 shrink-0">
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xxs uppercase text-zinc-800 dark:text-zinc-100 leading-none">{cat.name}</h5>
                    <p className="text-[10px] text-zinc-450 mt-0.5 max-w-xs truncate">{cat.description || 'General Catalog section'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded transition-colors cursor-pointer border-none bg-transparent"
                  title="Remove category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MediaSelectorModal 
        isOpen={!!pickerTarget} 
        onClose={() => setPickerTarget(null)} 
        onSelect={(url) => {
          if (pickerTarget === 'col') setColImg(url);
          else if (pickerTarget === 'cat') setCatImg(url);
        }} 
      />

    </div>
  );
};
