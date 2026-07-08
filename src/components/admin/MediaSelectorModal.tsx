import React, { useState } from 'react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { X, Search, Upload, Check, Image as ImageIcon } from 'lucide-react';

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const MediaSelectorModal: React.FC<MediaSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = "Select Asset from Media Library"
}) => {
  const { media, createMedia } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  if (!isOpen) return null;

  // Search filter
  const filteredMedia = media.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Read file and convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      if (!base64Url) {
        setUploadError('Failed to read file.');
        setUploading(false);
        return;
      }

      const success = await createMedia(file.name.split('.')[0] || "Uploaded Photo", base64Url);
      if (success) {
        setUploadSuccess('Asset uploaded and registered in library!');
      } else {
        setUploadError('Failed to register uploaded asset.');
      }
      setUploading(false);
    };

    reader.onerror = () => {
      setUploadError('Error reading file.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-2xl flex flex-col max-h-[85vh] text-zinc-850 dark:text-zinc-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Debbie Media Curator</span>
            <h3 className="text-sm font-bold uppercase tracking-widest font-display text-zinc-900 dark:text-white">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-zinc-650 dark:hover:text-white cursor-pointer border-none bg-transparent"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload + Search Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Quick upload */}
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded p-3 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-center">
            <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-400 mb-1.5 block">Quick upload new photo</span>
            <div className="flex items-center space-x-3">
              <label className="px-3 py-1.5 bg-zinc-900 hover:bg-luxury-gold text-white text-xxs font-mono uppercase tracking-widest font-bold rounded cursor-pointer transition-colors flex items-center space-x-1.5">
                <Upload className="h-3 w-3" />
                <span>{uploading ? 'Processing...' : 'Browse Local Image'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
              <span className="text-[10px] text-zinc-400 font-sans truncate">
                {uploading ? 'Reading asset bytes...' : 'Any JPG, PNG, WEBP'}
              </span>
            </div>
            {uploadError && <p className="text-[10px] text-rose-500 mt-1 italic font-semibold">{uploadError}</p>}
            {uploadSuccess && <p className="text-[10px] text-emerald-500 mt-1 italic font-semibold">{uploadSuccess}</p>}
          </div>

          {/* Search */}
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded px-3 bg-zinc-50 dark:bg-zinc-900">
            <Search className="h-4 w-4 text-zinc-400 shrink-0 mr-2" />
            <input 
              type="text" 
              placeholder="Search library assets by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent p-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-[300px] border border-zinc-150 dark:border-zinc-900 rounded p-2">
          {filteredMedia.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-zinc-400 space-y-2">
              <ImageIcon className="h-8 w-8 opacity-40 text-luxury-gold" />
              <p className="italic text-xs">No media assets found in catalog matching search criteria.</p>
              <p className="text-xxs">Try uploading an image or clearing the search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded overflow-hidden cursor-pointer hover:border-luxury-gold transition-colors flex flex-col"
                >
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-zinc-900 font-mono font-bold text-xxxxs uppercase tracking-wider py-1 px-1.5 rounded flex items-center space-x-1 shadow">
                        <Check className="h-2.5 w-2.5 text-emerald-500" />
                        <span>Select</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-1.5 border-t border-zinc-150 dark:border-zinc-800">
                    <p className="text-[9px] uppercase font-bold truncate leading-none text-zinc-800 dark:text-zinc-200 mb-0.5">{item.name}</p>
                    <p className="text-[8px] text-zinc-400 font-mono">{item.date || '2026-06-01'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded font-mono text-xxs uppercase tracking-widest cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
