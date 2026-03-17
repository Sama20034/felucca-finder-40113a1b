import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  message: string;
}

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, message")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  const marqueeText = announcements.map((a) => a.message).join("   ✦   ");

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap py-2 text-xs font-medium md:text-sm" dir="ltr">
      <div className="announcement-marquee flex w-max items-center">
        <span className="px-4">{marqueeText}   ✦   </span>
        <span className="px-4" aria-hidden="true">{marqueeText}   ✦   </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
