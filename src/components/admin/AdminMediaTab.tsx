import React, { useState } from 'react';
import { 
  Image, Plus, Trash2, Copy, Check, Upload, Link, Search, FileImage
} from 'lucide-react';
import { MediaItem } from '../../types';

interface AdminMediaTabProps {
  media: MediaItem[];
  createMedia: (name: string, url: string) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  media,
  createMedia,
  deleteMedia
}) => {
  const [copiedId, setCopiedId] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleCopyLink = (mId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(mId);
    setTimeout(() => setCopiedId(''), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!uploadUrl) {
      setError('A secure HTTPS asset image URL is required.');
      return;
    }

    const titleName = uploadName || `Asset_${Date.now().toString().slice(-4)}`;
    const ok = await createMedia(titleName, uploadUrl);
    if (ok) {
      setSuccess('Asset registered inside core Media Library vault!');
      setUploadName('');
      setUploadUrl('');
    } else {
      setError('Synchronization fail: Unable to list asset.');
    }
  };

  // Drag and drop mock interactions
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDropMock = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate drop loading and generate an Unsplash high-fashion image
    setUploadName('Dropped High-Fashion Artwork');
    const placeholders = [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800'
    ];
    const picked = placeholders[Math.floor(Math.random() * placeholders.length)];
    setUploadUrl(picked);
    setSuccess('Image file read successfully, click save block to secure.');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" id="admin-media-tab">
      
      {/* 1. MOCK DRAG & DROP AND DIRECT IMPORT PANEL */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-6 height-fit">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Asset uploads</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Ingest New Media</h3>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-sans text-zinc-550">
          {error && <div className="p-2.5 bg-red-50 text-red-500 font-semibold rounded text-xxs italic">{error}</div>}
          {success && <div className="p-2.5 bg-green-50 text-emerald-600 font-semibold rounded text-xxs italic">{success}</div>}

          {/* Drag Mock Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropMock}
            className={`h-36 rounded border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer select-none transition-colors ${
              isDragging 
                ? 'border-luxury-gold bg-zinc-50 dark:bg-zinc-900' 
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-905/25 hover:border-zinc-350'
            }`}
          >
            <Upload className="h-6 w-6 text-zinc-400 mb-2 animate-bounce" />
            <p className="text-xxs font-semibold">Drag & Drop Image File</p>
            <p className="text-[10px] text-zinc-400 mt-1 leading-snug">Simulates instant file reading & analysis</p>
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Asset Label / Custom Name</span>
            <input type="text" value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="e.g. Kololo Sunset Trench Backdrop" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800" />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Asset absolute Link (HTTPS Url)</span>
            <input type="text" required value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 text-xxs font-mono" />
          </div>

          {uploadUrl && (
            <div className="space-y-1 pt-2">
              <span className="text-xxxxs uppercase font-mono text-zinc-400 block font-bold">Image preview</span>
              <div className="h-28 w-fit select-none overflow-hidden rounded border bg-zinc-150">
                <img src={uploadUrl} alt="Drop Preview" className="h-full object-cover rounded" />
              </div>
            </div>
          )}

          <button type="submit" className="px-6 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors block border-none rounded">
            Secure asset Image
          </button>
        </form>
      </div>

      {/* 2. MEDIA CARDS LIBRARY WRAPPERS */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 md:col-span-2 space-y-4">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Library files</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Media Library Center</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-80 w-full pr-1">
          {media.length === 0 ? (
            <div className="col-span-3 text-center py-20 italic text-zinc-400">No media assets cataloged. Drag files to ingest.</div>
          ) : (
            media.map((file) => {
              const isCopied = copiedId === file.id;
              return (
                <div 
                  key={file.id} 
                  className="group bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded overflow-hidden flex flex-col justify-between hover:shadow transition-shadow relative"
                >
                  {/* Photo cover preview */}
                  <div className="h-32 select-none overflow-hidden bg-zinc-100 flex items-center justify-center relative">
                    <img src={file.url} alt={file.name} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Hover actions buttons overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2.5">
                      <button 
                        onClick={() => handleCopyLink(file.id, file.url)}
                        className="bg-white hover:bg-luxury-gold text-zinc-900 hover:text-white p-2 rounded transition-colors cursor-pointer border-none"
                        title="Copy secure link Url"
                      >
                        {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => deleteMedia(file.id)}
                        className="bg-white hover:bg-rose-500 text-zinc-900 hover:text-white p-2 rounded transition-colors cursor-pointer border-none"
                        title="Permanently remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details section */}
                  <div className="p-3 space-y-1">
                    <h5 className="font-semibold text-[10px] uppercase text-zinc-850 dark:text-zinc-150 truncate leading-none">{file.name}</h5>
                    <p className="text-[9px] font-mono text-zinc-400">DATE: {file.date || '2026-06-01'}</p>
                    <div className="pt-1.5">
                      <button 
                        onClick={() => handleCopyLink(file.id, file.url)}
                        className="text-[9px] font-mono tracking-wider font-bold text-luxury-gold flex items-center space-x-1 hover:text-zinc-950 dark:hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                      >
                        {isCopied ? (
                          <span className="text-emerald-500 font-bold">✓ Copied link!</span>
                        ) : (
                          <>
                            <Link className="h-3 w-3 shrink-0" />
                            <span>Copy link URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
