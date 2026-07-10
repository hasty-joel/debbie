import React, { useState } from 'react';
import { 
  Sparkles, Camera, Plus, Trash2, Pencil 
} from 'lucide-react';
import { Post, Collection } from '../../types';
import { MediaSelectorModal } from './MediaSelectorModal';

interface AdminInspirationTabProps {
  posts: Post[];
  collections: Collection[];
  createPost: (data: Partial<Post>) => Promise<boolean>;
  updatePost: (id: string, data: Partial<Post>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
}

export const AdminInspirationTab: React.FC<AdminInspirationTabProps> = ({
  posts,
  collections,
  createPost,
  updatePost,
  deletePost
}) => {
  // Creator form triggers
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Form Fields keys
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [associatedCollection, setAssociatedCollection] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);

  const handleOpenCreateForm = () => {
    setSelectedPost(null);
    setTitle('');
    setImage('');
    setAssociatedCollection(collections[0]?.id || 'col-1');
    setTagsInput('#Bespoke, #CampusDrip, #SilkLoungers');
    setIsPublished(true);
    setEditorOpen(true);
  };

  const handleOpenEditForm = (p: Post) => {
    setSelectedPost(p);
    setTitle(p.title);
    setImage(p.images?.[0] || '');
    setAssociatedCollection(p.collection_id || 'col-1');
    setTagsInput(p.tags?.join(', ') || '');
    setIsPublished(p.status === 'published');
    setEditorOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSuccess('');

    if (!title || !image) {
      setErr('Inspiration post header title and visual cover image URL are required.');
      return;
    }

    const tagsList = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];

    const payload: Partial<Post> = {
      title,
      caption: title,
      images: [image],
      collection_id: associatedCollection,
      tags: tagsList,
      status: isPublished ? 'published' : 'draft',
      is_featured: false,
      created_at: selectedPost?.created_at || new Date().toISOString()
    };

    let done = false;
    if (selectedPost) {
      done = await updatePost(selectedPost.id, payload);
    } else {
      done = await createPost(payload);
    }

