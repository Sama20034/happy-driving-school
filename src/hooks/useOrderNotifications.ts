import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Notification sound as base64 (a simple beep sound)
const NOTIFICATION_SOUND_BASE64 = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2AhYuNj4+Nj4+NiYF7dXBsamdpaW1vcXZ7f4OHioqKioqIhYB6dG5oY2BgYWVpa3B0eH6DhoqLi4uKiIWBe3VwamViYGBhZWlsc3d7f4OGiYqKioiGg392cWxnYl9eXmBkaGxwd3t+goWIiYmJh4WBfXhybWhjYGBgYmVoa3B0eH2Bg4aIiIiHhYJ+eXRvamViX19fYWRobHB0eHyAg4aHh4eGhIB8d3JtaGRhYGBhZGdrbXJ2en6BhIaHh4aFgn56dXBraGRiYWFiZGdqbnJ2eXyAg4WHh4aEgn55dHBraGVjYmJjZWdqbnF1eHuAgoSGhoaFg4B8eHRwa2hlY2NjZGZpbG9zeHt+gYOFhoaFg4F9eXVxbWpmZGNjZGZobG9yeXx/gYSFhoWEgn96dnJuamhmZGRkZWhrbW9zeXx/gYOFhYWEgn56dnJuamhmZWVlZmhqbXBzdnt+gYOEhISEgn96dnJua2hmZmZmaGpsbm9zeXx/gYOEhISDgX55dXFua2hmZmZnaGpsbXBydn2AgoODg4OCgH13dHBtamhmZ2doaWtsbm9zd3yAgoODg4KBfnp2c3BtamhoaGhoamtsbm9zd3t/gYKDg4OBf3x4dXJvbGppaWlpaWtrbG5xdHl9gIGCg4OBgH15dnNwbWtpaWlpamprb21vcXV5fYCBgoKCgYB9eXZzcG1ramprampqa2xub3F1en2AgoKCgoGAfXl2c3Bta2pqa2trbGxtbm9xdXl9gIGCgoKBf3x5dnNwbmtqamtramprbG5wcnV5fYCBgoKCgX98eXZzb21rampqa2trbGxtbnBydn2AgoKCgoF+fHl2c3Bta2pqa2trbGxtbm5vdHh9gYKCgoKAfXp3dHFubGpqa2trbGxtbW1vc3d7gIKCgoKAfXp4dXJvbGtqa2trbGxsbG1vcnZ6f4GCgoKBfnx5dnNwbWxra2trbGxsbG1ucHR4fIGCgoKBf3x5dnNwbWxra2tramprbG1ucHR4fICBgoKBf3x5dnRxb2xra2tra2xsbG1ub3J2en6BgoKBgH17eHVzcG1sa2tramprbG1tbm9ydnqAgoKBgH57eHZ0cm9tbGtra2trbG1ubm9ydnl9gYGBgIB+e3h2dHJwbm1sbGtra2xtbm9xcnZ5fYCAgYGAfnx5d3VzcW9ubWxsa2xsbGxtbnFzeHyAgoGAgH58enhzdHBubW1sa2xsbGxsbG5wdHh9gYKAgH58enl2dHJwbm5tbWxsbGxsbWxwc3d7f4CBf35+fHp4dnRycG5ubWxtbGxsbGxtcHN3fICBgH98e3l3dXNxb25tbW1sbGxsbG1ucXV5fH+Af359e3p4dnVzcW9ubm1tbGxsbGxtbnF0eHx/f35+fHt5d3V0cm9vbm5tbW1sbGxtbnF1eHx+f358e3t5d3V0cnBvbm5tbWxsbGxtbXBzeHyAf39+fHt5eHZ0c3FvbW1tbGxsbGxsbG1ucXV5fX9/fnx7enh2dXNxb29vbm1tbGxsbGxucHR3fH9/fn18enh2dHNxcG9vbm5tbWxsbGxtb3F1eX1/f358e3p4dnRzcG5ubm1tbWxsbGxtbnJ2en1+fn18enh3dXRycG9vbm1tbWxsbGxsbnB0eHx+fn18fHl4dnVzcXBvbm5ubW1sbGxsbG9ydXl9fn18e3p4d3V0cnFwbm5ubW1tbWxsbGxucHN3fH9+fXx6eXd2dHNxb25ubW1tbWxsbGxsbnF0eHt9fXx7eXh2dXNxcG9vbm5tbWxtbGxsbnF0d3t9fXx7eXh2dXNxcG9vbm5ubW1tbGxtbnB0d3p9fXt7eXh2dHNxcHBvb25ubW1tbWxsb3F0d3p9fXt6eXh2dXNxcHBvb25tbW1tbW1sb3F0d3p9fXt6eHd2dHNxcG9vb29ubm5tbW1sb3J1eHt8fHp5d3Z0c3FwcG9vb25ubm1tbWxvc3V4fHx7enh3dXRyc3Fwb29vb25tbm1tbW5wc3Z5fHx7enh3dXNycHBwb29vb25tbm1tb3F0d3l8e3t5d3Z1c3JxcHBwb29vbm5ubW1ub3F0dnl7e3p4d3Z0c3JxcXBwb29vbm5ubW1ucHJ1d3l7e3l4d3Z0c3JxcHBwb29vbm5ubW5vc3V4ent6eXh2dXRzcnFwcG9vb29ubm5ubnByc3Z4enl5eHd2dHNycXFwcHBvb25ubm1ucHJzdnl6eXl3dnV0c3JxcXBwb29vbm5ubm5wc3V4enp5eHd2dHRycXFwcHBvb25ubm5ucHN1d3l6eXh3d3V0c3JycXFwcG9vb25ubm5wcnR3eXl5eHd2dXRzcnJxcHBwb29vbm5ubnByc3Z4enp4d3Z1dHNycnFxcHBwb29vbm5ucHN1d3l6eXh3dnV0c3JycXBwcG9vb29ubnByc3Z4enl4d3Z1dHNycnFxcHBwb29vbm5wc3V3eXp5eHd2dXR0c3JycXFwcG9vb29ucHJ0d3l5eXh3dnV0c3NycnFxcHBwb29vb3Byc3Z3eHl4d3Z1dHRzcnJxcXBwcG9vb29wc3R2eHl5eHd2dXR0c3NycXFwcHBwb29wcXN0dnl5eXh3dnV0dHNzc3JxcXBwcG9vcHFzc3V3eHl4d3Z2dXRzc3NycnFxcHBwb3BydHZ4eXl4d3Z1dHRzc3JycnFxcHBwcHBxdHV3eHl4d3Z2dXRzc3NycnJxcHBwb3BydHZ3eHh3d3Z1dHRzc3JycnFxcHBwcHJzdHZ3eHh3dnZ1dHRzc3JycnFxcHBwcHJ0dXd3d3d2dnV0dHNzc3JycXFwcHBycnR2d3d3dnZ1dXRzc3NycnJxcHBwcHFzdHV2d3d3dnV1dXRzc3NycnJxcXBwcHN0dXZ3d3d2dXV1dHNzc3JycnFxcHBxc3R1d3d3dnZ1dXR0c3NzcnJycXFwcHFzc3R2dnZ2dnV1dHRzc3NzcnJxcXFxc3N0dnZ2dnV1dHR0c3Nzc3JycnFxcXJ0dXV2d3Z2dXR0dHNzc3NycnJxcXJzdHZ2dnZ1dHR0c3Nzc3JycnFxcXN0dXV2dnV1dXR0c3Nzc3NycnFxcnN0dXZ2dXV1dHR0c3Nzc3JycnFycnN0dXV1dXV1dHR0c3Nzc3NycnJycnN0dXV1dXV0dHRzc3Nzc3NycnJyc3N0dXV1dXR0dHRzc3Nzc3NycnJyc3R0dXV1dHR0dHNzc3Nzc3NycnJzc3R1dXR0dHR0c3Nzc3Nzc3NycnNzdHR0dHR0dHRzc3Nzc3Nzc3Jzc3N0dHR0dHR0c3Nzc3Nzc3NzcnNzc3R0dHR0c3Nzc3Nzc3Nzc3NzdHR0dHRzc3Nzc3Nzc3Nzc3N0dHR0dHNzc3Nzc3Nzc3Nzc3R0dHRzc3Nzc3Nzc3Nzc3Nzc3R0dHRzc3Nzc3Nzc3Nzc3Nzc3R0c3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzcnNz";

