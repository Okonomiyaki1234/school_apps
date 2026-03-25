import { supabase } from "@/lib/supabase";

// type: 'vertical' or 'horizontal'
export async function getRandomApprovedAd(type = "vertical") {
  // 承認済み広告を全件取得
  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("ad_type", type)
    .eq("status", "approved");
  if (error) throw error;
  if (!data || data.length === 0) return null;
  // 偏りなくランダム選出
  const idx = Math.floor(Math.random() * data.length);
  return data[idx];
}