    if (done) {
      setSuccess('Lookbook inspiration post coordinates secured!');
      setEditorOpen(false);
    } else {
      setErr('Failed to register lookbook coordinates with backend services.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you certain you want to retract this visual lookbook post from public streams?')) {
      await deletePost(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="admin-inspiration-tab">
      
      {/* Search and control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-150 dark:border-zinc-850 rounded">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-90 w-full text-zinc-900 dark:text-white font-display">Inspiration Lookbook Vault</h3>
          <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">Align new lifestyle posts, style inspirations & couture trends</span>
        </div>

        <button 
          onClick={handleOpenCreateForm}
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-zinc-950 text-white hover:bg-luxury-gold transition-colors text-xxs font-bold tracking-widest font-mono uppercase rounded cursor-pointer border-none"
          id="btn-add-post"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add Lookbook Post</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-600 font-semibold rounded text-xxs italic flex items-center gap-1.5 animate-bounce">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Editor dialog overlay */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded p-6 shadow-2xl relative space-y-6"
            id="lookbook-form-container"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white font-display">
                {selectedPost ? 'Edit Lookbook Post' : 'Align Lookbook Post'}
              </h3>
              <button 
                onClick={() => setEditorOpen(false)}
                className="text-zinc-500 hover:text-rose-505 transition-colors text-xxs font-mono uppercase bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs font-sans text-zinc-550 leading-relaxed">
              {err && <div className="p-2.5 bg-red-50 text-red-555 font-semibold rounded text-xxs italic">{err}</div>}

              <div className="space-y-1">
                <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Post Title Header</span>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Acacia Sunset Couture Silk Set" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Image Backdrop URL</span>
                  <button 
                    type="button" 
                    onClick={() => setMediaSelectorOpen(true)}
                    className="text-[9px] font-mono font-bold text-luxury-gold hover:underline border-none bg-transparent cursor-pointer"
                  >
                    Choose from Library
                  </button>
                </div>
                <input 
                  type="text" 
                  required 
                  readOnly 
                  value={image} 
                  onClick={() => setMediaSelectorOpen(true)}
                  placeholder="Click 'Choose from Library' to select..." 
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold text-xxs font-mono cursor-pointer" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-405 uppercase tracking-wider block font-mono">Associated Collection</span>
                  <select value={associatedCollection} onChange={(e) => setAssociatedCollection(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold">
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-xxs font-bold text-zinc-465 uppercase tracking-wider block font-mono">Couture Tags (comma separated)</span>
                  <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="#Bespoke, #FallLook, #PureSilk" className="w-full bg-zinc-50 dark:bg-zinc-90 border p-2.5 focus:outline-none dark:text-white border-zinc-200 dark:border-zinc-800 focus:border-luxury-gold text-xxs font-mono" />
                </div>
              </div>

              {/* Status toggle */}
              <div className="py-2">
                <label className="flex items-center space-x-2.5 cursor-pointer font-mono text-[10px] uppercase font-bold text-zinc-450 select-none">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded accent-luxury-gold" />
                  <span>Set Post Status to published stream</span>
                </label>
              </div>

              {image && (
                <div className="space-y-1 pt-2">
                  <span className="text-xxxxs uppercase font-mono text-zinc-400 block font-bold">Post backdrop preview</span>
                  <div className="h-32 w-fit select-none overflow-hidden rounded border bg-zinc-150">
                    <img src={image} alt="Lookbook backdrop" className="h-full object-cover rounded" />
                  </div>
                </div>
              )}

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
                  Commit Post Coordinates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lookbooks list grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <p className="py-12 text-center text-xxs text-zinc-400 italic col-span-3">No fashion lookbook inspiration items registered currently.</p>
        ) : (
          posts.map((post) => {
            const isPub = post.status === 'published';
            const colName = collections.find(c => c.id === post.collection_id)?.name || 'Studio lookbook';
            return (
              <div 
                key={post.id} 
                className="group bg-white dark:bg-zinc-950 rounded border border-zinc-150 dark:border-zinc-850 overflow-hidden hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                {/* Cover cover layer */}
                <div className="h-44 bg-zinc-100 select-none overflow-hidden relative border-b border-zinc-100 dark:border-zinc-900 z-10 w-full">
                  <img src={post.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800'} alt={post.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 duration-700 transition-transform" />
                  
                  {/* Publication badge */}
                  <span className={`absolute top-3 left-3 text-xxxxs font-bold uppercase px-2.5 py-0.5 rounded-full border shadow-sm ${
                    isPub 
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold backdrop-blur-xs' 
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-300'
                  }`}>
                    {isPub ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Card narration details */}
                <div className="p-4 space-y-3 z-10 bg-white dark:bg-zinc-950 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block font-bold">{colName}</span>
                    <h4 className="font-semibold uppercase text-zinc-900 dark:text-zinc-100 font-display hover:text-luxury-gold transition-colors text-xxs tracking-wide leading-snug">{post.title}</h4>
                    
                    {/* Tags list */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags && post.tags.map((tg, idx) => (
                        <span key={idx} className="text-xxxxs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-90 px-1.5 py-0.5 rounded border border-zinc-150 dark:border-zinc-850 uppercase">{tg}</span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom interactive action triggers */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-150/45 dark:divide-zinc-900 text-xxs font-mono">
                    <p className="text-[10px] text-zinc-450 uppercase font-bold text-xxxxs font-mono">DATE: {new Date(post.created_at).toLocaleDateString()}</p>
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleOpenEditForm(post)}
                        className="p-1 text-zinc-500 hover:text-luxury-gold transition-colors bg-transparent border-none cursor-pointer"
                        title="Adjust inspiration settings"
                      >
                        <Pencil className="h-3.5 w-3.5 shrink-0" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-zinc-505 hover:text-rose-500 transition-colors bg-transparent border-none cursor-pointer"
                        title="Retract post blueprint"
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      <MediaSelectorModal 
        isOpen={mediaSelectorOpen} 
        onClose={() => setMediaSelectorOpen(false)} 
        onSelect={(url) => setImage(url)} 
      />

    </div>
  );
};
