import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Star, MessageSquare, Send } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  admin_reply: string | null;
  created_at: string;
}

const ReviewsManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("id, name, rating, comment, admin_reply, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("customer_reviews").delete().eq("id", id);
    if (!error) {
      toast({ title: "تم حذف التقييم" });
      fetchReviews();
    } else {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    }
  };

  const handleReply = async (id: string) => {
    const reply = replyInputs[id]?.trim();
    if (!reply) return;
    const { error } = await supabase
      .from("customer_reviews")
      .update({ admin_reply: reply })
      .eq("id", id);
    if (!error) {
      toast({ title: "تم إرسال الرد" });
      setReplyInputs((prev) => ({ ...prev, [id]: "" }));
      fetchReviews();
    } else {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          إدارة التقييمات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-muted-foreground text-center py-4">جاري التحميل...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">لا توجد تقييمات بعد.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-lg border border-border bg-secondary/20 space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-card-foreground">{review.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("ar-EG")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(review.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comment */}
              <p className="text-sm text-card-foreground">{review.comment}</p>

              {/* Existing reply */}
              {review.admin_reply && (
                <div className="bg-primary/10 rounded-lg p-3 text-sm flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-primary text-xs">ردك: </span>
                    <span className="text-card-foreground">{review.admin_reply}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteReply(review.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 shrink-0"
                    title="حذف الرد"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

              {/* Reply input */}
              <div className="flex gap-2">
                <Input
                  value={replyInputs[review.id] || ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({ ...prev, [review.id]: e.target.value }))
                  }
                  placeholder={review.admin_reply ? "تعديل الرد..." : "اكتب رد..."}
                  onKeyDown={(e) => e.key === "Enter" && handleReply(review.id)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleReply(review.id)}
                  className="gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  رد
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsManager;