interface UseOrderNotificationsOptions {
  enabled?: boolean;
  onNewOrder?: (order: any) => void;
}

export const useOrderNotifications = (options: UseOrderNotificationsOptions = {}) => {
  const { enabled = true, onNewOrder } = options;
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastOrderTimeRef = useRef<string | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND_BASE64);
        audioRef.current.volume = 0.7;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Set the initial last order time to now to avoid notifications for existing orders
    lastOrderTimeRef.current = new Date().toISOString();

    // Subscribe to new orders using Supabase Realtime
    const channel = supabase
      .channel("admin-orders-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("New order received:", payload);
          
          // Check if this is actually a new order (after subscription started)
          const orderTime = payload.new.created_at;
          if (lastOrderTimeRef.current && orderTime > lastOrderTimeRef.current) {
            // Play notification sound
            playNotificationSound();
            
            // Show toast notification
            toast.success("🛒 طلب جديد!", {
              description: `طلب جديد من ${payload.new.customer_name}`,
              duration: 5000,
            });
            
            // Invalidate orders query to refresh the list
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            
            // Call the callback if provided
            onNewOrder?.(payload.new);
          }
          
          // Update the last order time
          lastOrderTimeRef.current = orderTime;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, playNotificationSound, queryClient, onNewOrder]);

  return {
    playNotificationSound,
  };
};
