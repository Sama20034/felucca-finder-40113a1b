import { useState, useEffect } from "react";
import { Star, Send, Quote, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  admin_reply: string | null;
  created_at: string;
}

const StarRating = ({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-transform duration-200 ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hover || rating)
                ? "text-primary fill-primary"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const CustomerReviews = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("customer_reviews")
      .select("id, name, rating, comment, admin_reply, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setReviews(data as Review[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      toast({
        title: isRTL ? "يرجى ملء جميع الحقول" : "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("customer_reviews").insert({
      name: name.trim(),
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: isRTL ? "حدث خطأ" : "Error", variant: "destructive" });
    } else {
      toast({
        title: isRTL
          ? "شكراً لتقييمك! ✨"
          : "Thank you for your review! ✨",
      });
      setName("");
      setRating(0);
      setComment("");
      fetchReviews();
    }
  };

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const colors = [
    "from-primary/80 to-primary",
    "from-accent/80 to-accent",
    "from-secondary to-primary/60",
    "from-primary/60 to-accent/80",
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary/60 text-xs tracking-[0.4em] uppercase mb-4">
            <Sparkles className="w-4 h-4" />
            {isRTL ? "آراء عملائنا" : "Customer Reviews"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            {isRTL ? "شاركينا تجربتك" : "Share Your Experience"}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {isRTL
              ? "رأيك يهمنا! شاركينا تجربتك مع منتجاتنا"
              : "Your opinion matters! Share your experience with our products"}
          </p>
        </motion.div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <form
            onSubmit={handleSubmit}
            className="relative p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg"
          >
            <Quote className="absolute top-4 right-4 w-10 h-10 text-primary/10" />

            <div className="space-y-5">
              {/* Rating */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {isRTL ? "تقييمك" : "Your Rating"}
                </p>
                <div className="flex justify-center">
                  <StarRating rating={rating} onRate={setRating} interactive />
                </div>
              </div>

              {/* Name */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRTL ? "اسمك" : "Your Name"}
                maxLength={50}
                className="w-full px-5 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-card-foreground placeholder:text-muted-foreground"
              />

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isRTL ? "اكتبي تجربتك مع المنتج..." : "Write about your experience..."}
                maxLength={500}
                rows={4}
                className="w-full px-5 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-card-foreground placeholder:text-muted-foreground resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting
                  ? isRTL
                    ? "جاري الإرسال..."
                    : "Submitting..."
                  : isRTL
                    ? "أرسلي تقييمك"
                    : "Submit Review"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Reviews Horizontal Scroll */}
        {!loading && reviews.length > 0 && (
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex gap-5" style={{ minWidth: 'max-content' }}>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="group relative w-[300px] md:w-[340px] shrink-0 p-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl transition-all duration-500"
                  >
                    <Quote className="absolute top-3 right-3 w-8 h-8 text-primary/8" />

                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-bold shadow-md`}
                      >
                        {getInitials(review.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-card-foreground truncate">
                          {review.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString(
                            isRTL ? "ar-EG" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>

                    <StarRating rating={review.rating} />

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {review.comment}
                    </p>

                    {review.admin_reply && (
                      <div className="mt-3 pt-3 border-t border-border/40">
                        <p className="text-xs font-semibold text-primary mb-1">
                          {isRTL ? "رد الإدارة:" : "Admin Reply:"}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {review.admin_reply}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Scroll hint gradient */}
            <div className="absolute top-0 bottom-4 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <p className="text-center text-muted-foreground">
            {isRTL
              ? "كوني أول من يشارك تجربتها! ✨"
              : "Be the first to share your experience! ✨"}
          </p>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;
