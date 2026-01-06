import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase
    .from("scheduled_notifications")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .in(
      "id",
      supabase
        .from("scheduled_notifications")
        .select("id", { count: "exact", head: true })
    );

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
