import React, { useState } from 'react';
import { 
  Sparkles, ToggleLeft, ToggleRight, Filter, Search, Plus, Pencil, Trash2, Tag, Check, Eye
} from 'lucide-react';
import { Product, Category, Collection } from '../../types';

interface AdminProductsTabProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  createProduct: (data: Partial<Product>) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  categories,
  collections,
  createProduct,
  updateProduct,
  deleteProduct
}) => {
  // Lists filters
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [colFilter, setColFilter] = useState('');

  // Editor states
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form Fields keys
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Debbie Atelier');
  const [price, setPrice] = useState(150000);
  const [origPrice, setOrigPrice] = useState(180000);
  const [imgUrl, setImgUrl] = useState('');
  const [secondaryImgs, setSecondaryImgs] = useState('');
  const [category, setCategory] = useState('');
  const [collection, setCollection] = useState('');
  const [material, setMaterial] = useState('100% Premium Cotton');
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['Black', 'White']);
  const [isTrending, setIsTrending] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Form errors
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenCreateForm = () => {
    setSelectedProduct(null);
    setTitle('');
    setBrand('Debbie Atelier');
    setPrice(150000);
    setOrigPrice(180000);
    setImgUrl('');
    setSecondaryImgs('');
    setCategory(categories[0]?.id || 'cat-1');
    setCollection(collections[0]?.id || 'col-1');
    setMaterial('100% Grained Cotton Throws');
    setStock(12);
    setDescription('Indulgent textures meticulously cut and structured at Debbie Kampala chambers.');
    setSizes(['S', 'M', 'L']);
    setColors(['Classic Black', 'Ivory Pearl']);
    setIsTrending(false);
    setIsNew(true);
    setEditorOpen(true);
  };

  const handleOpenEditForm = (p: Product) => {
    setSelectedProduct(p);
    setTitle(p.title);
    setBrand(p.brand);
    setPrice(p.price);
    setOrigPrice(p.original_price || p.price);
    setImgUrl(p.image_url);
    setSecondaryImgs(p.images?.join(', ') || '');
    setCategory(p.category_id);
    setCollection(p.collection_id);
    setMaterial(p.material);
    setStock(p.stock);
    setDescription(p.description);
    setSizes(p.sizes || ['S', 'M', 'L']);
    setColors(p.colors || ['Black', 'White']);
    setIsTrending(!!p.is_trending);
    setIsNew(!!p.is_new);
    setEditorOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !imgUrl) {
      setErrorMsg('Product name and preview image URL are strictly required.');
      return;
    }

    const secondaryList = secondaryImgs
      ? secondaryImgs.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload: Partial<Product> = {
      title,
      brand,
      price: Number(price),
      original_price: Number(origPrice),
      image_url: imgUrl,
      images: [imgUrl, ...secondaryList],
      category_id: category,
      collection_id: collection,
      material,
      stock: Number(stock),
      description,
      sizes,
      colors,
      is_trending: isTrending,
      is_new: isNew
    };

    let success = false;
    if (selectedProduct) {
      success = await updateProduct(selectedProduct.id, payload);
    } else {
      success = await createProduct(payload);
    }

    if (success) {
      setEditorOpen(false);
    } else {
      setErrorMsg('Failed to synchronize changes. Verify connections to the Express backend.');
    }
  };

  const handleDeleteProduct = async (pId: string) => {
    if (window.confirm('Are you absolutely certain you want to destroy this product outline from the catalog database?')) {
      await deleteProduct(pId);
    }
  };

  const toggleSizeSelection = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const toggleColorSelection = (color: string) => {
    if (colors.includes(color)) {
      setColors(colors.filter(c => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = catFilter ? p.category_id === catFilter : true;
    const matchesCol = colFilter ? p.collection_id === colFilter : true;
    return matchesSearch && matchesCat && matchesCol;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="admin-products-tab">
      
      {/* Search and control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-150 dark:border-zinc-850 rounded">
        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-90 w-52 text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold dark:text-white rounded"
            />
          </div>

          {/* Filters category */}
          <select 
            value={catFilter} 
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-90 text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 rounded"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Filters Collection */}
          <select 
            value={colFilter} 
            onChange={(e) => setColFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-90 text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 rounded"
          >
            <option value="">All Collections</option>
            {collections.map(co => <option key={co.id} value={co.id}>{co.name}</option>)}
          </select>
        </div>

        <button 
          onClick={handleOpenCreateForm}
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold transition-colors text-xxs font-bold tracking-widest font-mono uppercase rounded cursor-pointer border-none"
          id="btn-add-product"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Editor Drawer / Modal Overlay */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all overflow-y-auto">
          <div 
            className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            id="product-form-container"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">
                {selectedProduct ? 'Refine Product Coordinates' : 'Compose Product Blueprint'}
              </h3>
              <button 
                onClick={() => setEditorOpen(false)}
                className="text-zinc-500 hover:text-rose-500 transition-colors text-xxs font-bold font-mono uppercase bg-transparent border-none cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans text-zinc-550">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 font-semibold rounded text-xxs italic">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Product Name Name</span>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Draped Cashmere Blazer" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Atelier Designer / Brand</span>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Debbie Atelier" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Catalog price (UGX)</span>
                  <input type="number" required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded font-mono focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-500 uppercase tracking-wider block font-mono">Original reference Price (UGX)</span>
                  <input type="number" value={origPrice} onChange={(e) => setOrigPrice(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded font-mono focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-455 uppercase tracking-wider block font-mono">Inventory Stock units</span>
                  <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded font-mono focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-455 uppercase tracking-wider block font-mono">Primary Image thumbnail URL</span>
                <input type="text" required value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800" />
              </div>

              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-500 uppercase tracking-wider block font-mono">Secondary Images Gallery URLs (comma separated)</span>
                <input type="text" value={secondaryImgs} onChange={(e) => setSecondaryImgs(e.target.value)} placeholder="url1, url2, url3" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800 text-xxs font-mono" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Classification Category</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Lifestyle Collection</span>
                  <select value={collection} onChange={(e) => setCollection(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800">
                    {collections.map(co => <option key={co.id} value={co.id}>{co.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Material & Fabrics</span>
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Cashmere blend, wool" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sizes coordinate */}
                <div className="space-y-1.5">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider font-mono block">Aligned Sizes</span>
                  <div className="flex flex-wrap gap-2 text-xxs">
                    {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map((sz) => {
                      const isSelected = sizes.includes(sz);
                      return (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => toggleSizeSelection(sz)}
                          className={`px-3 py-1.5 border hover:border-luxury-gold uppercase font-mono tracking-wider cursor-pointer rounded-none transition-colors ${
                            isSelected 
                              ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white' 
                              : 'bg-zinc-50 dark:bg-zinc-90 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors coordinate */}
                <div className="space-y-1.5">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider font-mono block">Aligned Colors</span>
                  <div className="flex flex-wrap gap-1.5 text-xxxxs">
                    {['Classic Black', 'Ivory Pearl', 'Bone White', 'Charcoal Gray', 'Midnight Obsidian', 'Beige Silk', 'Flax Ecru', 'Marigold Wax', 'Champagne', 'Emerald Shimmer'].map((cl) => {
                      const isSelected = colors.includes(cl);
                      return (
                        <button
                          type="button"
                          key={cl}
                          onClick={() => toggleColorSelection(cl)}
                          className={`px-2 py-1.5 border hover:border-luxury-gold uppercase tracking-wider cursor-pointer rounded-none transition-colors ${
                            isSelected 
                              ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white font-semibold' 
                              : 'bg-zinc-50 dark:bg-zinc-90 border-zinc-200 dark:border-zinc-800 text-zinc-705 dark:text-zinc-350'
                          }`}
                        >
                          {cl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Product Narrative Narrative / Description</span>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Narrative describing silhouette, weave details..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2 rounded focus:outline-none focus:border-luxury-gold dark:text-white border-zinc-200 dark:border-zinc-800 text-xs leading-relaxed" />
              </div>

              <div className="flex flex-wrap gap-6 font-mono text-xxxxx select-none py-1 text-zinc-400">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="h-4 w-4 border-zinc-800 rounded accent-luxury-gold" />
                  <span className="text-xxs uppercase tracking-wider font-bold">Flag as trending style</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-4 w-4 border-zinc-800 rounded accent-luxury-gold" />
                  <span className="text-xxs uppercase tracking-wider font-bold">Flag as new arrival</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 text-xxs font-mono">
                <button 
                  type="button" 
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-850 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-90 text-zinc-500 uppercase tracking-widest cursor-pointer rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-luxury-gold text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-luxury-gold dark:hover:text-white uppercase tracking-widest font-bold cursor-pointer transition-colors border-none rounded"
                >
                  Save Product Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table list */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xxs text-zinc-550">
            <thead>
              <tr className="border-b border-zinc-150 dark:border-zinc-850 text-zinc-400 uppercase tracking-wider font-mono font-bold">
                <th className="py-3">Silhouette</th>
                <th className="py-3">Brand & Details</th>
                <th className="py-3">Stock Units</th>
                <th className="py-3">Atelier Price</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150/40 dark:divide-zinc-900 text-sans">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-405 italic text-xs">No garments matching query coordinates.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const cat = categories.find(c => c.id === p.category_id)?.name || 'Unassigned';
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/5 pointer transition-colors">
                      <td className="py-3.5 flex items-center space-x-3">
                        <div className="h-14 w-10 shrink-0 select-none overflow-hidden rounded bg-zinc-100 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850">
                          <img src={p.image_url} alt={p.title} referrerPolicy="no-referrer" className="h-[100%] w-[100%] object-cover object-top" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-semibold uppercase text-zinc-900 dark:text-zinc-100 text-xxs leading-snug">{p.title}</h4>
                          <span className="text-[10px] bg-zinc-100 dark:bg-zinc-90 px-2 py-0.5 rounded text-zinc-500 uppercase font-mono tracking-wider">{cat}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-500">
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">{p.brand}</p>
                        <p className="text-[10px] italic max-w-xs truncate">{p.material}</p>
                      </td>
                      <td className="py-3.5 font-mono">
                        <span className={p.stock <= 5 ? 'text-rose-500 font-bold' : ''}>{p.stock} units</span>
                      </td>
                      <td className="py-3.5 font-mono">
                        <div className="space-y-0.5">
                          <p className="font-bold text-luxury-gold">UGX {p.price.toLocaleString()}</p>
                          {p.original_price && p.original_price > p.price && (
                            <p className="line-through text-zinc-450 text-[10px]">UGX {p.original_price.toLocaleString()}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 text-right space-x-1.5 font-mono">
                        {p.is_trending && <span className="inline-block text-[9px] font-bold text-amber-500 border border-amber-500/20 bg-amber-500/5 px-1.5 py-0.5 uppercase mb-1">Trending</span>}
                        {p.is_new && <span className="inline-block text-[9px] font-bold text-indigo-500 border border-indigo-500/20 bg-indigo-500/5 px-1.5 py-0.5 uppercase mb-1">New</span>}
                        <div className="flex items-center justify-end space-x-2 pt-1 z-10">
                          <button 
                            onClick={() => handleOpenEditForm(p)}
                            className="p-1.5 text-zinc-500 hover:text-luxury-gold transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-90 rounded bg-transparent border-none cursor-pointer"
                            title="Fine-tune design specs"
                          >
                            <Pencil className="h-4 w-4 shrink-0" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-500 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-90 rounded bg-transparent border-none cursor-pointer"
                            title="Purge style outline"
                          >
                            <Trash2 className="h-4 w-4 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
