// Script para testar a Edge Function localmente usando fetch
import 'dotenv/config';

async function testLocalFunction() {
  try {
    console.log('Testando a função send-keepsakes localmente...');
    
    // URL da função local
    const functionUrl = 'http://localhost:54321/functions/v1/send-keepsakes';
    
    // Obter a chave de serviço do Supabase
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseServiceKey) {
      console.error('Erro: Variável de ambiente SUPABASE_SERVICE_ROLE_KEY não está definida');
      process.exit(1);
    }
    
    // Configurar cabeçalhos da requisição
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`
    };
    
    // Fazer a requisição para a função
    console.log(`Enviando requisição para ${functionUrl}...`);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({})
    });
    
    // Obter a resposta
    const responseData = await response.json();
    
    console.log('Status da resposta:', response.status);
    console.log('Resposta:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('Teste concluído com sucesso!');
    } else {
      console.error('Erro ao testar a função!');
    }
    
  } catch (error) {
    console.error('Erro durante o teste:', error);
    process.exit(1);
  }
}

// Executar o teste
testLocalFunction();
