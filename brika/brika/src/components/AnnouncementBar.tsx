import { useState } from "react";
import { X } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function AnnouncementBar() {
  const { settings } = useSettings();
  const [hidden, setHidden] = useState(false);

  if (!settings.announcement_active || !settings.announcement_text || hidden) return null;

  return (
    <div className="relative bg-azur text-paper">
      <div className="wrap flex items-center justify-center py-2.5">
        <p className="text-center text-[12.5px] font-medium tracking-wide">
          {settings.announcement_text}
        </p>
        <button
          aria-label="Dismiss announcement"
          onClick={() => setHidden(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 transition hover:opacity-100"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
