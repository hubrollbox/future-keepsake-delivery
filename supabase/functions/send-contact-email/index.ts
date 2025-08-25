
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "FuturoPresente <noreply@futurodopresente.com>",
      to: ["brandadministration@gmail.com"],
      subject: `Nova mensagem de contacto: ${subject}`,
      html: `
        <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F2F8;">
          <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #DAB8C3;">
            <h1 style="color: #3D4A5A; margin-bottom: 20px; font-size: 24px;">Nova Mensagem de Contacto</h1>
            
            <div style="margin-bottom: 20px; padding: 15px; background-color: #ECE5DA; border-radius: 8px;">
              <h3 style="color: #3D4A5A; margin: 0 0 10px 0;">Detalhes do Contacto:</h3>
              <p style="margin: 5px 0; color: #3D4A5A;"><strong>Nome:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #3D4A5A;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #3D4A5A;"><strong>Assunto:</strong> ${subject}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #3D4A5A; margin-bottom: 10px;">Mensagem:</h3>
              <div style="background-color: #F5F2F8; padding: 15px; border-radius: 8px; border-left: 4px solid #DAB8C3;">
                <p style="color: #3D4A5A; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #A0AEC0; font-size: 14px; margin: 0;">
                Mensagem enviada através do formulário de contacto do site FuturoPresente
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "FuturoPresente <noreply@futurodopresente.com>",
      to: [email],
      subject: "Mensagem recebida - FuturoPresente",
      html: `
        <div style="font-family: 'Fraunces', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F2F8;">
          <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #DAB8C3;">
            <h1 style="color: #3D4A5A; margin-bottom: 20px; font-size: 24px;">Obrigado pelo seu contacto!</h1>
            
            <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
              Olá ${name},
            </p>
            
            <p style="color: #3D4A5A; line-height: 1.6; margin-bottom: 20px;">
              Recebemos a sua mensagem sobre "<strong>${subject}</strong>" e entraremos em contacto consigo o mais brevemente possível.
            </p>
            
            <div style="background-color: #ECE5DA; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #3D4A5A; margin: 0; font-style: italic;">
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

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User confirmation email sent:", userEmailResponse);

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
        error: "Erro ao enviar mensagem. Tente novamente.", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
