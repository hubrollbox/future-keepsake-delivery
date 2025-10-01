// Script para testar o envio de emails usando o Resend
import { Resend } from 'resend';
import 'dotenv/config';

async function testResendEmail() {
  try {
    console.log('Testando o envio de emails usando o Resend...');
    
    // Obter a API key do Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('Erro: Variável de ambiente RESEND_API_KEY não está definida');
      console.log('Adicione RESEND_API_KEY=sua-api-key ao arquivo .env');
      process.exit(1);
    }
    
    // Inicializar o cliente Resend
    const resend = new Resend(resendApiKey);
    
    // Email de teste
    const testEmail = process.argv[2];
    
    if (!testEmail) {
      console.error('Erro: Email de teste não fornecido');
      console.log('Uso: node scripts/testResendEmail.js seu-email@exemplo.com');
      process.exit(1);
    }
    
    console.log(`Enviando email de teste para ${testEmail}...`);
    
    // Enviar email de teste
    const { data, error } = await resend.emails.send({
      from: 'Keepla <onboarding@resend.dev>',
      to: testEmail,
      subject: 'Teste de Envio de Email - Keepla',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a5568;">Teste de Envio de Email</h1>
          <p>Este é um email de teste da plataforma Keepla para verificar a configuração do Resend.</p>
          <p>Se você está recebendo este email, significa que a configuração do Resend está funcionando corretamente!</p>
          <div style="margin-top: 30px; padding: 20px; background-color: #f7fafc; border-radius: 5px;">
            <h2 style="color: #4a5568; margin-top: 0;">Detalhes do Teste</h2>
            <p><strong>Data e Hora:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Email de Destino:</strong> ${testEmail}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 14px;">
            <p>Este é um email automático de teste. Por favor, não responda.</p>
            <p>&copy; ${new Date().getFullYear()} Keepla - Todos os direitos reservados</p>
          </div>
        </div>
      `
    });
    
    if (error) {
      console.error('Erro ao enviar email:', error);
      process.exit(1);
    }
    
    console.log('Email enviado com sucesso!');
    console.log('ID do email:', data.id);
    
  } catch (error) {
    console.error('Erro durante o teste:', error);
    process.exit(1);
  }
}

// Executar o teste
testResendEmail();