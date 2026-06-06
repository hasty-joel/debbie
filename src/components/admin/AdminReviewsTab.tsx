import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, Trash2, ShieldCheck, Sparkles, Filter, Eye
} from 'lucide-react';
import { Review, Product } from '../../types';

interface AdminReviewsTabProps {
  products: Product[];
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  products
}) => {
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const loadAllReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data);
      } else {
        // Fallback reviews compilation if server runs without centralized reviews
        const mockReviews = [
          { id: 'rev-1', product_id: 'prod-7', reviewer_name: 'Brenda K.', rating: 5, comment: 'Absolutely breathtaking. The silk feels heavy and luxurious. Perfect date night dress!', created_at: '2026-06-03T13:33:38.346Z' },
          { id: 'rev-2', product_id: 'prod-3', reviewer_name: 'Musa O.', rating: 5, comment: 'Best cargo pants I have owned. The cotton ripstop holds its form perfect in Kampala.', created_at: '2026-06-01T13:33:38.346Z' },
          { id: 'rev-3', product_id: 'prod-5', reviewer_name: 'Patricia L.', rating: 4, comment: 'Beautiful double-breasted shape, very high quality finish. It fits great although it is slightly longer than expected.', created_at: '2026-05-27T13:33:38.346Z' }
        ];
        setReviewsList(mockReviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Do you want to flag and redact this review testimonial from the public pages?')) {
      try {
        const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setSuccessMsg('Review flagged and permanently deleted.');
          loadAllReviews();
        } else {
          // Client state removal fallback
          setReviewsList(reviewsList.filter(r => r.id !== id));
          setSuccessMsg('Review testimonial cleared from dynamic workspace view.');
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredReviews = reviewsList.filter(r => {
    const rInt = Number(r.rating);
    const filterInt = Number(ratingFilter);
    return ratingFilter ? rInt === filterInt : true;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="admin-reviews-tab">
      
      {/* Control filters bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-150 dark:border-zinc-850 rounded">
        <div className="flex items-center space-x-3 text-xs">
          <Filter className="h-4 w-4 text-zinc-500 shrink-0 pointer-events-none" />
          <select 
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-50 dark:bg-zinc-90 text-xxs font-mono focus:outline-none border border-zinc-200 dark:border-zinc-800 rounded"
          >
            <option value="">All Star Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars &bull; Good rating</option>
            <option value="3">3 Stars &bull; Medium rating</option>
            <option value="2">2 Stars and lower</option>
          </select>
        </div>

        <span className="text-[10px] text-zinc-400 font-mono">
          Moderating {filteredReviews.length} client statements
        </span>
      </div>

      {successMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 font-semibold rounded text-xxs italic font-sans flex items-center gap-1.5 animate-pulse">
          <ShieldCheck className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reviews items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white dark:bg-zinc-950 p-12 text-center rounded border border-zinc-150 dark:border-zinc-850 col-span-2">
            <MessageSquare className="h-8 w-8 text-zinc-400 mx-auto opacity-40 mb-3" />
            <p className="text-xxs text-zinc-450 italic">No testimonials available inside specified filtering parameters.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const prod = products.find(p => p.id === rev.product_id);
            return (
              <div 
                key={rev.id} 
                className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded p-5 space-y-4 hover:border-luxury-gold/30 transition-colors"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-zinc-800 dark:text-zinc-100 text-xxs font-mono uppercase">{rev.reviewer_name}</p>
                    <p className="text-xxxxs text-zinc-400 font-mono tracking-wider">RECEIVED: {new Date(rev.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < rev.rating ? 'fill-luxury-gold text-luxury-gold' : 'text-zinc-300 dark:text-zinc-800'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Comment body */}
                <p className="text-xxs font-sans text-zinc-650 leading-relaxed font-medium italic dark:text-zinc-350">
                  "{rev.comment}"
                </p>

                {/* Associated product pointer and actions */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-150/40 dark:border-zinc-900 text-xxxxs">
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-400 uppercase tracking-wider font-mono">Apparel:</span>
                    <span className="font-semibold uppercase text-zinc-600 dark:text-zinc-300 underline hover:text-luxury-gold truncate max-w-xs">{prod ? prod.title : 'Debbie design piece'}</span>
                  </div>

                  <button 
                    onClick={() => handleDeleteReview(rev.id)}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-90 text-zinc-450 hover:bg-rose-950 hover:text-rose-200 border border-zinc-200 dark:border-zinc-800 rounded font-mono uppercase font-bold cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3 w-3 shrink-0" />
                    <span>Redact review</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
