import { getRandomApprovedAd } from "@/lib/ad";
import { useEffect, useState } from "react";

export default function AdBanner({ type = "vertical" }) {
  const [ad, setAd] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getRandomApprovedAd(type)
      .then(setAd)
      .catch(e => setError(e.message));
  }, [type]);

  if (error) return <div style={{ color: '#d32f2f' }}>広告取得エラー: {error}</div>;
  if (!ad) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 8 }}>
      <img
        src={ad.image_url}
        alt="広告"
        style={
          type === "vertical"
            ? { width: 120, height: 600, objectFit: "cover", borderRadius: 8 }
            : { width: 728, height: 90, objectFit: "cover", borderRadius: 8 }
        }
      />
      {/* メッセージは広告表示時には非表示 */}
    </div>
  );
}
