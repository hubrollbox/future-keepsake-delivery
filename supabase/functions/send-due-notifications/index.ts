import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Require shared cron secret for this scheduled job
  const cronSecret = Deno.env.get("CRON_SECRET");
  const provided = req.headers.get("x-cron-secret");
  if (!cronSecret || provided !== cronSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Only mark notifications whose delivery_date is due and still pending
  const nowIso = new Date().toISOString();
  const { data, error: selectError } = await supabase
    .from("scheduled_notifications")
    .select("id")
    .eq("status", "pending")
    .lte("delivery_date", nowIso);

  if (selectError) {
    return new Response(selectError.message, { status: 500 });
  }

  const ids = (data ?? []).map((row: { id: string }) => row.id);

  if (ids.length === 0) {
    return new Response("OK", { status: 200 });
  }

  const { error } = await supabase
    .from("scheduled_notifications")
    .update({ status: "sent", sent_at: nowIso })
    .in("id", ids);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
