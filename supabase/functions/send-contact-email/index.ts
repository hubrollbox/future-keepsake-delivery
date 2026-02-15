import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from '../_shared/cors.ts';

// Startup secret validation
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    `Missing required secrets: ${[
      !RESEND_API_KEY && "RESEND_API_KEY",
      !SUPABASE_URL && "SUPABASE_URL",
      !SUPABASE_SERVICE_ROLE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean).join(", ")}`
  );
}

const resend = new Resend(RESEND_API_KEY);

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per hour per IP

// Helper to mask email for logging
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***@***";
  const maskedUser = user.length > 2 ? user[0] + "***" + user[user.length - 1] : "***";
  const domainParts = domain.split(".");
  const maskedDomain = domainParts[0].length > 2 
    ? domainParts[0][0] + "***" 
    : "***";
  return `${maskedUser}@${maskedDomain}.${domainParts.slice(1).join(".")}`;
}

// Helper to mask IP for logging
function maskIP(ip: string): string {
  if (ip === "unknown") return ip;
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.substring(0, 10) + "***";
}

async function isRateLimited(clientIP: string): Promise<boolean> {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const endpoint = "send-contact-email";

  try {
    const { data: existing, error: selectError } = await supabase
      .from("rate_limit_tracking")
      .select("id, request_count, window_start")
      .eq("client_ip", clientIP)
      .eq("endpoint", endpoint)
      .gte("window_start", windowStart)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Rate limit check error:", selectError.message);
      return true;
    }

    if (existing) {
      if (existing.request_count >= MAX_REQUESTS_PER_WINDOW) {
        console.log(`Rate limit exceeded for IP: ${maskIP(clientIP)}`);
        return true;
      }

      await supabase
        .from("rate_limit_tracking")
        .update({ request_count: existing.request_count + 1 })
        .eq("id", existing.id);
    } else {
      await supabase.from("rate_limit_tracking").insert({
        client_ip: clientIP,
        endpoint: endpoint,
        request_count: 1,
        window_start: new Date().toISOString(),
      });
    }

    return false;
  } catch (error) {
    console.error("Rate limiting error:", (error as Error).message);
    return true;
  }
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin') || undefined);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   req.headers.get("x-real-ip") || 
                   "unknown";
  
  if (await isRateLimited(clientIP)) {
    console.log(`Rate limited request from IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ 
        error: "Demasiados pedidos. Tente novamente mais tarde.",
        retryAfter: 3600 
      }),
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": "3600",
          ...corsHeaders 
        },
      }
    );
  }

  // HTML escape function to prevent XSS
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Formato de email inválido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Um ou mais campos excedem o tamanho máximo permitido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing contact email from: ${maskEmail(email)} (IP: ${maskIP(clientIP)})`);

    const adminEmailResponse = await resend.emails.send({
      from: "FuturoPresente <noreply@futurodopresente.com>",
      to: ["brandadministration@gmail.com"],
      subject: `Nova mensagem de contacto: ${escapeHtml(subject).substring(0, 100)}`,
      html: `
        <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
          <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #E63946;">
            <h1 style="color: #262626; margin-bottom: 20px; font-size: 24px;">Nova Mensagem de Contacto</h1>
            <div style="margin-bottom: 20px; padding: 15px; background-color: #F5F5F5; border-radius: 8px;">
              <h3 style="color: #262626; margin: 0 0 10px 0;">Detalhes do Contacto:</h3>
              <p style="margin: 5px 0; color: #262626;"><strong>Nome:</strong> ${escapeHtml(name)}</p>
              <p style="margin: 5px 0; color: #262626;"><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p style="margin: 5px 0; color: #262626;"><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
            </div>
            <div style="margin-bottom: 20px;">
              <h3 style="color: #262626; margin-bottom: 10px;">Mensagem:</h3>
              <div style="background-color: #F5F5F5; padding: 15px; border-radius: 8px; border-left: 4px solid #E63946;">
                <p style="color: #262626; line-height: 1.6; margin: 0;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #7A7A7A; font-size: 14px; margin: 0;">
                Mensagem enviada através do formulário de contacto do site FuturoPresente
              </p>
            </div>
          </div>
        </div>
      `,
    });

    const userEmailResponse = await resend.emails.send({
      from: "FuturoPresente <noreply@futurodopresente.com>",
      to: [email],
      subject: "Mensagem recebida - FuturoPresente",
      html: `
        <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">
          <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #E63946;">
            <h1 style="color: #262626; margin-bottom: 20px; font-size: 24px;">Obrigado pelo seu contacto!</h1>
            <p style="color: #262626; line-height: 1.6; margin-bottom: 20px;">
              Olá ${escapeHtml(name)},
            </p>
            <p style="color: #262626; line-height: 1.6; margin-bottom: 20px;">
              Recebemos a sua mensagem sobre "<strong>${escapeHtml(subject)}</strong>" e entraremos em contacto consigo o mais brevemente possível.
            </p>
            <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #262626; margin: 0; font-style: italic;">
                "O FuturoPresente nasceu de um gesto íntimo: uma mensagem escrita por um pai à filha, para ser lida aos 18 anos. 
                Mais do que uma aplicação tecnológica, é um espaço de memória, sensibilidade e presença."
              </p>
            </div>
            <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
              Até breve,<br>
              <strong>Equipa FuturoPresente</strong>
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                Presente no futuro
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse.data?.id || "success");
    console.log("User confirmation email sent:", userEmailResponse.data?.id || "success");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Mensagem enviada com sucesso! Receberá uma confirmação por email." 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Erro ao enviar mensagem. Tente novamente."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
