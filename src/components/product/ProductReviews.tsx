import { useState, useEffect } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Review {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReviews(data || []);
      
      // Check if current user has a review
      if (user) {
        const existingReview = data?.find(r => r.user_id === user.id);
        if (existingReview) {
          setUserReview(existingReview);
          setRating(existingReview.rating);
          setComment(existingReview.comment || '');
          setImages(existingReview.images || []);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: t('error'),
          description: t('maxImageSize'),
          variant: 'destructive',
        });
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${productId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('reviews')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('reviews')
        .getPublicUrl(fileName);

      newImages.push(publicUrl);
    }

    setImages([...images, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);
    const isNewReview = !userReview;
    
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment: comment || null,
            images,
          })
          .eq('id', userReview.id);

        if (error) throw error;

        toast({
          title: t('success'),
          description: t('reviewUpdated'),
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            comment: comment || null,
            images,
          });

        if (error) throw error;

        // Award loyalty points for new review
        const reviewPoints = 10; // 10 points per review
        
        // Add loyalty transaction
        await supabase.from('loyalty_transactions').insert({
          user_id: user.id,
          points: reviewPoints,
          type: 'earn',
          description: `Review reward for product #${productId}`,
        });

        // Update user's loyalty points
        const { data: profile } = await supabase
          .from('profiles')
          .select('loyalty_points')
          .eq('id', user.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ loyalty_points: (profile.loyalty_points || 0) + reviewPoints })
            .eq('id', user.id);
        }

        toast({
          title: t('success'),
          description: language === 'ar' 
            ? `تم إرسال تقييمك! +${reviewPoints} نقطة` 
            : `Review submitted! +${reviewPoints} points earned`,
        });
      }

      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: t('error'),
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (count: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= (interactive ? (hoverRating || rating) : count)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('basedOnReviews')} {reviews.length} {t('reviewsCount')}
          </div>
        </div>
      )}

      {/* Write Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>{userReview ? t('yourReview') : t('writeReview')}</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('yourRating')}</label>
                {renderStars(rating, true, 'w-8 h-8')}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">{t('reviewComment')}</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={language === 'ar' ? 'شاركنا رأيك في المنتج...' : 'Share your thoughts about this product...'}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t('uploadImages')}</label>
                <p className="text-xs text-muted-foreground mb-2">{t('maxImageSize')}</p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Review ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" size="sm" disabled={uploading}>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {t('uploadImages')}
                  </Button>
                </label>
              </div>

              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t('submitReview')}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">{t('loginToReview')}</p>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('reviews')} ({reviews.length})</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('noReviews')}</p>
            <p className="text-sm">{t('beFirstReview')}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {review.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{review.profiles?.full_name || 'User'}</p>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating, false, 'w-4 h-4')}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(review.created_at), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="mt-2 text-sm">{review.comment}</p>
                    )}
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Review image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(img, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
