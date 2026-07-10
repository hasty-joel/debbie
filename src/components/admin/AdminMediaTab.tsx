import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Copy, Check, Upload, Link, Search, Edit2, Save, X, Image as ImageIcon
} from 'lucide-react';
import { MediaItem } from '../../types';

interface AdminMediaTabProps {
  media: MediaItem[];
  createMedia: (name: string, url: string) => Promise<boolean>;
  updateMedia: (id: string, name: string) => Promise<boolean>;
  deleteMedia: (id: string) => Promise<boolean>;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  media,
  createMedia,
  updateMedia,
  deleteMedia
}) => {
  const [copiedId, setCopiedId] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState('');
  const [editNameValue, setEditNameValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setError('A secure HTTPS asset image URL or uploaded file is required.');
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

  // Drag and drop interaction
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP, etc.) are allowed.');
      return;
    }

    setUploadingFile(true);
    setSuccess('');
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setUploadUrl(base64Url);
        setUploadName(file.name.split('.')[0] || 'Uploaded Image');
        setSuccess('Image file read successfully. Click "Secure Asset Image" to save to the vault.');
      } else {
        setError('Failed to process image file bytes.');
      }
      setUploadingFile(false);
    };

    reader.onerror = () => {
      setError('An error occurred while reading the file.');
      setUploadingFile(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Rename handling
  const startEditing = (item: MediaItem) => {
    setEditingId(item.id);
    setEditNameValue(item.name);
  };

  const cancelEditing = () => {
    setEditingId('');
    setEditNameValue('');
  };

  const saveRename = async (id: string) => {
    if (!editNameValue.trim()) return;
    const ok = await updateMedia(id, editNameValue.trim());
    if (ok) {
      setEditingId('');
      setEditNameValue('');
    }
  };

  // Filter media items based on search term
  const filteredMedia = media.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="admin-media-tab">
      
      {/* 1. UPLOAD AND INGEST PANEL */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 space-y-6 height-fit">
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Asset uploads</span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Ingest New Media</h3>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-sans text-zinc-550">
          {error && <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 font-semibold rounded text-xxs italic">{error}</div>}
          {success && <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-emerald-600 font-semibold rounded text-xxs italic">{success}</div>}

          {/* Drag & Browse Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileBrowseClick}
            className={`h-36 rounded border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer select-none transition-all ${
              isDragging 
                ? 'border-luxury-gold bg-zinc-50 dark:bg-zinc-900' 
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-905/25 hover:border-luxury-gold'
            }`}
          >
            <Upload className={`h-6 w-6 text-zinc-400 mb-2 ${uploadingFile ? 'animate-spin' : 'animate-bounce'}`} />
            <p className="text-xxs font-semibold text-zinc-850 dark:text-zinc-200">
              {uploadingFile ? 'Uploading asset file...' : 'Drag & Drop or Click to Browse'}
            </p>
            <p className="text-[10px] text-zinc-400 mt-1 leading-snug">Converts local photos to permanent catalog links</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileInputChange} 
            />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Asset Label / Custom Name</span>
            <input 
              type="text" 
              value={uploadName} 
              onChange={(e) => setUploadName(e.target.value)} 
              placeholder="e.g. Kololo Sunset Trench Backdrop" 
              className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800" 
            />
          </div>

          <div className="space-y-1">
            <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Device Image Status</span>
            {uploadUrl ? (
              <div className="p-3 bg-green-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded flex justify-between items-center">
                <span className="text-xxs font-semibold text-emerald-600 dark:text-emerald-500 font-mono">✓ Loaded from device gallery</span>
                <button 
                  type="button" 
                  onClick={() => { setUploadUrl(''); setUploadName(''); }} 
                  className="text-[10px] font-mono text-rose-500 hover:underline border-none bg-transparent cursor-pointer font-bold"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 rounded text-center text-xxs text-zinc-400 italic">
                No local image file staged yet. Please drop an image or use "Click to Browse" above.
              </div>
            )}
          </div>

          {uploadUrl && (
            <div className="space-y-1 pt-2">
              <span className="text-xxxxs uppercase font-mono text-zinc-400 block font-bold">Image preview</span>
              <div className="h-28 w-fit select-none overflow-hidden rounded border bg-zinc-150">
                <img src={uploadUrl} alt="Drop Preview" className="h-full object-cover rounded" referrerPolicy="no-referrer" />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="px-6 py-2.5 w-full bg-zinc-950 text-white hover:bg-luxury-gold uppercase font-bold tracking-widest text-xxs font-mono cursor-pointer transition-colors block border-none rounded"
          >
            Secure asset Image
          </button>
        </form>
      </div>

      {/* 2. MEDIA CARDS LIBRARY AND SEARCH */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded border border-zinc-150 dark:border-zinc-850 lg:col-span-2 space-y-4">
        
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3 gap-3">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block">Library files</span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">Media Library Center</h3>
          </div>
          
          {/* Quick Search */}
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded px-2.5 py-1 max-w-xs w-full">
            <Search className="h-3.5 w-3.5 text-zinc-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xxs focus:outline-none w-full text-zinc-900 dark:text-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-white ml-1 border-none bg-transparent cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-80 w-full pr-1">
          {filteredMedia.length === 0 ? (
            <div className="col-span-3 text-center py-24 flex flex-col items-center justify-center text-zinc-400">
              <ImageIcon className="h-8 w-8 opacity-30 text-luxury-gold mb-2" />
              <p className="italic text-xs">No media assets cataloged.</p>
              <p className="text-[10px] mt-1 text-zinc-500">Drag files here, click browse, or adjust filters to list assets.</p>
            </div>
          ) : (
            filteredMedia.map((file) => {
              const isCopied = copiedId === file.id;
              const isEditing = editingId === file.id;

              return (
                <div 
                  key={file.id} 
                  className="group bg-zinc-50 dark:bg-zinc-90 border border-zinc-150 dark:border-zinc-850 rounded overflow-hidden flex flex-col justify-between hover:shadow transition-shadow relative"
                >
                  {/* Photo cover preview */}
                  <div className="h-32 select-none overflow-hidden bg-zinc-100 flex items-center justify-center relative">
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      referrerPolicy="no-referrer" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    
                    {/* Hover actions buttons overlay */}
                    {!isEditing && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2.5">
                        <button 
                          onClick={() => handleCopyLink(file.id, file.url)}
                          className="bg-white hover:bg-luxury-gold text-zinc-900 hover:text-white p-2 rounded transition-colors cursor-pointer border-none shadow-sm"
                          title="Copy asset URL link"
                        >
                          {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => startEditing(file)}
                          className="bg-white hover:bg-luxury-gold text-zinc-900 hover:text-white p-2 rounded transition-colors cursor-pointer border-none shadow-sm"
                          title="Rename media asset"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteMedia(file.id)}
                          className="bg-white hover:bg-rose-500 text-zinc-900 hover:text-white p-2 rounded transition-colors cursor-pointer border-none shadow-sm"
                          title="Permanently remove file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details section */}
                  <div className="p-3 space-y-1">
                    {isEditing ? (
                      <div className="space-y-1.5 pt-1">
                        <input 
                          type="text" 
                          value={editNameValue} 
                          onChange={(e) => setEditNameValue(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-luxury-gold text-xxs p-1.5 focus:outline-none text-zinc-900 dark:text-white rounded"
                          placeholder="Rename asset name"
                          autoFocus
                        />
                        <div className="flex space-x-1.5 justify-end">
                          <button 
                            onClick={cancelEditing}
                            className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-1 text-xxxxs uppercase tracking-wider rounded font-mono font-bold cursor-pointer border-none"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => saveRename(file.id)}
                            className="bg-luxury-gold text-white px-2 py-1 text-xxxxs uppercase tracking-wider rounded font-mono font-bold cursor-pointer border-none"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h5 className="font-semibold text-[10px] uppercase text-zinc-850 dark:text-zinc-150 truncate leading-none">{file.name}</h5>
                        <p className="text-[9px] font-mono text-zinc-400">DATE: {file.date || '2026-06-01'}</p>
                        <div className="pt-1.5 flex justify-between items-center">
                          <button 
                            onClick={() => handleCopyLink(file.id, file.url)}
                            className="text-[9px] font-mono tracking-wider font-bold text-luxury-gold flex items-center space-x-1 hover:text-zinc-950 dark:hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                          >
                            {isCopied ? (
                              <span className="text-emerald-500 font-bold">✓ Copied link!</span>
                            ) : (
                              <>
                                <Link className="h-3 w-3 shrink-0" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => startEditing(file)}
                            className="text-[9px] font-mono tracking-wider font-bold text-zinc-400 hover:text-luxury-gold flex items-center space-x-0.5 bg-transparent border-none cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            title="Quick rename"
                          >
                            <Edit2 className="h-2.5 w-2.5" />
                            <span>Rename</span>
                          </button>
                        </div>
                      </>
                    )}
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
